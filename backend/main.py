from fastapi import FastAPI, WebSocket, HTTPException
from pydantic import BaseModel
from starlette.websockets import WebSocket, WebSocketState
from collections import Counter
import numpy as np
import cv2
import base64
import asyncio
from typing import Dict, List

from fastapi.middleware.cors import CORSMiddleware

from utils.yolo_model import PoseModel, PoseVisualizer
from utils.condition_check import burpees, pull_up, cross_lunge, side_lateral_raise, barbell_squat, push_up 
from utils.countings import count_burpees, count_pull_up, count_cross_lunge, count_side_lateral_raise, count_barbell_squat, count_push_up

# 운동 유형에 따른 조건 체크 및 카운팅 함수를 매핑
exercise_functions = {
    "burpees": (burpees, count_burpees),
    "pull_up": (pull_up, count_pull_up),
    "cross_lunge": (cross_lunge, count_cross_lunge),
    "side_lateral_raise": (side_lateral_raise, count_side_lateral_raise),
    "barbell_squat": (barbell_squat, count_barbell_squat), 
    "push_up": (push_up, count_push_up)
}

app = FastAPI()

# CORS 정책 설정: 모든 출처에서의 요청을 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 포즈 인식 모델 및 시각화 도구 초기화
pose_model = PoseModel("./s_6_best.pt")
visualizer = PoseVisualizer()

required_sequence_length = 16 # 키포인트 시퀀스의 요구 길이
h = 640 # 이미지 높이
w = 640 # 이미지 너비

# 전역 변수로 데이터 저장
global_data_store = {
    "exercise_counter": Counter(), # 각 운동별 운동 횟수를 카운트할 카운터
    "conditions_counter": Counter(), # 조건들을 카운트할 카운터
    "total_exercises": 12  # 예시 목표 횟수
}

# global_data_store = {
#     "exercise_counter": Counter({"push_up": 30, "pull_up": 20, "side_lateral_raise": 15, "barbell_squat": 0, "cross_lunge": 3, "burpees": 1}),  # 테스트 데이터
#     "conditions_counter": Counter({"Good Form": 40, "Improper Alignment": 10, "Too Fast": 15}),  # 테스트 데이터
#     "total_exercises": 100  # 예시 목표 횟수
# }

class ExerciseData(BaseModel):
    exerciseType: str

class Statistics(BaseModel):
    exerciseCount: Dict[str, int]
    achievementRate: Dict[str, float]
    feedbackCount: Dict[str, int]


# '/exercise' 경로에 대한 POST 요청 처리
@app.post("/exercise")
async def receive_exercise_data(data: ExerciseData):
    return {"message": "Data received"}

# 전역 변수 초기화를 위한 HTTP 엔드포인트
@app.post("/reset")
async def reset_global_data():
    global_data_store["exercise_counter"].clear()
    global_data_store["conditions_counter"].clear()
    return {"message": "Global data reset successfully"}

# 통계 데이터를 반환하는 새로운 HTTP 엔드포인트
@app.get("/statistics")
async def get_statistics():
    achieved_exercises = sum(global_data_store["exercise_counter"].values())
    achievement_rate = (achieved_exercises / global_data_store["total_exercises"]) * 100

    statistics = Statistics(
        exerciseCount=dict(global_data_store["exercise_counter"]),
        achievementRate={"achieved": achieved_exercises, "total": global_data_store["total_exercises"], "rate": achievement_rate},
        feedbackCount=dict(global_data_store["conditions_counter"])
    )
    return statistics

# WebSocket 연결을 처리하는 엔드포인트
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    exercise_type = None # 클라이언트로부터 받은 운동 유형을 저장할 변수
    keypoints_sequence = []  # 키포인트 시퀀스를 저장할 리스트
    flag = False  # 카운팅 로직에서 사용할 플래그
    # 클라이언트로부터 새로운 연결이 시작되면 global_data_store 초기화
    # global_data_store["exercise_counter"].clear()
    global_data_store["conditions_counter"].clear()
    
    countIncreased = 0
    active = False
     
    try:
        while True:
            # 메시지를 받기 위해 최대 30초 대기
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30) 
                
                # 클라이언트로부터 "reset" 메시지 수신 시 전역 변수 초기화
                if data == '{"type": "reset"}':
                    global_data_store["exercise_counter"].clear()
                    global_data_store["conditions_counter"].clear()
                    print("Data reset")
                    continue              

                # 클라이언트로부터 'close_connection' 메시지 수신 시 연결 종료
                if data == '{"type": "close_connection"}':
                    break

            except asyncio.TimeoutError:
                # If timeout, send a ping to keep the connection alive
                await websocket.send_text('{"message": "keep-alive"}')
                continue

            # 운동 유형이 설정되지 않았다면, 첫 번째 메시지에서 운동 유형을 설정
            if exercise_type is None:
                exercise_type = data
                check_fn, count_fn = exercise_functions[exercise_type] # 운동 유형에 따라 정의된 조건 체크 및 카운트 함수를 가져옴
                continue
            
            # 받은 데이터로부터 프레임 처리
            frame_base64, keypoints = await process_frame(data)
            if frame_base64:
                await websocket.send_json({'frame': frame_base64})

                condition_result = set()  # 빈 set으로 초기화

                # 키포인트 데이터가 유효하면 키포인트 시퀀스에 추가
                if keypoints is not None and keypoints.size > 0:
                    normalized_kpts = [[x / w, y / h] for x, y in keypoints]
                    keypoints_sequence.append(normalized_kpts)
                
                    # 필요한 시퀀스 길이에 도달하면 운동 조건 및 카운트 체크
                    if len(keypoints_sequence) == required_sequence_length:
                        active = True
                        # 조건 체크 함수를 사용하여 키포인트 시퀀스에 대한 조건 결과를 얻습니다.
                        condition_check_result = check_fn([keypoints_sequence])

                        # 결과 리스트에 요소가 있을 때만 첫 번째 요소에 접근합니다.
                        if condition_check_result:
                            condition_result = condition_check_result[0]
                            # print(condition_result)
                            keypoints_sequence = [] # 시퀀스 초기화 

                        # 조건 결과가 set 형태라면, JSON으로 전송하기 위해 list 형태로 변환
                        if isinstance(condition_result, set):
                            condition_result_list = list(condition_result)

                        # 조건들을 카운터에 추가하여, 각 조건이 얼마나 자주 발생하는지 추적
                        for condition in condition_result_list:
                            # conditions_counter[condition] += 1
                            global_data_store["conditions_counter"][condition] += 1
                #if active:
                        # 카운트 함수를 사용하여 운동 횟수를 세고, 필요한 경우 flag를 업데이트합니다.
                        countIncreased, flag = count_fn([[x / w, y / h] for x, y in keypoints], flag)
                        if flag:
                            global_data_store["exercise_counter"][exercise_type] += 1

                # global_data_store["conditions_counter"] 객체를 배열로 변환
                conditions_counter_array = [
                    {"condition": key, "count": value}
                    for key, value in global_data_store["conditions_counter"].items()
                ]
            # 데이터 전송 전에 웹소켓 연결 상태 확인    
            if websocket.application_state == WebSocketState.CONNECTED:
                # 연결이 여전히 활성화되어 있으면 데이터 전송
                await websocket.send_json({'condition': conditions_counter_array, 'countIncreased': global_data_store["exercise_counter"][exercise_type]})
            else:
                break
    except Exception as e:
        print("WebSocket connection error:", e)
    finally:
        # 연결이 여전히 활성화되어 있으면 닫음
        if websocket.application_state != WebSocketState.DISCONNECTED:
            await websocket.close()

# 클라이언트로부터 받은 이미지 데이터를 처리하는 함수
async def process_frame(img_data):
    try:
        # Base64 인코딩된 데이터 분리 및 디코딩
        encoded_data = img_data.split(',')[1] if ',' in img_data else img_data

        # Base64 데이터의 길이가 4의 배수가 되도록 패딩을 추가할 필요가 있는지 확인
        if len(encoded_data) % 4 != 0:
            # 길이가 맞지 않으면 이 프레임을 무시
            print("Received data with incorrect padding, skipping this frame.")
            return None, None

        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)

        # 버퍼가 비어있지 않은지 확인
        if nparr.size == 0:
            print("Empty buffer received")
            return None, None

        # 이미지 디코딩
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # Ensure the frame was correctly decoded
        if frame is None:
            print("Frame could not be decoded")
            return None, None

        # 포즈 인식 및 시각화
        keypoints = pose_model.predict(frame)
        frame = visualizer.visualize_keypoints(frame, keypoints)
        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        return frame_base64, keypoints
    except Exception as e:
        print("Error during model prediction:", e)
        return None, None

