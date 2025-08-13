import Nav from "../components/Nav";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../assets/Firebase";
import { doc, getDoc, runTransaction, setDoc } from "firebase/firestore";
import {
  signInWithPopup,GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useLogin } from "../context/LoginContext";


export default function Register() {
  const { setIsLoggedIn } = useLogin();
  const navigate = useNavigate();
  const [login, SetLogin] = useState("");
  const [email, SetEmail] = useState("");
  const [passwordCheck, SetPasswordCheck] = useState("");
  const [password, SetPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptchaAlert, setShowCaptchaAlert] = useState(false);

  const handleCaptcha = (value: string | null) => {
    setCaptchaVerified(!!value);
  };

  const register = async () => {
    if (!captchaVerified) {
      setShowCaptchaAlert(true);
      setTimeout(() => setShowCaptchaAlert(false), 3000);
      return;
    }

    if (!login || !email || !passwordCheck || !password) return;
    if (password !== passwordCheck) return;
    if (password.length < 8) return;
    if (!email.includes("@")) return;

    try {
      const usernameRef = doc(db, "usernames", login.toLowerCase());
      const userDoc = await getDoc(usernameRef);
      if (userDoc.exists()) {
        alert("Username already taken");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid=userCredential.user.uid;
      await setDoc(usernameRef,{uid});
      await setDoc(doc(db,'users',uid),{
        email,
        username:login.toLowerCase()
      });
      await sendEmailVerification(userCredential.user);

      setIsLoggedIn(true);
      navigate('/home');
    }catch(e:any){
      alert(e.message)
    }
  }

  const googleSignUp = async () => {
  if (!captchaVerified) {
    setShowCaptchaAlert(true);
    setTimeout(() => setShowCaptchaAlert(false), 3000);
    return;
  }

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (!user) throw new Error("Google sign-in returned no user");

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setIsLoggedIn(true);
      navigate("/home");
      return;
    }

    await runTransaction(db, async (tx) => {
      let baseUsername = (user.displayName || user.email?.split("@")[0] || "user")
        .replace(/\s+/g, "")
        .toLowerCase();
      let finalUsername = baseUsername;
      let suffix = 1;

      while ((await tx.get(doc(db, "usernames", finalUsername))).exists()) {
        finalUsername = `${baseUsername}${suffix}`;
        suffix++;
      }

      tx.set(doc(db, "usernames", finalUsername), { uid: user.uid });
      tx.set(doc(db, "users", user.uid), {
        email: user.email,
        username: finalUsername,
        createdAt: new Date(),
      });
    });

    setIsLoggedIn(true);
    navigate("/home");
  } catch (e: any) {
    console.error("Google sign-up failed", e);
    alert("Sign in Failed " + e.message);
  }
};

  return (
    <>
      <Nav/>
      <div className="h-full flex bg-gray-300 justify-center min-h-screen">
        <div className="w-full md:w-[45%] bg-white m-4 rounded-3xl text-center h-[75vh] md:h-auto overflow-y-auto md:overflow-y-visible">
          <p className="text-4xl mt-8 font-bold">Register</p>
          <div>
            <div className="w-[75%] mt-10 h-[500px] justify-self-center text-left text-2xl flex-row">
              <form>
                <span className="text-gray-900">Login </span>
                <input
                  className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full"
                  type="text"
                  placeholder="Type Your Login"
                  value={login}
                  onChange={(e) => SetLogin(e.target.value)}
                />
                <span className="text-gray-900">Email </span>
                {!email.includes("@") && email !== "" && (
                  <span className="text-red-500 text-sm py-1">
                    Provide real email
                  </span>
                )}
                <input
                  className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full"
                  placeholder="Type Your Email"
                  value={email}
                  onChange={(e) => SetEmail(e.target.value)}
                />
                <span className="text-gray-900">Password </span>
                <div className="relative">
                  <input
                    className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="Type Your Password"
                    value={password}
                    onChange={(e) => SetPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex item-center text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                <span className="text-gray-900">Confirm Password </span>
                <div className="relative">
                  <input
                    className="text-base hover:text-black bg-gray-200 rounded-md p-1 flex w-full pr-10"
                    type={showPasswordCheck ? "text" : "password"}
                    placeholder="Type Your Password"
                    value={passwordCheck}
                    onChange={(e) => SetPasswordCheck(e.target.value)}
                  />
                  {password !== passwordCheck && password !== "" && (
                    <span className="text-red-500 text-sm py-1">
                      Your passwords need to be equal
                    </span>
                  )}
                  {password.length < 8 && password !== "" && (
                    <span className="text-red-500 text-sm py-1">
                      Password needs to be longer or equal to eight characters
                    </span>
                  )}
                  {!login || !email || !passwordCheck || !password ? (
                    <span className="text-red-500 text-sm py-1">
                      You need to provide all necessary data
                    </span>
                  ) : null}
                  <button
                    onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex item-center text-gray-600 hover:text-gray-900"
                  >
                    {showPasswordCheck ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                <ReCAPTCHA
                  sitekey="6LeJeKErAAAAAEYKjT5BTbWhaOCOlxfpLIwtvzMg"
                  onChange={handleCaptcha}
                  className="mt-4"
                />
                {showCaptchaAlert && (
                  <p className="text-red-500 text-sm mt-2">
                    Please verify CAPTCHA
                  </p>
                )}

                <button
                  type="submit"
                  className="bg-gray-500 text-white text-base border rounded-lg p-3 mt-3 font-bold hover:bg-gray-400 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    register();
                  }}
                >
                  Create Account
                </button>

                <button
                  type="button"
                  className="bg-white text-black text-base border rounded-lg p-3 mt-3 font-bold hover:bg-gray-100 cursor-pointer"
                  onClick={googleSignUp}
                >
                  Sign with Google
                </button>

                <p>
                  <Link
                    to={"/login"}
                    className="mt-12 text-base text-blue-500 cursor-pointer hover:underline"
                  >
                    If you have an account Login instead
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
