import { Link, useLocation } from "react-router-dom";
import LOGO from "../assets/LOGO.png";

export default function Nav({ loginstatus }: { loginstatus?: string }) {
  const locationDOM = useLocation();

  return (
    <div className="bg-gray-900 w-full max-h-40 h-14 text-white py-8 top-0 flex items-center px-4 ">
      {/* Logo */}
      <div className="block">
        <Link
          to="/home"
          onClick={() => {
            if (location.pathname === "/home") {
              location.reload();
            }
          }}
          className="cursor-pointer inline-block"
        >
          <img
            src={LOGO}
            alt="Logo"
            className="size-[55px] hover:bg-gray-800 hover:rounded-xl m-3"
          />
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Login/Register button */}
      <div className="mr-6 py-1 text-base w-[20%] grid gap-3 grid-cols-3">
        <Link
  to={loginstatus ? "/register" : "/login"}
  state={!loginstatus ? { backgroundLocation: locationDOM } : undefined}
  className="px-3 border rounded-md cursor-pointer bg-white text-gray-900 font-bold py-1 hover:bg-gray-300 text-center justify-self-end col-span-1 col-start-3"
>
  <button className="cursor-pointer">
    {loginstatus ? loginstatus : "Login"}
  </button>
</Link>
      </div>
    </div>
  );
}
