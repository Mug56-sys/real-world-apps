import Nav from "../components/Nav";
import { Link } from "react-router-dom";
import {auth} from '../assets/Firebase'
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { useState } from "react";


export default function Register() {
  const [login,SetLogin]=useState('')
  const [email,SetEmail]=useState('')
  const [passwordCheck,SetPasswordCheck]=useState('')
  const [password,SetPassword]=useState('')
  const [showPassword,setShowPassword]=useState(false);
  const [showPasswordCheck,setShowPasswordCheck]=useState(false);
  const register=async()=>{
    if(!login || !email || !passwordCheck || !password) return;
    if(password!==passwordCheck)return;
    if(password.length<8)return;
    if(!email.includes('@') ) return;
    try{
      const userData=await createUserWithEmailAndPassword(auth,email,password)
      await sendEmailVerification(userData.user)
    }catch(e:unknown){
      if(e instanceof Error){
        alert(e.message)
      }else{
        alert('unexpected error')
      }
      
    }
  }
  return (
    <>
      <Nav loginstatus="Logout" />
      <div className="h-full flex bg-gray-300 justify-center min-h-screen">
        <div className="w-[45%]  bg-white m-15 rounded-3xl text-center min-h-[500px]">
          <p className="text-4xl mt-8 font-bold">Register</p>
          <div>
            <div className=" w-[75%] mt-10 h-[500px] justify-self-center text-left text-2xl flex-row">
              <form id='RegisterForm'>
              <span className="text-gray-900">Login </span>
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full" type="text" placeholder="Type Your Login" value={login} onChange={(e)=>{SetLogin(e.target.value)}} />
              <span className="text-gray-900">Email </span>
             {!email.includes('@') && email!=='' ? <span className="text-red-500 text-sm py-1">Provide real email</span>: null}
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full" type="password" placeholder="Type Your Email" value={email} onChange={(e)=>{SetEmail(e.target.value)}}/>
              {}
              <span className="text-gray-900">Password </span>
               <div className="relative">
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full pr-10"  type={showPassword ? 'text' :'password'} placeholder="Type Your Password" value={password} onChange={(e)=>{SetPassword(e.target.value);
                setShowPassword(false);
                setShowPasswordCheck(false);
              }}/>
              <button onClick={()=>setShowPassword(!showPassword)} type="button"
              className="absolute inset-y-0 right-0 px-3 flex item-center text-gray-600 hover:text-gray-900">{showPassword ? '👁️':'👁️‍🗨️'}</button>
              </div>
              <span className="text-gray-900">Confirm Password </span>
              <div className="relative">
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full pr-10"  type={showPasswordCheck ? 'text' :'password'} placeholder="Type Your Password" value={passwordCheck} onChange={(e)=>{SetPasswordCheck(e.target.value);
                setShowPassword(false);
                setShowPasswordCheck(false);
              }}/>
              {(password!==passwordCheck) &&password!='' ? <><span className="text-red-500 text-sm py-1">Your passwords need to be equal</span><br/></> : null}

              {(password.length<8)&&password!=''? <><span className="text-red-500 text-sm py-1">Password needs to be longer or equal to eight characters</span><br/></>: null}
                
              {(!login || !email || !passwordCheck || !password)? <span className="text-red-500 text-sm py-1">You need to provide all necessary data</span>: null}

              <button onClick={()=>setShowPasswordCheck(!showPasswordCheck)} type="button"
              className="absolute inset-y-0 right-0 px-3 flex item-center text-gray-600 hover:text-gray-900">{showPasswordCheck ? '👁️':'👁️‍🗨️'}</button>
              </div>
              <button type="submit" className="bg-gray-500 text-white text-base border rounded-lg p-3 mt-3 font-bold hover:bg-gray-400 cursor-pointer" id='RegisterForm' onClick={(e)=>{e.preventDefault(); register()}}>Create Account</button>

              <div className="mt-10">Recaptcha and GoogleLogin Place</div>
              <Link to={'/login'} className="mt-12 text-base text-blue-500 cursor-pointer hover:underline">If you have an account Login instead</Link>
              
              </form>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
}
