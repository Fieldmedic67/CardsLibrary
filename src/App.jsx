import Home from "./Home.jsx"
import TwoThreeSevenTen from "./TwoThreeSevenTen.jsx"
import { Routes, Route } from 'react-router-dom'
function App() {

  return (
  <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/two-three-seven-ten" element={<TwoThreeSevenTen />} />
    </Routes>
  </div>
  )
}

export default App
