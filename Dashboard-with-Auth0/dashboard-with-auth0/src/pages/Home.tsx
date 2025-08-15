import Nav from "../components/Nav";
import { auth, db } from "../assets/Firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Home() {
  const [friends, setFriends] = useState<any[]>([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    async function loadFriends() {
      if (!uid) return;
      const snap = await getDocs(collection(db, "users", uid, "friends"));
      const items = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const friendUid = d.id;
          const userSnap = await getDoc(doc(db, "users", friendUid));
          const username = userSnap.exists()
            ? (userSnap.data() as any).username
            : friendUid;
          return { uid: friendUid, username };
        })
      );
      setFriends(items);
    }
    loadFriends();
  }, [uid]);
  if (!uid) {
    return (
      <>
        <Nav />
      </>
    );
  }
  return(
    <>
    <Nav/>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Friends</h1>
      {friends.length===0 ?<div>No friends yet</div>:(
        <ul>
          {friends.map((friend)=>(
            <li key={friend.uid} className="py-2">
              <Link to={`/shared/${friend.username}`} className="text-blue-600 underline">
              {friend.username}
              </Link>
            </li>)
          )}
        </ul>
      )}
    </div>
    </>
  )
}
