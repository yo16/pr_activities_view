
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { MessageProvider } from "./commomComponents/MessageProvider";
import { Home } from "./Home";
import { Prs } from './Prs'
import { TagMasterMaintenance } from "./TagMasterMaintenance";

import './App.css'

function App() {
    return (
        <MessageProvider>
            <Router>
                <nav
                    className="routerNav"
                >
                    <Link to="/">Home</Link> | <Link to="/prs">一覧</Link> | <Link to="/tagmastermainte">タグマスタ</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/prs" element={<Prs />} />
                    <Route path="/tagmastermainte" element={<TagMasterMaintenance />} />
                </Routes>
            </Router>
        </MessageProvider>
    )
}

export default App
