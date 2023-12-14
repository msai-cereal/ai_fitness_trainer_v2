import numpy as np
from numpy import degrees, arccos, dot
from numpy.linalg import norm

# 정규화된 키포인트
# pt = np.random.uniform
# data = np.array([[np.squeeze(np.array([[pt(0, 1), pt(0, 1)] for _ in range(24)])) for _ in range(16)]])
# data = data.tolist()

# cos 법칙으로 각 ABC를 °(도) 단위로 구하는 함수
def cal_angle(A, B, C):
    if A == B or C == B:
        return 180
    A, B, C = map(np.array, (A, B, C))
    angle = degrees(arccos(min(max(dot(A - B, C - B) / (norm(B - A) * norm(C - B)), -1.0), 1.0)))
    return angle


# 두 점 사이의 거리를 구하는 함수
def cal_distance(A, B):
    distance = ((A[0] - B[0]) ** 2 + (A[1] - B[1]) ** 2) ** 0.5
    return distance


# 과거와 현재 값 비교해서 얼마나 차이가 나는 지 확인하는 코드
def past_current(past, current, error_message: set, message: str, threshold: float, mode=False):
    if past:
        if mode:
            if abs(current - past) < threshold:
                error_message.add(message)
        elif abs(current - past) > threshold:
            error_message.add(message)
    return current


# 버피
def burpees(data):
    result = []
    error_message = set()
    arm_angle = False
    flag = False
    back_angle = False

    for sequence in data:
        chest_position = []
        waist_position = []
        past_waist = 0

        for pts in sequence:
            Shoulder_L, Shoulder_R = pts[5], pts[6]
            Elbow_L, Elbow_R = pts[7], pts[8]
            Wrist_L, Wrist_R = pts[9], pts[10]
            Knee_L, Knee_R = pts[13], pts[14]
            Neck = pts[17]
            Palm_L, Palm_R = pts[18], pts[19]
            Back, Waist = pts[20], pts[21]

            # 어깨-팔꿈치-손목 각도
            Arm_L = cal_angle(Shoulder_L, Elbow_L, Wrist_L)
            Arm_R = cal_angle(Shoulder_R, Elbow_R, Wrist_R)

            waist_position.append(Waist[0])  # <- np.var(), 아래는 이전 값과 비교하는 방법
            past_waist = past_current(past_waist, Waist[0],
                                      error_message, "Exercise in place.", 0.015)  # 제자리에서 운동하세요

            # 엎드렸을 때(손이 무릎 밑으로 갔을 때)
            if Palm_L[1] > Knee_L[1] and Palm_R[1] > Knee_R[1]:
                flag = True
                # (가슴 대신) 등의 높이 저장
                chest_position.append(Back[1])

                # 팔을 폈으면 허리를 폈는지 확인(아래 둘 중 하나만? 둘 다?)
                if Arm_L > 150 and Arm_R > 150:
                    # 목-등-허리 각도 확인
                    if cal_angle(Neck, Back, Waist) > 170:
                        back_angle = True

                # 팔을 구부렸으면, 충분히 구부렸는지 확인(아래 둘 중 하나만? 둘 다?)
                # 어깨-팔꿈치-손목의 각도 확인
                elif Arm_L < 90 or Arm_R < 90:
                    arm_angle = True
                # 팔꿈치와 어깨의 y좌표 비교
                elif abs(Shoulder_L[1] - Elbow_L[1]) < 0.02 or abs(Shoulder_R[1] - Elbow_R[1]) < 0.02:
                    arm_angle = True

                if not 0.81 < (Palm_L[0] - Back[0])/(Back[0] - Palm_R[0]) < 1.21:
                    error_message.add("Spread your hands the same width.")  # 양손을 같은 너비로 벌려 주세요

        waist_var = np.var(waist_position)
        if waist_var > 0.00006:
            error_message.add("Exercise in place.")

        if flag:
            chest_var = np.var(chest_position)
            # print(chest_var)
            if chest_var < 0.0033:
                error_message.add("Move your chest sufficiently.")  # 엎드렸을 때, 가슴을 충분히 이동하세요
            if not arm_angle:
                error_message.add("Bend your arms more.")  # 팔을 더 구부리세요
            if not back_angle:
                error_message.add("Relax your back.")  # 허리를 피세요

    if len(error_message):
        result.append(error_message)
    else:
        result.append({"Doing well."})

    return result


# 푸쉬업
def push_up(data):
    result = []
    error_message = set()
    arm_angle = False

    for sequence in data:
        Arm = []

        for pts in sequence:
            Shoulder_L, Shoulder_R = pts[5], pts[6]
            Elbow_L, Elbow_R = pts[7], pts[8]
            Wrist_L, Wrist_R = pts[9], pts[10]
            Hip_L, Hip_R = pts[11], pts[12]
            Neck = pts[17]
            Back, Waist = pts[20], pts[21]

            # 어깨-팔꿈치-손목 각도
            Arm_L = cal_angle(Shoulder_L, Elbow_L, Wrist_L)
            Arm_R = cal_angle(Shoulder_R, Elbow_R, Wrist_R)

            # 엎드렸을 때(손이 무릎 밑으로 갔을 때)
            if Elbow_L[1] > Hip_L[1] and Elbow_R[1] > Hip_R[1]:
                # 가슴(등) 이동 >> 어깨-팔꿈치 : 어깨-등 거리비
                Arm.append((min(Elbow_L[1], Elbow_R[1]) - min(Shoulder_L[1], Shoulder_R[1]))/(Back[1] - min(Shoulder_L[1], Shoulder_R[1])))

                # 팔을 폈으면 허리를 폈는지 확인
                if Arm_L > 150 and Arm_R > 150:
                    # 목-등-허리 각도 확인
                    if cal_angle(Neck, Back, Waist) < 165:
                        error_message.add("Relax your back.")

                # 팔을 구부렸으면, 충분히 구부렸는지 확인
                # 어깨-팔꿈치-손목의 각도 확인
                elif Arm_L < 115 or Arm_R < 115:
                    arm_angle = True
                # 팔꿈치와 어깨의 y좌표 비교
                elif abs(Shoulder_L[1] - Elbow_L[1]) < 0.012 or abs(Shoulder_R[1] - Elbow_R[1]) < 0.012:
                    arm_angle = True

        if not arm_angle:
            error_message.add("Bend your arms more.")
        
        # print(max(Arm), min(Arm))
        if max(Arm) < 8 or min(Arm) > 3:
            error_message.add("Move your chest sufficiently.")

    if len(error_message):
        result.append(error_message)
    else:
        result.append({"Doing well."})

    return result


# 사이드 레터럴 레이즈
def side_lateral_raise(data):
    result = []
    error_message = set()

    for sequence in data:
        leg_dist = []  # 발목-무릎-힙 간의 거리: 다리 길이
        top_dist = []  # 목-허리 거리: 상체 길이
        shoulder_position = []
        arml_angle = []  # 어깨-팔꿈치-손목 각도
        armr_angle = []
        handl_angle = []  # 팔꿈치-손목-손바닥 각도
        handr_angle = []

        for pts in sequence:
            Shoulder_L, Shoulder_R = pts[5], pts[6]
            Elbow_L, Elbow_R = pts[7], pts[8]
            Wrist_L, Wrist_R = pts[9], pts[10]
            Hip_L, Hip_R = pts[11], pts[12]
            Knee_L, Knee_R = pts[13], pts[14]
            Ankle_L, Ankle_R = pts[15], pts[16]
            Neck = pts[17]
            Palm_L, Palm_R = pts[18], pts[19]
            Waist =  pts[21]

            if Elbow_L[1] > Wrist_L[1] or Elbow_R[1] > Wrist_R[1]:
                error_message.add("Place your elbows above your wrists.")  # 팔꿈치를 손목보다 위에 두세요

            # np.var()을 이용한 비교
            # 힙-무릎-발목 거리 평균(왼/오) / 목-허리 높이 기록
            leg_dist.append((cal_distance(Hip_L, Knee_L) + cal_distance(Knee_L, Ankle_L)
                             + cal_distance(Hip_R, Knee_R) + cal_distance(Knee_R, Ankle_R)) / 2)
            top_dist.append(cal_distance(Neck, Waist))

            # 어깨 평균(왼/오) 높이 기록
            shoulder_position.append((Shoulder_L[1] + Shoulder_R[1]) / 2)

            # 어깨-팔꿈치-손목 / 팔꿈치-손목-손바닥 각도 기록
            arml_angle.append(cal_angle(Shoulder_L, Elbow_L, Wrist_L))
            armr_angle.append(cal_angle(Shoulder_R, Elbow_R, Wrist_R))
            handl_angle.append(cal_angle(Elbow_L, Wrist_L, Palm_L))
            handr_angle.append(cal_angle(Elbow_R, Wrist_R, Palm_R))

        leg_var = np.var(leg_dist)
        if leg_var > 0.000025:  # 0.00026
            error_message.add("Don't bounce your knees.")

        top_var = np.var(top_dist)
        if top_var > 0.00001:  # 0.00015
            error_message.add("Don't bounce your upper body.")

        shoulder_var = np.var(shoulder_position)
        if shoulder_var > 0.00005:  # 0.00078
            error_message.add("Don't shrug your shoulders.")

        arml_var = np.var(arml_angle)
        armr_var = np.var(armr_angle)
        if arml_var > 150 or armr_var > 150:  # 260
            error_message.add("Fix the your elbows.")

        handl_var = np.var(handl_angle)
        handr_var = np.var(handr_angle)
        if handl_var > 6 or handr_var > 6:  # 40
            error_message.add("Fix the your wrist.")

    if len(error_message):
        result.append(error_message)
    else:
        result.append({"Doing well."})

    return result


# 풀업
def pull_up(data):
    result = []
    error_message = set()

    for sequence in data:
        Elbow_dist = 0  # 팔꿈치 너비

        for pts in sequence:
            Nose = pts[0]
            Eye_L, Eye_R = pts[1], pts[2]
            Ear_L, Ear_R = pts[3], pts[4]
            Shoulder_L, Shoulder_R = pts[5], pts[6]
            Elbow_L, Elbow_R = pts[7], pts[8]
            Hip_L, Hip_R = pts[11], pts[12]
            # Neck = pts[17]

            # 골반이 어깨를 넘어가는지 확인
            if Shoulder_L[0] < Hip_L[0] or Shoulder_R[0] > Hip_R[0]:
                error_message.add("Exercise in place.")

            # 눈-코의 중점과 귀의 중점의 y값(높이) 비교
            if ((Eye_L[1] + Eye_R[1]) / 2 + Nose[1]) / 2 > (Ear_L[1] + Ear_R[1]) / 2 + 0.01:
                error_message.add("Don't bow your head.")  # 고개를 숙이지 마세요

            # if (Shoulder_L[1] + Shoulder_R[1]) / 2 < Neck[1] + 0.01:
            #     error_message.add(
            #         "Please lower your shoulders. / Please pack your shoulders..")  # 어깨를 내려 주세요./ 숄더 패킹 해주세요

            if Shoulder_L[1] > Elbow_L[1] or Shoulder_R[1] > Elbow_R[1]:
                Elbow_dist = max(Elbow_dist, cal_distance(Elbow_L, Elbow_R))
            else:
                if Elbow_dist == 0:
                    continue
                if cal_distance(Elbow_L, Elbow_R) > Elbow_dist * 1.03:  # 여유를 주려면 Elbow_dist *1.05, *1.03, *1.01
                    error_message.add("Pull your elbows toward your body.")  # 수축시 팔꿈치를 몸쪽으로 당겨주세요

    if len(error_message):
        result.append(error_message)
    else:
        result.append({"Doing well."})

    return result


# 크로스 런지
def cross_lunge(data):
    result = []
    error_message = set()

    for sequence in data:
        thighs = 1
        bend_knee = False

        for pts in sequence:
            Shoulder_L, Shoulder_R = pts[5], pts[6]
            Hip_L, Hip_R = pts[11], pts[12]
            Knee_L, Knee_R = pts[13], pts[14]
            Ankle_L, Ankle_R = pts[15], pts[16]
            Neck = pts[17]
            Back, Waist = pts[20], pts[21]
            Foot_L, Foot_R = pts[22], pts[23]

            upper_body = cal_distance(Neck, Waist)  # 상체 길이

            # 구부린 무릎의 허벅지 높이, 정강이 길이
            if Knee_L[1] < Knee_R[1]:  # 왼발이 앞
                thighs = min(thighs, Knee_L[1] - Hip_L[1])
                calf = cal_distance(Knee_L, Ankle_L)
                knee_foot = abs(Knee_L[0] - Ankle_L[0])/cal_distance(Foot_L, Ankle_L)

            else:
                thighs = min(thighs, Knee_R[1] - Hip_R[1])
                calf = cal_distance(Knee_R, Ankle_R)
                knee_foot = abs(Knee_R[0] - Ankle_R[0])/cal_distance(Foot_R, Ankle_R)
            
            # print((Shoulder_L[0] - Back[0])/(Back[0] - Shoulder_R[0]))
            if not 0.85 < (Shoulder_L[0] - Back[0])/(Back[0] - Shoulder_R[0]) < 1.21:
                error_message.add("Please face your upper body straight ahead.")  # 상체를 정면으로 향하게 해주세요
            if upper_body < calf:
                error_message.add("Don't bend your upper body too much.")  # 상체를 너무 숙이지 마세요
            if calf/thighs > 2:
                bend_knee = True
            # print('크로스런지 kf', knee_foot)
            if knee_foot > 1.8:
                error_message.add("Make sure your knees and legs are straight.")

    if not bend_knee:
        error_message.add("Bend your knees more.")  # 무릎을 더 구부리세요
    if len(error_message):
        result.append(error_message)
    else:
        result.append({"Doing well."})
    return result


# 바벨 스쿼트
def barbell_squat(data):
    result = []
    error_message = set()

    for sequence in data:
        Knee_mL = float("inf")
        Knee_mR = float("inf")
        past_foot = 0

        for pts in sequence:
            Nose = pts[0]
            Eye_L, Eye_R = pts[1], pts[2]
            Ear_L, Ear_R = pts[3], pts[4]
            Shoulder_L, Shoulder_R = pts[5], pts[6]
            Hip_L, Hip_R = pts[11], pts[12]
            Knee_L, Knee_R = pts[13], pts[14]
            Ankle_L, Ankle_R = pts[15], pts[16]
            Back = pts[20]
            Foot_L, Foot_R = pts[22], pts[23]

            Knee_mL = min(Knee_mL, cal_angle(Hip_L, Knee_L, Ankle_L))
            Knee_mR = min(Knee_mR, cal_angle(Hip_R, Knee_R, Ankle_R))

            # 눈-코의 중점과 귀의 중점의 y값(높이) 비교
            if ((Eye_L[1] + Eye_R[1]) / 2 + Nose[1]) / 2 > (Ear_L[1] + Ear_R[1]) / 2 + 0.01:
                error_message.add("Don't bow your head.")

            if abs(Knee_L[0] - Ankle_L[0])/cal_distance(Foot_L, Ankle_L) > 1.8 or abs(Knee_R[0] - Ankle_R[0])/cal_distance(Foot_R, Ankle_R) > 1.8:
                error_message.add("Make sure your knees and legs are straight.")

            if not 0.85 < (Shoulder_L[0] - Back[0])/(Back[0] - Shoulder_R[0]) < 1.21:
                error_message.add("Please face your upper body straight ahead.")

            # print('바벨', abs(past_foot - (Foot_L[1] + Foot_R[1]) / 2))
            past_foot = past_current(past_foot, (Foot_L[1] + Foot_R[1]) / 2,
                                     error_message, "Keep the soles of your feet on the ground.",
                                     0.01)  # 발바닥을 지면에 고정하세요

        if Knee_mL > 135 or Knee_mR > 135:
            error_message.add("Bend your knees more.")

    if len(error_message):
        result.append(error_message)
    else:
        result.append({"Doing well."})

    return result
