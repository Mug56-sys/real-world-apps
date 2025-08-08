import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./index.css";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginModal from "./components/LoginModal";
import { useEffect } from "react";

function App() {
  const location=useLocation()
  const navigate=useNavigate()
  const state=location.state as  {backgroundLocation?:Location}
  const bglocation=state?.backgroundLocation;
useEffect(() => {
    
    if (location.pathname === "/login" && bglocation) {

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);
  console.log('location:', location);
console.log('state:', state);
console.log('bglocation:', bglocation);
  return (
    <>
      <Routes location={bglocation || location}>
        <Route path="/" element={<Navigate to={"/home"} replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {bglocation && (<Routes>
        <Route path="/login" element={<LoginModal/>}/>
      </Routes>)}
    </>
  );
}

export default App;
