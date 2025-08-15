import {db,auth} from "./Firebase"
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
}from 'firebase/firestore'

export type Task={
  id?:string;
  title:string;
  deadline:Date ;
  status:string;
  createdAt?:any;
}

function tasksCollectionRef(){
  if(!auth.currentUser)throw new Error('not logged');
  return collection(db,'users',auth.currentUser.uid,'tasks');
}

export async function getTasks(): Promise<Task[]> {
  const snapshot = await getDocs(tasksCollectionRef());
  return snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      title:data.title,
      status:data.status,
      createdAt:data.createdAt,
      deadline:
        data.deadline instanceof Timestamp
          ? data.deadline.toDate()
          : new Date(data.deadline),
    } as Task;
  });
}

export async function getTask(id: string): Promise<Task | null> {
  if (!auth.currentUser) throw new Error("User not logged in");
  const taskRef = doc(db, "users", auth.currentUser.uid, "tasks", id);
  const snap = await getDoc(taskRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    title: data.title,
    status: data.status,
    createdAt:data.createdAt,
    deadline:
      data.deadline instanceof Timestamp
        ? data.deadline.toDate()
        : new Date(data.deadline),
  } as Task;
}

export async function addTask(task:Omit<Task,'id'|'createdAt'>){
  await addDoc(tasksCollectionRef(),{
    ...task,
    createdAt:serverTimestamp(),
    deadline:Timestamp.fromDate(task.deadline)
  })
}

export async function updateTask(id:string,updatedTask:Omit<Task,"id"|"createdAt">){
  if(!auth.currentUser) throw new Error('not loggedin');
  const taskRef=doc(db,'users',auth.currentUser.uid,'tasks',id);
  await updateDoc(taskRef,{
    ...updateTask,
    deadline:Timestamp.fromDate(updatedTask.deadline)
  })
}

export async function deleteTask(id:string){
  if(!auth.currentUser) throw new Error('Not loggedin');
  const taskRef=doc(db,'users',auth.currentUser.uid,'tasks',id);
  await deleteDoc(taskRef)
}