import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from './pages/Home'
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

function App() {
  
  return (
    <Routes >
      <Route path="/" element={<Navigate to={"/home"} replace />} />
      <Route path="/home" element={<Home/>}/>
      <Route path="*" element={<NotFound/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
