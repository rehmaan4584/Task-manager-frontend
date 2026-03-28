import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await loginUser(form);
      if (data.success) {
        login(data);
      }
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Could not log in. Check your details and try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:py-16">
      <div className="glass-card relative w-full max-w-md p-8 sm:p-10">
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 50%, rgba(139,92,246,0.06) 100%)",
          }}
        />
        <div className="relative">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">
            Welcome back
          </p>
          <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-white">
            Log in
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Continue where you left off.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-premium"
                required
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-premium"
                required
              />
            </div>

            {error && (
              <p
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3.5 text-sm font-semibold text-zinc-950 shadow-glow transition hover:from-amber-400 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            No account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
