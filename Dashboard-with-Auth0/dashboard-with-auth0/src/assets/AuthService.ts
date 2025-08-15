import {auth,googleProvider,db} from "./Firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  linkWithCredential,
  EmailAuthCredential,
  fetchSignInMethodsForEmail,
  type User
}from 'firebase/auth';
import {
doc,
setDoc,
getDoc,
collection,
addDoc,
serverTimestamp,
runTransaction,
deleteDoc,
query,
where,
getDocs,
updateDoc
}from 'firebase/firestore';
import { use } from "react";

export async function createUserDocIfNotExists(user:Partial<User> & {uid:string}){
  const ref=doc(db,'users',user.uid);
  const snap=await getDoc(ref);
  if(snap.exists()) return;
  await setDoc(ref,{
    uid:user.uid,
    email:user.email || null,
    displayName:user.displayName || null,
    createdAt:serverTimestamp(),
    provider:user.providerId || null,
    emailVerified:!!user.emailVerified
  });

}

export async function registerWithEmailAndCreateUser(email:string,
  password:string,
  username:string
){
  const credentials=await createUserWithEmailAndPassword(auth,email,password);
  await sendEmailVerification(credentials.user);
  const uid=credentials.user.uid;
  const usernameRef=doc(db,'usernames',username.toLowerCase());
  const emailRef=doc(db,'userEmails',email.toLowerCase());

  await runTransaction(db,async(tx)=>{
    const userSnap=await tx.get(usernameRef);
    if(userSnap.exists()) throw new Error('Username taken');
    tx.set(usernameRef,{uid});
    tx.set(doc(db,'users',uid),{
      uid,
      email,
      username:username.toLowerCase(),
      createdAt:serverTimestamp(),
      provider:'password',
      emailVerifired:false,
    });
    tx.set(emailRef,{uid})
  });

  return credentials;
}

export async function resendVerificationForCurrentUser(){
  const user=auth.currentUser;
  if(!user) throw new Error('Not logged In');
  await sendEmailVerification(user);
}

export async function signInWithGoogleHandleCollision(){
  try{
    const result=await signInWithPopup(auth,googleProvider);
    const user=result.user;
    if(user){
      await createUserDocIfNotExists(user as any);
    }
    return result;
  }catch(e:any){
    if(e.code==='auth/account-exists-with-different-credential' || e.code==='auth/account-exists-with-different-credential'){
      const email=e.customData?.email || null;
      const pendingCredentials=e.credential || null;
      const error:any=new Error(`ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL`);
      error.email=email;
      error.pendingCredentials=pendingCredentials
      throw error
    }
    throw e
  }
}

export async function signInEmailAndLinkPending(email:string,password:string,pendingCredentials:any){
  const userCred=await signInWithEmailAndPassword(auth,email,password);
  if(pendingCredentials){
    await linkWithCredential(userCred.user,pendingCredentials);
  }else{

  }
  await createUserDocIfNotExists(userCred.user as any);
  return userCred;
}

export async function sendFriendInvite(senderUid:string,recipientEmail:string){
 
  const q=query(collection(db,'userEmails'),where('email','==',recipientEmail));
  const ref=doc(db,'userEmails',recipientEmail.toLowerCase());
  const rSnap=await getDoc(ref);
  if(!rSnap.exists())throw new Error('User with that email not found');
  const recipientUid=rSnap.data().uid as string;
  await setDoc(doc(db,'users',recipientUid,'friendRequests',senderUid),{
    from:senderUid,
    to:recipientUid,
    createdAt:serverTimestamp(),
    status:'pending'
  });

  await addDoc(collection(db,'users',recipientUid,'notifications'),{
    type:'friend_request',
    from:senderUid,
    payload:{},
    read:false,
    createdAt:serverTimestamp()
  })
}

export async function respondFriendRequest(recipientUid:string,senderUid:string,accept:boolean){
  const reqRef=doc(db,'users',recipientUid,'friendRequests',senderUid);
  const sentRef=doc(db,'users',senderUid,'sentFriendRequests',recipientUid);
  if(accept){
    await setDoc(doc(db, "users", recipientUid, "friends", senderUid), { uid: senderUid, status: "accepted", createdAt: serverTimestamp() });
    await setDoc(doc(db,'users',senderUid,'friends',recipientUid),{ uid: recipientUid, status: "accepted", createdAt: serverTimestamp() })

    await addDoc(collection(db,'users',senderUid,'notifications'),{
      type:'friend_accepted',
      from:recipientUid,
      read:false,
      createdAt:serverTimestamp()
    });
  }else{
    await addDoc(collection(db,'users',senderUid,'notifications'),{
      type:'friend_rejected',
      from:recipientUid,
      read:false,
      createdAt:serverTimestamp()
    })
  }

  await deleteDoc(reqRef).catch(()=>{})
  await deleteDoc(sentRef).catch(()=>{})
}

export async function sendSharedTask(senderUid:string,
  recipientUid:string,task:{title:string;deadline:Date;status?:string}
){
  await addDoc(collection(db,'users',recipientUid,'incomingSharedTasks'),{
    from:senderUid,
    title:task.title,
    deadline:task.deadline,
    status:task.status || 'pending',
    createdAt:serverTimestamp()
  });

  await addDoc(collection(db,'users',recipientUid,'notifications'),{
    type:'shared_task',
    from:senderUid,
    payload:{title:task.title},
    read:false,
    createdAt:serverTimestamp()
  })
}

export async function finishSharedTask(recipientUid:string,sharedTaskId:string){
  const sharedRef=doc(db,'users',recipientUid,'incomingSharedTasks',sharedTaskId);
  const snap=await getDoc(sharedRef);
  if(!snap.exists()) throw new Error('shared task not found');
  const data:any=snap.data();
  const senderUid=data.from as string;
  const title=data.title as string;
  await deleteDoc(sharedRef);

  await addDoc(collection(db,'users',senderUid,'notifications'),{
    type:'shared_task_finished',
    from:recipientUid,
    payload:{title},
    read:false,
    createdAt:serverTimestamp()
  })
}