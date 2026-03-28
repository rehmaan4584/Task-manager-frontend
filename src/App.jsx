import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
      isActive
        ? "bg-amber-500/15 text-amber-300"
        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
    ].join(" ");

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-zinc-950/75 backdrop-blur-xl">
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
          aria-label="Main"
        >
          <div className="flex items-center gap-3">
            <NavLink
              to="/"
              className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-lg"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-lg shadow-glow"
                aria-hidden
              >
                ✓
              </span>
              <span className="hidden font-semibold tracking-tight text-white sm:block">
                Task Studio
              </span>
            </NavLink>
          </div>

          <div className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
            <NavLink to="/" className={linkClass} end>
              Todos
            </NavLink>
            <NavLink to="/signup" className={linkClass}>
              Sign up
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Log in
            </NavLink>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 sm:px-4 sm:text-sm"
          >
            Log out
          </button>
        </nav>
      </header>

      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
    </>
  );
}

export default App;
