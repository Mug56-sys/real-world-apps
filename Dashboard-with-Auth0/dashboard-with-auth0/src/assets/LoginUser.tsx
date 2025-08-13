import { auth, db } from './Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type LoginOptions = {
  loginChoice: 'Email' | 'UserName';
  identifier: string;
  password: string;
};

export async function loginUser({ loginChoice, identifier, password }: LoginOptions) {
  if (!identifier || !password) {
    throw new Error('Missing login credentials');
  }

  let emailToUse = identifier;

  if (loginChoice === 'UserName') {
    const usernameDoc = await getDoc(doc(db, 'usernames', identifier.toLowerCase()));
    if (!usernameDoc.exists()) {
      throw new Error('Username not found');
    }

    const { uid } = usernameDoc.data();
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User record not found');
    }

    const userData = userDoc.data();
    if (!userData?.email) {
      throw new Error('Email not found for this user');
    }

    emailToUse = userData.email;
  }

  await signInWithEmailAndPassword(auth, emailToUse, password);
}