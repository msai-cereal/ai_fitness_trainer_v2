import Header from "../components/Header";
import Footer from "../components/Footer";
import Feedback from "../components/Feedback";
import { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// exerciseStatus의 초기 상태를 별도의 상수로 정의
const initialExerciseStatus = {
  name: 'Not Chosen',
  repetition: 0,
  duration: '00:00:00',
  condition: '아직 피드백이 없습니다.'
};

const exerciseOptions = [
  { value: 'push_up', label: '푸쉬업' },
  { value: 'pull_up', label: '풀업' },
  { value: 'side_lateral_raise', label: '사이드 레터럴 레이즈' },
  { value: 'barbell_squat', label: '바벨 스쿼트' },
  { value: 'burpees', label: '버피 테스트' },
  { value: 'cross_lunge', label: '크로스 런지' },
];

function TestPage() {
  const [exerciseType, setExerciseType] = useState('push_up');
  const [isReadyToStart, setIsReadyToStart] = useState(false); // 운동 시작 준비 상태
  const [startTime, setStartTime] = useState(null); // 시작 시간 상태 추가
  const [isSubmitted, setIsSubmitted] = useState(false); // 'Submit Exercise' 버튼 활성화 상태 추가
  const [exerciseStatus, setExerciseStatus] = useState(initialExerciseStatus);
  const [intentionallyClosed, setIntentionallyClosed] = useState(false);
  const [audioFeedbackUrl, setAudioFeedbackUrl] = useState('https://storage.googleapis.com/buildship-lvodqd-asia-northeast1/yxpj9nsh059.mp3');
  const [isStreaming, setIsStreaming] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isExerciseStarted, setExerciseStarted] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // 오디오 재생 상태 추적

  const { exerciseTypeParams } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 파람스에서 exerciseType이 변경될 때 로컬 상태를 업데이트
    setExerciseType(exerciseTypeParams);
  }, [exerciseTypeParams]);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const countdownTimer = useRef(null);
  const exerciseTimer = useRef(null);
  const ws = useRef(null);
  const canvas = document.createElement('canvas'); // 캔버스를 한 번만 생성

  const formatConditionsToString = (conditions) => {
    if (!conditions || conditions.length === 0) {
      return "No conditions";
    }
  
    // 조건 배열의 각 React 요소를 문자열로 변환
    return conditions.map((item, index) => {
      // props.children에서 필요한 정보 추출
      const conditionText = item.props.children[0]; // "Exercise in place."
      const count = item.props.children[2]; // 예: 6
  
      return `${index + 1}. ${conditionText}: ${count}`;
    }).join("\n");
  };

  const fetchStatistics = useCallback(async () => {
    const response = await fetch('http://localhost:8000/statistics');
    const statistics = await response.json();
    console.log('Received statistics:', statistics);
  }, []); // 종속성 배열에 변화를 감지할 변수가 없으므로 빈 배열을 사용

  useEffect(() => {
    let interval;
    if (isStreaming && startTime) {
      interval = setInterval(() => {
        const currentDuration = Date.now() - startTime;
        const formattedDuration = formatDuration(currentDuration);
        // 함수형 업데이트를 사용하여 현재 상태를 기반으로 새로운 상태를 계산
        setExerciseStatus(prevStatus => ({
          ...prevStatus,
          duration: formattedDuration
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, startTime]); 

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]); // useCallback을 사용하여 정의된 fetchStatistics를 종속성 배열에 포함
  
  useEffect(() => {
    // 앱이 처음 로드될 때 실행될 로직
    const isFirstLoad = sessionStorage.getItem('firstLoad') === null;
    if (isFirstLoad) {
      audioRef.current.onloadeddata = () => {
        audioRef.current.play().catch(e => console.log('Auto-play failed', e));
      };
      sessionStorage.setItem('firstLoad', 'done');
    }
    setIntentionallyClosed(true);
  }, []); // 빈 의존성 배열로 마운트 시에만 실행
  
  useEffect(() => {
    if (audioRef.current) {
      // 오디오 재생 시작 시
      audioRef.current.onplay = () => setIsAudioPlaying(true);
      // 오디오 재생 종료 시
      audioRef.current.onended = () => setIsAudioPlaying(false);
    }
  }, [audioRef]);

  const startStreaming = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.error('Error accessing the camera:', error);
        });
    }
  };

  const updateExerciseStatus = (selectedType) => {
    // 현재 운동 유형과 선택된 운동 유형이 다른 경우에만 repetition을 0으로 리셋
    if (exerciseStatus.name !== selectedType) {
      setExerciseStatus({
        name: selectedType,
        repetition: 0,
        duration: '00:00:00',
        condition: '아직 피드백이 없습니다.'
      });
    } else {
      // 같은 운동 유형을 유지하는 경우 repetition 값을 그대로 유지
      setExerciseStatus(prevStatus => ({
        ...prevStatus,
        name: selectedType
      }));
    }
  };
  
  const handleSubmitExercise = async () => {
    updateExerciseStatus(exerciseType); // 선택된 운동 유형으로 상태 업데이트
    setFeedback('');
    setCountdown(0);
    setIsReadyToStart(true); // 운동 시작 준비 상태를 true로 설정
    setIsSubmitted(true); // 'Submit Exercise' 버튼 비활성화
    setSelectedExercise(exerciseType)
    // FastAPI 서버로 데이터 전송
    try {
      const response = await fetch('http://localhost:8000/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseType
        }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
    navigate(`/testpage/${exerciseType}`);
  };

  const handleStartExercise = async () => {
    setIntentionallyClosed(false);
    if (!isStreaming) {
      setCountdown(3);
      countdownTimer.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            clearInterval(countdownTimer.current);
            setIsStreaming(true);
            startStreaming();
            setStartTime(Date.now());
  
            // 이미 열린 WebSocket 연결이 없는 경우에만 새 연결 생성
            if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
              ws.current = new WebSocket('ws://localhost:8000/ws');
              ws.current.onopen = () => {
                console.log('WebSocket connection opened');
                if (ws.current.readyState === WebSocket.OPEN) {
                  ws.current.send(exerciseType);
                }
                // 기존 프레임 전송 타이머가 없는 경우에만 새 타이머 생성
                if (!exerciseTimer.current) {
                  exerciseTimer.current = setInterval(captureAndSendFrame, 100);
                }
              };
              ws.current.onmessage = handleWebSocketMessages;
              ws.current.onclose = () => {
                console.log('WebSocket connection closed');
                clearInterval(exerciseTimer.current);
                exerciseTimer.current = null;

                // 연결이 의도적으로 닫히지 않았을 때만 재연결을 시도
                if (!intentionallyClosed) {
                  setTimeout(() => {
                    handleStartExercise();
                  }, 1000);
                } else {
                  // 의도적으로 닫힌 경우, intentionallyClosed 상태를 초기화
                  setIntentionallyClosed(true);
                }
              };
              ws.current.onerror = (error) => {
                console.log('WebSocket error:', error);
              };
            }

            return 0;
          }
        });
      }, 1000);
    }
    setExerciseStarted(true);
  };
  
  const handleStopExercise = async () => {
    const endTime = Date.now();
    const duration = endTime - startTime; // 종료 시간과 시작 시간의 차이 계산
    const formattedDuration = formatDuration(duration); // 시간 형식으로 변환
    setIsStreaming(false);
    setIntentionallyClosed(true);  // 연결이 의도적으로 닫혔음을 표시
    clearInterval(exerciseTimer.current); // 프레임 전송 중지
    setExerciseStatus({...exerciseStatus, duration: formattedDuration}); // 상태 업데이트
    setStartTime(null); // 시작 시간 초기화
    setExerciseStarted(false);

    // 서버에게 통계 데이터 요청
    await fetchStatistics(); // 이 함수 내에서 서버로부터 통계 데이터를 가져와 차트를 업데이트

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // 서버에게 연결을 닫으라는 메시지 전송
      await ws.current.send(JSON.stringify({ type: "close_connection" }));
      ws.current.close(1000, "User stopped exercise so closing connection");
    }
    await getAudioFeedback(); // 피드백 요청
  };

  const handleRestartExercise = async () => {
    setCountdown(0);
    setFeedback('');
    setIsStreaming(false);
    setIsReadyToStart(false);
    setIsSubmitted(false); // 'Submit Exercise' 버튼 활성화
    setIntentionallyClosed(true);  // 연결이 의도적으로 닫혔음을 표시
    setExerciseStatus(initialExerciseStatus); // exerciseStatus를 초기 상태로 재설정
    setAudioFeedbackUrl(null); // 오디오 피드백 URL 초기화

    if (ws.current) {
      ws.current.close();
    }
    clearTimeout(exerciseTimer.current);
    clearTimeout(countdownTimer.current);

    // 서버에 전역 변수 초기화 요청
    try {
      await fetch('http://localhost:8000/reset', { method: 'POST' });
    } catch (error) {
      console.error('Error resetting global data:', error);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleWebSocketMessages = event => {
    // 서버로부터 받은 데이터를 JSON으로 파싱
    const data = JSON.parse(event.data);

    // 서버에서 보낸 keep-alive 메시지에 대한 처리
    if (data === "keep-alive") {
      // 서버에서 보낸 keep-alive 메시지에 응답
      ws.current.send(JSON.stringify({ message: "keep-alive response" }));
    } else if (data.frame) {
      // 서버에서 받은 프레임 데이터 처리
      // 받은 데이터를 이미지 소스로 사용하는 경우
      const imageSrc = `data:image/jpeg;base64,${data.frame}`;
      // 여기서 imageSrc를 사용하여 UI를 업데이트 
      setFeedback(imageSrc);
    } else if (data.statistics) {
      // // 여기서 각 통계 데이터를 적절한 상태에 저장하거나 UI를 업데이트
      // setExerciseData(exerciseCount);
      // setAchievementData(achievementRate);
      // setFeedbackData(feedbackCount);
    } else if (data.feedbackMessage) { 
      setFeedback(data.feedbackMessage);
    } else {
      // 서버로부터 받은 조건 및 카운트 결과 처리
      if (data.condition) {
        // condition 객체의 각 키와 값을 렌더링하는 방식으로 처리
        const conditionElements = data.condition.map((item, index) => (
          <p key={index}>{item.condition}: {item.count}</p>
        ));
        setExerciseStatus(prevStatus => ({ ...prevStatus, condition: conditionElements }));
      }
      if (data.countIncreased) {
        setExerciseStatus(prevStatus => ({ ...prevStatus, repetition: data.countIncreased }));
      }
    }
  };
  
  // 시간 형식 변환 함수
  const formatDuration = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(v => v < 10 ? '0' + v : v)
      .join(':');
  };

  const captureAndSendFrame = () => {
    if (videoRef.current && ws.current && ws.current.readyState === WebSocket.OPEN) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const frame = canvas.toDataURL('image/jpeg');
      if (frame !== "data:,") { // 빈 데이터가 아닌지 확인
        ws.current.send(frame);
      }
    }
  };

  const getAudioFeedback = async () => {
    try {
      // exerciseStatus에서 필요한 정보를 가져와서 프롬프트 구성
      const prompt = `# exercise information\nexercise type: ${exerciseStatus.name}, repetition: ${exerciseStatus.repetition}, duration(s): ${exerciseStatus.duration}, conditions: ${formatConditionsToString(exerciseStatus.condition)}\nYour Feedback:`;
      console.log('Sending prompt to API:', prompt);

      const response = await fetch(`https://lvodqd.buildship.run/tts?prompt=${encodeURIComponent(prompt)}`);
      const feedbackUrl = await response.text(); // 응답은 피드백 URL
      console.log('Received audio feedback URL:', feedbackUrl); // 음성 피드백 URL 출력
      setAudioFeedbackUrl(feedbackUrl); // 상태에 URL 저장
      // 음성 URL을 받으면 audio 태그의 src를 설정하고 바로 재생
      if (audioRef.current) {
        audioRef.current.src = feedbackUrl;
        audioRef.current.load(); // 오디오 재로드
        audioRef.current.onloadeddata = () => {
          audioRef.current.play().catch(e => console.log('Auto-play failed', e));
        };
      }
    } catch (error) {
      console.error('Error fetching audio feedback:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="hero pt-20 block bg-stone-900" style={{ height: '850px' }}>
        <div className="hero-content flex-col lg:flex-row-reverse m-auto">
          <div className="rounded-lg shadow-2xl text-white ml-6 bg-stone-300 skeleton overflow-hidden" style={{ width: '750px', height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* 웹캠자리 */}
            {isStreaming ? (
              <>
                <video ref={videoRef} width="750" height="500" autoPlay playsInline style={{ display: 'none' }}></video>
                {feedback && <img src={feedback} width="750" height="500" alt="Processed Frame" />}
              </>
              ) : (
              <div className="placeholder text-stone-500" style={{ fontSize: '1.3rem'}}> 
                {isAudioPlaying ? (
                  <div className="audio-animation">
                    {/* AI 음성 출력 중 애니메이션 표시 */}
                    <p>AI 음성 출력 중...</p>
                  </div>
                ) : countdown > 0 && countdown < 4 ? (
                  `${countdown}초 후 시작됩니다.`
                ) : (
                  <div className="loading-animation">
                    {/* 로딩 애니메이션 표시 */}
                    <span>운</span>
                    <span>동</span>
                    <span> </span>
                    <span>기</span>
                    <span>다</span>
                    <span>리</span>
                    <span>는</span>
                    <span>중</span>
                    <span>...</span>
                  </div>
                )}
              </div>                
            )}
          </div>
          <div style={{ width: '295px', height: '450px' }}>
            <div className="text-3xl font-bold text-white mb-3 flex">현재운동 : </div>
            <div className="text-3xl font-bold text-white mb-7 flex">
              {exerciseOptions.find(option => option.value === selectedExercise)?.label ||  exerciseOptions.find(option => option.value === exerciseType)?.label}
            </div>
            <div className="flex">
            <button className="btn bg-amber-300 border-amber-300 mb-5 mr-3 hover:bg-amber-200 hover:border-amber-200" disabled={!isReadyToStart || isStreaming} onClick={handleStartExercise}>
              운동시작
            </button>
            <button className="btn bg-amber-300 border-amber-300 mb-5 mr-3 hover:bg-amber-200 hover:border-amber-200" disabled={!isStreaming} onClick={handleStopExercise}>
              운동종료
            </button>
            <button disabled={isExerciseStarted} className="btn bg-amber-300 border-amber-300 mb-5 rounded-full hover:bg-amber-200 hover:border-amber-200 transform hover:rotate-180" onClick={handleRestartExercise}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M5.029 2.217a6.5 6.5 0 0 1 9.437 5.11.75.75 0 1 0 1.492-.154 8 8 0 0 0-14.315-4.03L.427 1.927A.25.25 0 0 0 0 2.104V5.75A.25.25 0 0 0 .25 6h3.646a.25.25 0 0 0 .177-.427L2.715 4.215a6.491 6.491 0 0 1 2.314-1.998ZM1.262 8.169a.75.75 0 0 0-1.22.658 8.001 8.001 0 0 0 14.315 4.03l1.216 1.216a.25.25 0 0 0 .427-.177V10.25a.25.25 0 0 0-.25-.25h-3.646a.25.25 0 0 0-.177.427l1.358 1.358a6.501 6.501 0 0 1-11.751-3.11.75.75 0 0 0-.272-.506Z"></path><path d="M9.06 9.06a1.5 1.5 0 1 1-2.12-2.12 1.5 1.5 0 0 1 2.12 2.12Z"></path></svg>
              </button>
              </div>
            <select value={exerciseType} onChange={e => setExerciseType(e.target.value)} disabled={isSubmitted} className="bg-amber-300 border-amber-300 mb-1 flex rounded p-2" style={{ width: "170px" }}>
              {exerciseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button onClick={handleSubmitExercise} disabled={isSubmitted || isStreaming} className="btn bg-amber-300 border-amber-300 mb-1 flex hover:bg-amber-200 hover:border-amber-200">운동 선택</button>
            <p className="py-5 text-2xl text-white flex">현재 카운트 : {exerciseStatus.repetition}</p>
            <p className="pb-6 text-2xl text-white flex">운동시간 : {exerciseStatus.duration}</p>
            <div>
              {audioFeedbackUrl && (
                <audio key={audioFeedbackUrl} ref={audioRef} controls style={{ display: 'None' }} className="w-56">
                  <source src={audioFeedbackUrl} type="audio/mpeg" />
                </audio>
              )}
          </div>
          </div>
        </div>
        <div className="hero-content flex-col lg:flex-row-reverse m-auto">
          <div className="rounded-lg shadow-2xl text-white ml-36 bg-stone-400 pl-7 pt-2 pb-2" style={{ width: '750px', height: '100px', maxHeight: '100px', overflowY: 'auto', textAlign: 'left' }}>
            {exerciseStatus.condition}
          </div>
          <div className="text-2xl ml-16 text-white flex">현재 피드백</div>
        </div>
      </div>
      <Feedback />
      <Footer />
    </>
  )
}

export default TestPage

