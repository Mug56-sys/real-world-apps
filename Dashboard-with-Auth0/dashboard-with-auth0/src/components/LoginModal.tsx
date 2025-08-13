import { useState } from 'react';
import { Link, } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
import {auth,db} from '../assets/Firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {doc,getDoc,runTransaction} from'firebase/firestore'
import ReCAPTCHA from 'react-google-recaptcha';
import { loginUser } from '../assets/LoginUser';


export default function LoginModal({onClose}:{onClose:()=>void}) {
  const {setIsLoggedIn}=useLogin()
  const [loginChoice,SetLoginChoice]=useState<"Email"|"UserName">("Email");
  const [identifier,setIdentifier]=useState('');
  const [password,setPassword]=useState('')
  const [captchaVerified,setCaptchaVerified]=useState(false);
  const [showCaptchaAlert,setShowCaptchaAlert]=useState(false);
 

  const handleCaptcha=(value:string | null)=>{
    setCaptchaVerified(!!value)
  }

  async function handleLogin() {
    if(!captchaVerified){
      setShowCaptchaAlert(true);
      setTimeout(()=>setShowCaptchaAlert(false),3000)
      return;
    }

    try{
      await loginUser({loginChoice,identifier,password});
      setIsLoggedIn(true);
      onClose();
    }catch(e:any){
      alert(e instanceof Error ? e.message : "something went wrong")
    }
  }

  async function loginWithGoogle(e:React.MouseEvent) {
    e.preventDefault();
    if(!captchaVerified){
      setShowCaptchaAlert(true);
      setTimeout(()=>setShowCaptchaAlert(false),3000)
      return;
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
      const userRef=doc(db,'users',user.uid);

      await runTransaction(db,async(tx)=>{
        const snap=await tx.get(usernameRef);
        if(snap.exists()){
          throw new Error('username taken')
        }
        tx.set(usernameRef,{uid:user.uid});
        tx.set(userRef,{email:user.email,username:finalUsername})
      });
      setIsLoggedIn(true);
      onClose()
    }
   }catch(e:any){
    alert('Google login Failed'+(e.message||e))
   } 
  }
    
 
  
  return (
    
      <dialog open className=' w-[100%] flex justify-center'>
      <div className='relative border w-[45%]  m-4  min-h-[500px] rounded-3xl p-2'>
      <button onClick={onClose} className='absolute border rounded-full hover:bg-gray-200  p-[2px]  size-[30px] top-2 right-2 cursor-pointer'>✖️</button>
      <p className="text-4xl mt-8 font-bold  text-center ">Login</p>
      <div className=" w-[75%] mt-10 h-[500px] justify-self-center text-left text-2xl flex-row">
              <form>
              <span className="text-gray-900">Login with: </span>
              <select className="border rounded-lg text-base" value={loginChoice} onChange={(e)=>{
                SetLoginChoice(e.target.value as "Email"|"UserName")
              }}>
              <option>Email</option>
              <option>UserName</option>
              </select>
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full" type="text"
              value={identifier}
              placeholder={`Type Your ${loginChoice}`}
                onChange={(e)=>setIdentifier(e.target.value)} />
              <span className="text-gray-900">Password </span>
              <input className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full" type="password" placeholder="Type Your Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)} />
            
              <ReCAPTCHA
              sitekey='6LeJeKErAAAAAEYKjT5BTbWhaOCOlxfpLIwtvzMg'
              onChange={handleCaptcha}
              className='mb-4'
              />
              {showCaptchaAlert && (
                <p className='text-red-500 text-sm mb-2'>Please verify Captcha</p>
              )}

              <button 
              type='button'
              className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 mb-2'
              onClick={handleLogin}>Login</button>

              <button className='w-full bg-gray-100 text-black py-2  rounded hover:bg-gray-200 mb-4'
              onClick={loginWithGoogle}>
                Login with Google
              </button>

              
              <Link to={'/register'} className="mt-12 text-base text-blue-500 cursor-pointer hover:underline">If you dont have an account Register instead</Link>
              </form>
            </div>
     </div>
    </dialog>
    
    
  );
}

