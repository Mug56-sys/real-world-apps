import { signInWithEmailAndPassword } from "firebase/auth";
import {auth,db}from "../assets/Firebase"
import {doc,getDoc} from "firebase/firestore"

interface LoginParams{
  loginChoice:"Email" | "UserName";
  identifier:string;
  password:string;
}

export async function loginUser({loginChoice,identifier,password}:LoginParams){
  let emailToUse=identifier;

  if(loginChoice==="UserName"){
    const userDoc=await getDoc(doc(db,'usernames',identifier.toLowerCase()));
    if(!userDoc.exists()){
      throw new Error("no username")
    }
    const uid=userDoc.data().uid;
    const userInfo=await getDoc(doc(db,'users',uid));
    if(!userInfo.exists()){
      throw new Error('no data')
    }
    emailToUse=userInfo.data().email;
  }
  await signInWithEmailAndPassword(auth,emailToUse,password);
}