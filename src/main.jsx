import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from "./pages/Home.jsx"
import TwoThreeSevenTen from "./pages/TwoThreeSevenTen.jsx"
import './styles.css'
import { Layout } from './Layout.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/two-three-seven-ten" element={<TwoThreeSevenTen />} /> 
        </Route>
      </Routes>
    </Router>
  )
}


createRoot(document.getElementById('root')).render(
  
    <StrictMode>
      <App />
    </StrictMode>
  
)
