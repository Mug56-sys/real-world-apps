import Nav from "../components/Nav";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../assets/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
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
    setCaptchaVerified(value ? true :false);
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
      const userDoc = await getDoc(doc(db, "usernames", login.toLowerCase()));
      if (userDoc.exists()) {
        alert("Username already taken");
        return;
      }

      const userData = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "usernames", login.toLowerCase()), {
        uid: userData.user.uid,
      });

      await setDoc(doc(db, "users", userData.user.uid), {
        email,
        username: login.toLowerCase(),
      });

      await sendEmailVerification(userData.user);

      navigate("/home");
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e);
        alert(e.message);
      } else {
        alert("unexpected error");
      }
    }
  };

  const googleSignUp = async () => {
    if (!captchaVerified) {
      setShowCaptchaAlert(true);
      setTimeout(() => setShowCaptchaAlert(false), 3000);
      return;
    }

    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const user = result.user;
          let baseUsername =
            user.displayName?.replace(/\s+/g, "").toLowerCase() || "user";
          let finalUsername = baseUsername;
          let suffix = 1;

          while ((await getDoc(doc(db, "usernames", finalUsername))).exists()) {
            finalUsername = `${baseUsername}${suffix}`;
            suffix++;
          }

          await setDoc(doc(db, "usernames", finalUsername), {
            uid: user.uid,
          });

          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            username: finalUsername,
          });

          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Redirect sign-in error:", error);
      });
  }, [navigate]);

  return (
    <>
      <Nav loginstatus="Logout" />
      <div className="h-full flex bg-gray-300 justify-center min-h-screen ">
        <div className="w-full md:w-[45%] bg-white m-4 rounded-3xl text-center
                h-[75vh] md:h-auto overflow-y-auto md:overflow-y-visible">
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
                {!email.includes("@") && email !== "" ? (
                  <span className="text-red-500 text-sm py-1">
                    Provide real email
                  </span>
                ) : null}
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
                    onChange={(e) => {
                      SetPassword(e.target.value);
                      setShowPassword(false);
                      setShowPasswordCheck(false);
                    }}
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
                    onChange={(e) => {
                      SetPasswordCheck(e.target.value);
                      setShowPassword(false);
                      setShowPasswordCheck(false);
                    }}
                  />
                  {password !== passwordCheck && password !== "" ? (
                    <>
                      <span className="text-red-500 text-sm py-1">
                        Your passwords need to be equal
                      </span>
                      <br />
                    </>
                  ) : null}
                  {password.length < 8 && password !== "" ? (
                    <>
                      <span className="text-red-500 text-sm py-1">
                        Password needs to be longer or equal to eight characters
                      </span>
                      <br />
                    </>
                  ) : null}
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
                  className="mt-12 text-base text-blue-500 cursor-pointer hover:underline "
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
