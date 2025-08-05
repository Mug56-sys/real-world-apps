import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from './pages/Home'
import NotFound from "./pages/NotFound";

function App() {
  /** 
    
    
      <Route path="*" element={}/>
    */
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/home"} replace />} />
      <Route path="/home" element={<Home/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}

export default App;
