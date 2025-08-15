import Nav from "../components/Nav";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../assets/Firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { sendSharedTask, finishSharedTask } from "../assets/AuthService";

export default function SharedTasks() {
  const { friendUsername } = useParams<{ friendUsername: string }>();
  const uid = auth.currentUser?.uid;
  const navigate = useNavigate();
  const [friendUid, setFriendUid] = useState<string | null>(null);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    async function resolveFriend() {
      if (!friendUsername) return;
      const usernameSnap = await getDoc(doc(db, "usernames", friendUsername));
      if (!usernameSnap.exists()) {
        navigate("/home");
        return;
      }
      const data: any = usernameSnap.data();
      setFriendUid(data.uid);
    }
    resolveFriend();
  }, [friendUsername]);

  useEffect(() => {
    async function loadIncoming() {
      if (!uid) return;
      const snap = await getDocs(collection(db, "users", uid, "incomingSharedTasks"));
      setIncoming(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    loadIncoming();
  }, [uid]);

  async function handleSend() {
    if (!uid || !friendUid) return;
    await sendSharedTask(uid, friendUid, { title, deadline: new Date(deadline) });
    setTitle("");
    setDeadline("");
  }

  async function handleFinish(id: string) {
    if (!uid) return;
    await finishSharedTask(uid, id);
    const snap = await getDocs(collection(db, "users", uid, "incomingSharedTasks"));
    setIncoming(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  return (
    <>
      <Nav />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Shared Tasks with {friendUsername}</h1>

        <div className="mb-4">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-1 mr-2" />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="border p-1 mr-2" />
          <button onClick={handleSend} className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
        </div>

        <h2 className="font-bold mb-2">Your Incoming Shared Tasks</h2>
        {incoming.length === 0 ? <div>No incoming shared tasks</div> : (
          <ul>
            {incoming.map((t) => (
              <li key={t.id} className="py-2 border-b flex justify-between">
                <div>{t.title} - {t.deadline?.toDate ? new Date(t.deadline.toDate()).toDateString() : (t.deadline ? new Date(t.deadline).toDateString() : "") }</div>
                <div>
                  <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleFinish(t.id)}>Finish</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}