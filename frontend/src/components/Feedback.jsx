import { Chart, registerables } from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
Chart.register(...registerables);

const exerciseOptions = [
  { value: 'push_up', label: '푸쉬업' },
  { value: 'pull_up', label: '풀업' },
  { value: 'side_lateral_raise', label: '사이드 레터럴 레이즈' },
  { value: 'barbell_squat', label: '바벨 스쿼트' },
  { value: 'burpees', label: '버피 테스트' },
  { value: 'cross_lunge', label: '크로스 런지' },
];

function Feedback () {
  const { exerciseTypeParams } = useParams();
  const initialExerciseData = useMemo(() => ({
    labels: [],
    datasets: [{
      label: 'Exercise Count',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  }), []);
  
  const initialAchievementData = useMemo(() => ({
    labels: ['Achieved', 'Remaining'],
    datasets: [{
      label: 'Achievement Rate',
      data: [0, 100],
      backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1
    }]
  }), []);
  
  const initialFeedbackData = useMemo(() => ({
    labels: [],
    datasets: [{
      label: 'Feedback Count',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  }), []);

  const initialAllData = useMemo(() => {
    const initialData = {
      labels: exerciseOptions.map((exercise) => exercise.value),
      datasets: [{
        label: 'All',
        data: Array(exerciseOptions.length).fill(0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    };
    return initialData;
  }, [exerciseOptions]);
  
  const [exerciseData, setExerciseData] = useState(initialExerciseData);
  const [achievementData, setAchievementData] = useState(initialAchievementData);
  const [feedbackData, setFeedbackData] = useState(initialFeedbackData);
  const [allData, setAllData] = useState(initialAllData);
  const updateCharts = useCallback((statistics) => {
    // 로컬 스토리지에서 가져온 운동별 횟수를 저장할 객체
    const storedExerciseCounts = {};

    // 로컬 스토리지에 저장된 운동별 횟수를 가져와서 storedExerciseCounts에 저장
    exerciseOptions.forEach((option) => {
      const storedCount = localStorage.getItem(option.value);
      storedExerciseCounts[option.value] = storedCount ? parseInt(storedCount, 10) : 0;
    });

    // 운동 종류 별 운동 횟수 그래프 업데이트
    setExerciseData({
      ...initialExerciseData,
      labels: exerciseOptions.map((option) => option.label),
      datasets: [{
        ...initialExerciseData.datasets[0],
        data: exerciseOptions.map((option) => storedExerciseCounts[option.value])
      }]
    });

    // // 운동 종류 별 운동 횟수 그래프 업데이트
    // setExerciseData({
    //   ...initialExerciseData,
    //   labels: Object.keys(statistics.exerciseCount),
    //   datasets: [{
    //     ...initialExerciseData.datasets[0],
    //     data: Object.values(statistics.exerciseCount)
    //   }]
    // });

    // 달성률 그래프 업데이트
    setAchievementData({
      ...initialAchievementData,
      datasets: [{
        ...initialAchievementData.datasets[0],
        data: [statistics.achievementRate.achieved, statistics.achievementRate.total - statistics.achievementRate.achieved]
      }]
    });
    // data의 첫 번째 인덱스 값만 로컬스토리지에 저장
    if (statistics.achievementRate) {
      const exerciseName = exerciseTypeParams; // 적절한 값으로 변경
      const firstDataValue = statistics.achievementRate.achieved || 0;
      localStorage.setItem(exerciseName, firstDataValue);
    }
    // 컨디션별 피드백 카운트 그래프 업데이트
    setFeedbackData({
      ...initialFeedbackData,
      labels: Object.keys(statistics.feedbackCount),
      datasets: [{
        ...initialFeedbackData.datasets[0],
        data: Object.values(statistics.feedbackCount)
      }]
    });
    // 로컬스토리지에서 가져온 키-값 쌍을 저장할 객체
    const storedData = {};
    console.log(storedData)
    // 로컬스토리지에 저장된 모든 키-값 쌍을 가져와서 storedData에 저장
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      storedData[key] = value;
    }
    setAllData({
      ...initialAllData,
      datasets: [{
        ...initialAllData.datasets[0],
        data: initialAllData.labels.map((label) => storedData[label] || 0),
      }]
    });
  }, [initialExerciseData, exerciseOptions]);

  const fetchStatistics = useCallback(async () => {
    const response = await fetch('http://localhost:8000/statistics');
    const statistics = await response.json();
    console.log('Received statistics:', statistics);
    updateCharts(statistics);
  }, [updateCharts]); // 종속성 배열에 변화를 감지할 변수가 없으므로 빈 배열을 사용

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]); // useCallback을 사용하여 정의된 fetchStatistics를 종속성 배열에 포함

  const handleRefresh = () => {
    // 페이지를 새로 고침
    window.location.reload();
  };

  const radarOptions = {
    scales: {
      r: {
        suggestedMin: 0, // 최소값을 0으로 지정
      },
    },
  };
  
  return (
    <>
    <div className="flex items-center text-3xl font-semibold bg-gradient-to-b from-stone-900 to-white" style={{ height: '200px', marginTop: '-5px' }}>
      <div className='m-auto' style={{ width:'1280px'}}>
        <p className="text-white pl-20 mt-1" style={{ float:'left'}}>Feedback</p>
        <p
          className="btn ml-2 border text-black rounded-xl"
          style={{ float:'left'}}
          onClick={handleRefresh}
        >
        click!
        </p>
      </div>
    </div>
    <div className="flex justify-center space-x-16 mb-10">

      {/* Bar Chart */}
      <div className="mb-8">
        <p className="text-xl font-semibold mb-2 mt-5">운동 카운트 횟수</p>
        <div className="w-80 h-80 bg-stone-200 mt-3.5 rounded-xl skeleton">
          <div>
            {exerciseData.datasets[0].data.length > 0 && (
              <div className="w-80 h-80 bg-stone-200 rounded-xl">
              <Bar data={exerciseData} height={100} width={100}/>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mb-8">
        <p className="text-xl font-semibold mb-2 mt-5">달성률</p>
        <div className="w-80 h-80 bg-stone-200 mt-3.5 rounded-xl skeleton">
          <div className="w-80 h-80 bg-stone-200 mt-3.5 rounded-xl flex justify-center items-center">
            <div className="w-64 h-64">
              {achievementData.datasets[0].data.length > 0 && (
                <Pie data={achievementData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        <p className="text-xl font-semibold mb-2">기준별 피드백<br />카운트 시각화</p>
        <div className="w-80 h-80 bg-stone-200 rounded-xl skeleton overflow-hidden">
            {feedbackData.datasets[0].data.length > 0 && (
              <div className="w-80 h-80 bg-stone-200 rounded-xl" >
                <Bar data={feedbackData} height={100} width={100}/>
              </div>
            )}              
        </div>
      </div>
    </div>
    <div className="mb-20">
      <div className="text-2xl font-semibold m-auto mb-5">종합 피드백</div>
      <div className='h-96 bg-stone-200 skeleton mb-20 m-auto rounded-xl' style={{ width: '600px' }}>
        {allData.datasets[0].data.length > 0 && (
          <div className='h-96 bg-stone-200 rounded-xl flex justify-center items-center' style={{ width: '600px' }}>
            <div className='mt-5' style={{ width: '400px', height: '400px' }}>
              <Radar data={allData} options={radarOptions}/>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
  )
}

export default Feedback
