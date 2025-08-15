import { Link, useLocation,useNavigate } from "react-router-dom";
import LOGO from "../assets/LOGO.png";
import { useLogin } from "../context/LoginContext";
import { useEffect,useState,useRef } from "react";
import {auth,db} from'../assets/Firebase'
import {collection,query,where,onSnapshot,orderBy,doc,deleteDoc} from 'firebase/firestore'
import { respondFriendRequest } from "../assets/AuthService";

export default function Nav() {
  const location = useLocation();
  const {isLoggedIn,logout}=useLogin();
  const navigate=useNavigate();
  const [unreadCount,setUnreadCount]=useState(0);
  const [showNotifications,setshowNotifications]=useState(false);
  const [notifications,setNotifications]=useState<any[]>([]);
  const [uid,setUid]=useState<string | null>(null);
  const dropdownRef=useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    const user=auth.currentUser;
    setUid(user?.uid ?? null);
    if(!user){
      setUnreadCount(0);
      setNotifications([])
      return;
    }
    const queryUnread=query(collection(db,'users',user.uid,'notifications'),where('read','==',false));
    const unsubUnread=onSnapshot(queryUnread,(snap)=>{
      setUnreadCount(snap.size || 0);
    });
    const queryAll=query(collection(db,'users',user.uid,'notifications'),orderBy('createdAt','desc'));
     const unsubAll = onSnapshot(queryAll, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return ()=>{
      unsubUnread();
      unsubAll()
    }
  },[isLoggedIn])

useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setshowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/home");
    } catch (e) {
      console.error(e);
    }
  };

  async function handleFriendResponse(notif: any, accept: boolean) {
    const fromUid = notif.from as string;
    const toUid = uid!;
    await respondFriendRequest(toUid, fromUid, accept);
    await deleteDoc(doc(db, "users", uid!, "notifications", notif.id));
  }

  function renderNotif(n: any) {
    if (n.type === "friend_request") {
      return (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Friend request</div>
            <div className="text-xs">From {n.from}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-green-500 text-white rounded text-xs" onClick={() => handleFriendResponse(n, true)}>Confirm</button>
            <button className="px-2 py-1 bg-red-500 text-white rounded text-xs" onClick={() => handleFriendResponse(n, false)}>Reject</button>
          </div>
        </div>
      );
    }
    if (n.type === "shared_task") {
      return (
        <div>
          <div className="font-semibold text-sm">Task shared</div>
          <div className="text-xs">"{n.payload?.title}" from {n.from}</div>
        </div>
      );
    }
    if (n.type === "friend_accepted") {
      return <div className="text-sm">Your friend request was accepted</div>;
    }
    if (n.type === "shared_task_finished") {
      return <div className="text-sm">"{n.payload?.title}" finished by {n.from}</div>;
    }

    return <div className="text-sm">Notification</div>;
  }

 return (
    <div className="bg-gray-900 w-full max-h-40 h-14 text-white py-8 top-0 flex items-center px-4 ">
      <div className="block">
        <Link to="/home" className="cursor-pointer inline-block">
          <img src={LOGO} alt="Logo" className="size-[55px] hover:bg-gray-800 hover:rounded-xl m-3" />
        </Link>
      </div>

      <div className="flex gap-6 ml-4">
        {isLoggedIn && (
          <Link to={'/tasks'} className="px-3 border rounded-md cursor-pointer bg-white text-gray-900 font-bold py-1 hover:bg-gray-300 text-center">
            Tasks
          </Link>
        )}
      </div>

      <div className="flex-grow"></div>

      <div className="mr-6 py-1 text-base w-[20%] grid gap-3 grid-cols-3">
        {!isLoggedIn ? (
          <>
            <div className="col-span-2 self-center text-sm text-yellow-200 cursor-pointer" onClick={() => navigate("/register")}>
              Register to get started
            </div>
            <Link to={'/login'} state={{ backgroundLocation: location }} className="px-3 border rounded-md cursor-pointer bg-white text-gray-900 font-bold py-1 hover:bg-gray-300 text-center justify-self-end col-span-1 col-start-3">
              Login
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 col-span-2">
              <div className="relative">
                <button onClick={() => setshowNotifications(!showNotifications)} className="relative">
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-1 text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-96 bg-white text-black border rounded shadow p-2 z-50">
                    {notifications.length === 0 ? (
                      <div className="p-2 text-sm">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-2 border-b last:border-b-0">
                          {renderNotif(n)}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleLogout} className="px-3 border rounded-md cursor-pointer bg-white text-gray-900 font-bold py-1 hover:bg-gray-300 text-center justify-self-end col-span-1 col-start-3">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}