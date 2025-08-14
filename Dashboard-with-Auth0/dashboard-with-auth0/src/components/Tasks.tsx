import { useEffect,useState } from "react"
import {Link} from 'react-router-dom'
import {type Task,getTasks, addTask,deleteTask} from "../assets/UserTasks"
import Nav from "./Nav";

export default function Tasks() {
  const [tasks,setTasks]=useState<Task[]>([]);
  const [title,setTitle]=useState('');
  const [deadline,setDeadline]=useState('');
  const [status,setStatus]=useState('pending');

  useEffect(()=>{
    refreshTasks()
  },[])
  async function refreshTasks(){
    try{
      setTasks(await getTasks())
    }catch(e){
      console.error(e)
    }
  }

  async function handleAddTask(){
    if(!title || !deadline)return;
    await addTask({
      title,
      deadline:new Date(deadline),
      status
    });
    setTitle('')
    setDeadline('')
    setStatus('pending')
    refreshTasks()
  }

  async function handleDeleteTask(id?:string){
    if(!id) return;
    await deleteTask(id);
    refreshTasks()
  }
  return (
  <>
  <Nav/>
    <div className="p-4">
      
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      
      <div className="mb-4">
      <input
      type="text"
      placeholder="Task title"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      className="border p-1 mr-2"
      />
      <input
      type="date"
      value={deadline}
      onChange={(e)=>setStatus(e.target.value)}
      className="border p-1 mr-2"
      />
      <select
      value={status}
      onChange={(e)=>setStatus(e.target.value)}
      className="border p-1 mr-2"
      >
        <option value={'pending'}>Pending</option>
        <option value={'done'}>Done</option>
      </select>
      <button onClick={handleAddTask}
      className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
        Add Task
      </button>
      </div>
      <ul>
        {tasks.map((task)=>(
          <li key={task.id} className="border-b py-2 flex justify-between">
            <Link to={`/tasks/${task.id}`} className="text-blue-600 underline">
            {task.title}-{task.deadline.toDateString()}-{task.status}
            </Link>
            <button 
            onClick={()=>handleDeleteTask(task.id)}
            className="bg-red-500 text-white px-2 py-1 rounded">
              Delete
            </button>
          </li>
        ))

        }
      </ul>
    </div>
    </>
  )
}
