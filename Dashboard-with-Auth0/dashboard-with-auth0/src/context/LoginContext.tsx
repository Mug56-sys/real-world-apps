import { createContext,useContext,useState, type ReactNode } from "react";

interface LoginContextType{
  isLoggedIn:Boolean;
  setIsLoggedIn:(value:boolean)=>void;
}

const LoginContext=createContext<LoginContextType | undefined>(undefined);
 

export function LoginProvider({children}:{children:ReactNode}){
  const [isLoggedIn,setIsLoggedIn]=useState(false);

  return(
    <LoginContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
      {children}
    </LoginContext.Provider>
  )
}

export function useLogin(){
  const context=useContext(LoginContext);
  if(!context) throw new Error('something went wrong');
  return context;

  }