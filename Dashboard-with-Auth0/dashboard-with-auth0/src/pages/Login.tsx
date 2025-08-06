import { useState } from "react";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";

export default function Login() {
  const [loginChoice,SetLoginChoice]=useState('Email')
  return (
    <>
      <Nav loginstatus="Logout" />
      <div className="h-full flex bg-gray-300 justify-center min-h-screen">
        <div className="w-[45%]  bg-white m-15 rounded-3xl text-center min-h-[500px]">
          <p className="text-4xl mt-8 font-bold">Login</p>
          <div>
            <div className=" w-[75%] mt-10 h-[500px] justify-self-center text-left text-2xl flex-row">
              <form>
              <span className="text-gray-900">Login with: </span>
              <select className="border rounded-lg text-base" value={loginChoice} onChange={(e)=>{
                SetLoginChoice(e.target.value)
              }}>
              <option>Email</option>
              <option>UserName</option>
              </select>
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full" type="password" placeholder={`Type Your ${loginChoice}`} />
              <span className="text-gray-900">Password </span>
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full" type="password" placeholder="Type Your Password" />
            
              
              <div className="mt-10">Recaptcha and GoogleLogin Place</div>
              <Link to={'/register'} className="mt-12 text-base text-blue-500 cursor-pointer hover:underline">If you dont have an account Register instead</Link>
              </form>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
}
