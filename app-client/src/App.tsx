
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { MessageProvider } from "./commomComponents/MessageProvider";
import { Home } from "./Home";
import { Prs } from './Prs'

import './App.css'

function App() {
    return (
        <MessageProvider>
            <Router>
                <nav
                    className="routerNav"
                >
                    <Link to="/">Home</Link> | <Link to="/prs">一覧</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/prs" element={<Prs />} />
                </Routes>
            </Router>
        </MessageProvider>
    )
}

export default App
