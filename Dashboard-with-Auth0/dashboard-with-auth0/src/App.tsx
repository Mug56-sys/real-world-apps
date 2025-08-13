import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginModal from "./components/LoginModal";


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation=state?.backgroundLocation;

  

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Navigate to={"/home"} replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={<LoginModal onClose={() => navigate(-1)} />}
          />
        </Routes>
      )}
    </>
  );
}

export default App;
