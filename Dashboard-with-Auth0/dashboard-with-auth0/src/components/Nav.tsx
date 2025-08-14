import { Link, useLocation,useNavigate } from "react-router-dom";
import LOGO from "../assets/LOGO.png";
import { useLogin } from "../context/LoginContext";

export default function Nav() {
  const location = useLocation();
  const {isLoggedIn,logout}=useLogin();
  const navigate=useNavigate();

  const handleLogout=async()=>{
    try{
      await logout();
      navigate('/home')
    }catch(e){
      console.error(e)
    }
  }
  return (
    <div className="bg-gray-900 w-full max-h-40 h-14 text-white py-8 top-0 flex items-center px-4 ">
      
      <div className="block">
        <Link
          to="/home"
          onClick={() => {
            if (location.pathname === "/home") {
              window.location.reload();
            }
          }}
          className="cursor-pointer inline-block"
        >
          <img
            src={LOGO}
            alt="Logo"
            className="size-[55px] hover:bg-gray-800 hover:rounded-xl m-3"
          />
        </Link>
      </div>

    <div className="flex gap-6 ml-4">
      {isLoggedIn &&(
        <Link to={'/tasks'}
        className="px-3 border rounded-md cursor-pointer bg-white text-gray-900 font-bold py-1 hover:bg-gray-300 text-center">
          Tasks
        </Link>
      )}
    </div>
      <div className="flex-grow"></div>

      
      <div className="mr-6 py-1 text-base w-[20%] grid gap-3 grid-cols-3">
        {!isLoggedIn ? ( <Link
  to={'/login'}
  state={{backgroundLocation: location }}
  className="px-3 border rounded-md cursor-pointer bg-white text-gray-900 font-bold py-1 hover:bg-gray-300 text-center justify-self-end col-span-1 col-start-3"
>Login</Link>):(<button 
onClick={handleLogout}
className="px-3 border rounded-md cursor-pointer bg-white text-gray-900 font-bold py-1 hover:bg-gray-300 text-center justify-self-end col-span-1 col-start-3">
    Logout
  </button>)}
       
  

      </div>
    </div>
  );
}
