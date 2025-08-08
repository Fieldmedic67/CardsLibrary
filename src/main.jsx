import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from "./pages/Home.jsx"
import TwoThreeSevenTen from "./pages/TwoThreeSevenTen.jsx"
import './styles.css'
import {Layout} from './Layout.jsx'
import {War} from './pages/War'
import ProfileForm from "./pages/ProfileForm.jsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<ProfileForm/>}/>
                    <Route path="two-three-seven-ten" element={<TwoThreeSevenTen/>}/>
                    <Route path="war" element={<War/>}/>
                    <Route path="war/:sessionId" element={<War/>}/>
                    <Route path="home" element={<Home/>}/>
                </Route>

            </Routes>
        </Router>
    )
}


createRoot(document.getElementById('root')).render(
    <App/>
)
