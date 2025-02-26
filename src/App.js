// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListPage from "./pages/ListPage";
import WritePage from "./pages/WritePage";
import ViewPage from "./pages/ViewPage";
import ModifyPage from "./pages/ModifyPage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";

function App() {
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ListPage />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/write" element={<WritePage />} />
                <Route path="/view/:id" element={<ViewPage />} />
                <Route path="/modify/:id" element={<ModifyPage />} />
            </Routes>
        </Router>
    )
}

export default App;
