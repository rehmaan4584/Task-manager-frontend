import { Outlet, Link,useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
function App() {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  return (
    <>
      <nav className="flex justify-center gap-8 items-center h-12 bg-white/30 backdrop-blur-md shadow-md border-b border-white/20 fixed top-0 left-0 right-0 z-50">
        <Link
          to="/"
          className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
        >
          Todo
        </Link>
        <Link
          to="/signup"
          className="text-green-600 font-semibold hover:text-green-800 transition"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:text-blue-800 transition"
        >
          Login
        </Link>

        <div className="absolute right-6"
        onClick={()=>handleLogout()}>
          <button className="bg-black-500 hover:bg-red-600 text-white rounded-lg px-3 py-1 text-sm shadow-md transition">
            Logout
          </button>
        </div>
        <div className="absolute right-6"
        onClick={()=>handleLogout()}>
          <button className="bg-black-500 hover:bg-red-600 text-white rounded-lg px-3 py-1 text-sm shadow-md transition">
            Logout
          </button>
        </div>
        <div className="absolute right-6"
        onClick={()=>handleLogout()}>
          <button className="bg-black-500 hover:bg-red-600 text-white rounded-lg px-3 py-1 text-sm shadow-md transition">
            Logout
          </button>
        </div>
      </nav>

      <hr />
      <Outlet />
    </>
  );
}

export default App;
