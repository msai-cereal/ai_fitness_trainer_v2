import Home from './routes/Home'
import TestPage from "./routes/TestPage"
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/testpage/:exerciseTypeParams" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
