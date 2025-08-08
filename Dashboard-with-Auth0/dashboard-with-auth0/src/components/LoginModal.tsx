import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function LoginModal() {
const navigate = useNavigate();
  const [loginChoice,SetLoginChoice]=useState('Email')

  function closeModal() {
    navigate(-1);
  }

  return (
    
      <dialog open className=' w-[100%] flex justify-center'>
      <div className='relative border w-[45%]  m-4  min-h-[500px] rounded-3xl p-2'>
      <button onClick={closeModal} className='absolute border rounded-full hover:bg-gray-200  p-[2px]  size-[30px] top-2 right-2 cursor-pointer'>✖️</button>
      <p className="text-4xl mt-8 font-bold  text-center ">Login</p>
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
    </dialog>
    
    
  );
}

