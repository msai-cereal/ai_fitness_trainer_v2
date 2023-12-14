import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  // "운동 시작" 버튼을 클릭했을 때 호출되는 함수
  const handleBeginExercise = () => {
    // 다음 페이지로 네비게이션
    navigate('/testpage/push_up'); // '/nextpage'는 예시입니다. 실제 다음 페이지의 경로로 변경하세요.
  };

  return (
    <>
      <div className="hero min-h-screen bg-[url('https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:eco,dpr_2.0/rockcms/2021-12/211208-working-out-stock-mn-1310-55e1c7.jpg')]">
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center">
          <div className="w-full">
            <h1 className="mb-5 text-8xl font-bold text-neutral-content">AI Fitness Trainer</h1>
            <button onClick={handleBeginExercise} className="btn bg-amber-300 border-amber-300 mb-1">운동 시작</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home;
