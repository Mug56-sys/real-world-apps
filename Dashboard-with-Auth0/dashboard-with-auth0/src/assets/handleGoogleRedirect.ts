import { auth, db } from "./Firebase";
import { getRedirectResult } from "firebase/auth";
import { doc, getDoc, runTransaction,  } from "firebase/firestore";


export async function handleGoogleRedirect(
  navigate: (path: string) => void,
  setIsLoggedIn: (val: boolean) => void
) {
  
  try {
    const result = await getRedirectResult(auth);

    if (result?.user) {
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        let baseUsername =
          user.displayName?.replace(/\s+/g, "").toLowerCase() || "user";
        let finalUsername = baseUsername;
        let suffix = 1;

        while ((await getDoc(doc(db, "usernames", finalUsername))).exists()) {
          finalUsername = `${baseUsername}${suffix}`;
          suffix++;
        }

        const usernameRef=doc(db,'usernames',finalUsername)

        try{
          await runTransaction(db,async(tx)=>{
            const usernameSnap=await tx.get(usernameRef);
            if(usernameSnap.exists()){
              throw new Error('username Taken')
            }
            tx.set(usernameRef,{uid:user.uid});
            tx.set(userDocRef,{email:user.email,username:finalUsername});
          });
        }catch(e){
          console.error('Failed Redirect',e)
        }
      }

      
      setIsLoggedIn(true);
      navigate('/home');
      console.log("Google redirect result:", result);
console.log("User UID:", user.uid);
console.log("User email:", user.email);
    }
  } catch (e) {
    console.log("Google Error: " + e);
  }
}
