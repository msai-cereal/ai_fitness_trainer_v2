import logoImage from "../assets/AIFitnessLOGO3.png"
// import logoImage1 from "../../public/logo512.png"
import { Link } from "react-router-dom";

function Header () {
  return (
    <div className="navbar bg-stone-800 h-52 border-b border-amber-200 flex">
      <div className="m-auto">
        <Link to="/">
        <img className="rounded-3xl" src={logoImage} alt="Logo" style={{ width: '230px', height: '130px' }}/>
        {/* <img className="rounded-3xl" src={logoImage1} alt="Logo" style={{ width: '230px', height: '130px' }}/> */}
        </Link>
      </div>
      <div>
        {/* <a className="btn btn-ghost text-3xl text-white">AI Fitness Trainer</a> */}
      </div>
    </div>
  )
}

export default Header