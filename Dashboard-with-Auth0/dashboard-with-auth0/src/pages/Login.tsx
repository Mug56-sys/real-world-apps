import { useState } from "react";
import Nav from "../components/Nav";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import { loginUser } from "../assets/LoginUser";
import {auth,db}from "../assets/Firebase"
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import {doc,getDoc,runTransaction,} from "firebase/firestore"

import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {

  const [loginChoice,SetLoginChoice]=useState<"Email" | "UserName">("Email");
  const [identifier,setIdentifier]=useState('');
  const [password,SetPassword]=useState('');
  const [captchaVerified,setCaptchaVerified]=useState(false);
  const [showCaptchaAlert,setShowCaptchaAlert]=useState(false);
  const {setIsLoggedIn}=useLogin();
  const navigate=useNavigate();
  
  const handleCaptcha=(value:string | null)=>{
    setCaptchaVerified(!!value)
  }


  async function handleLogin() {
    
    if(!captchaVerified){
      setShowCaptchaAlert(true);
      setTimeout(()=>setShowCaptchaAlert(false),3000);
      return;
    }
    
    try{
      await loginUser({loginChoice,identifier,password});
      setIsLoggedIn(true);
      navigate('/home');
    }catch(e){
      alert(e instanceof Error ? e.message : "Something went wrong"
      )
    }
  }

  async function loginWithGoogle() {
    if(!captchaVerified){
      setShowCaptchaAlert(true);
      setTimeout(()=>setShowCaptchaAlert(false),3000)
      return
    }
    try{
      const provider=new GoogleAuthProvider();
      const result=await signInWithPopup(auth,provider);
      const user=result.user;

     if(user){
      let baseUsername=(user.displayName || 'user').replace(/\s+/g,'').toLowerCase();
      let finalUsername=baseUsername;
      let suffix=1;
      while((await getDoc(doc(db,'usernames',finalUsername))).exists()){
        finalUsername=`${baseUsername}${suffix}`;
        suffix++;
      }

      const usernameRef=doc(db,'usernames',finalUsername);
      const userRef=doc(db,'users',user.uid)

      await runTransaction(db,async(tx)=>{
        const snap=await tx.get(usernameRef);
        if(snap.exists()){
          throw new Error('username taken');
        }
        tx.set(usernameRef,{uid:user.uid});
        tx.set(userRef,{email:user.email,username:finalUsername});
      })

      setIsLoggedIn(true);
      navigate(`/home`);
     }
    }catch(e:any){
      alert('Login Failed'+e.message)
    }
  }
  

  return (
    <>
      <Nav  />
      <div className="h-full flex bg-gray-300 justify-center min-h-screen">
        <div className="w-[45%]  bg-white m-15 rounded-3xl text-center min-h-[500px]">
          <p className="text-4xl mt-8 font-bold">Login</p>
          <div>
            <div className=" w-[75%] mt-10 h-[500px] justify-self-center text-left text-2xl flex-row">
              <form>
              <span className="text-gray-900">Login with: </span>
              <select className="border rounded-lg text-base" value={loginChoice} onChange={(e)=>{
                SetLoginChoice(e.target.value as "Email" | "UserName")
              }}>
              <option>Email</option>
              <option>UserName</option>
              </select>
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full" type="text" placeholder={`Type Your ${loginChoice}`} 
              value={identifier}
              
              onChange={(e)=>setIdentifier(e.target.value)}/>
              <span className="text-gray-900">Password </span>
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full" type="password" placeholder="Type Your Password" 
              value={password}
              onChange={(e)=>SetPassword(e.target.value)}/>

              <ReCAPTCHA
                sitekey="6LeJeKErAAAAAEYKjT5BTbWhaOCOlxfpLIwtvzMg"
                onChange={handleCaptcha}
                className="mt-4"
              />
              {showCaptchaAlert && (
                <p className="text-red-500 text-sm mt-2">Please verify Captcha</p>
              )}
              <button 
              type="button"
              onClick={handleLogin}
              className="bg-gray-500 text-white text-base border rounded-lg p-3 mt-3 font-bold hover:bg-gray-400 cursor-pointer">
                Login
              </button>

              <button 
              type="button"
              onClick={loginWithGoogle}
              className="bg-white text-black text-base border rounded-lg p-3 mt-3 font-bold hover:bg-gray-100 cursor-pointer">
                Login with Google
              </button>


              <Link to={'/register'} className="mt-12 text-base text-blue-500 cursor-pointer hover:underline">If you dont have an account Register instead</Link>
              </form>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
}
