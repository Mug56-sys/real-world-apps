import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext,useContext,useEffect,useState, type ReactNode } from "react";
import { auth } from "../assets/Firebase";

interface LoginContextType{
  user:User | null;
  isLoggedIn:Boolean;
  setIsLoggedIn:(val:boolean)=>void;
  logout:()=>Promise<void>
}

const LoginContext=createContext<LoginContextType | undefined>(undefined);
 

export function LoginProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User | null>(null)
  const [isLoggedIn,setIsLoggedIn]=useState(false);

  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(u)=>{
      setUser(u);
      setIsLoggedIn(!!u)
    });
    return ()=>unsubscribe()
  },[])

  async function logout(){
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null)
  }

  return(
    <LoginContext.Provider value={{user,isLoggedIn,setIsLoggedIn,logout}}>
      {children}
    </LoginContext.Provider>
  )
}

export function useLogin(){
  const context=useContext(LoginContext);
  if(!context) throw new Error('something went wrong');
  return context;

  }