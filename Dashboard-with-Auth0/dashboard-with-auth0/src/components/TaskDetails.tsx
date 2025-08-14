import { useEffect,useState } from "react"
import { useParams,useNavigate } from "react-router"
import { getTask,updateTask,type Task } from "../assets/UserTasks"


export default function TaskDetails() {
  const {taskId}=useParams();
  const navigate=useNavigate();
  const [task,setTask]=useState<Task | null>(null);

  useEffect(()=>{
    async function fetchTask(){
      if(!taskId) return;
      const task=await getTask(taskId);
      if(!task){
        navigate(`/tasks`);
        return;
      }
      setTask(task)
    }
    fetchTask()
  },[taskId,navigate]);

  async function handleUpdate(){
    if(!taskId || !task) return;
    await updateTask(taskId,{
      title:task.title,
      deadline:task.deadline,
      status:task.status
    });
    navigate('/tasks')
  }
  if(!task) return <div>Loading...</div>
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Task</h1>
      <div className="mb-2">
        <input
        type="text"
        value={task.title}
        onChange={(e)=>setTask({...task,title:e.target.value})}
        className="border p-1 w-full"
        />
      </div>
      <div className="mb-2">
        <input
        type="date"
        value={task.deadline.toISOString().split('T')[0]}
        onChange={(e)=>setTask({...task,deadline:new Date(e.target.value)})}
        className="border p-1 w-full"
        />
      </div>
      <div className="mb-4">
        <select 
        className="border p-1 w-full"
        value={task.status}
        onChange={(e)=>setTask({...task,status:e.target.value})}>
          <option value={'pending'}>Pending</option>
          <option value={'done'}>Done</option>
        </select>
      </div>
      <button className="bg-green-500 text-white px-3 py-1 rounded"
      onClick={handleUpdate}>
        Save Changes
      </button>
    </div>
  )
}
