import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="flex justify-center grid content-center h-screen ">
      Page not found
      <p className="bg-blue-500 p-1 hover:bg-blue-600 text-white border rounded-lg text-center"><Link to={'/home'}>Go home </Link></p>
    </div>
  );
}
