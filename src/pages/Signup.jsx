import { signupUser } from "../services/authService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signupUser(form);
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Sign up failed. That email may already be in use.";
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
              "linear-gradient(135deg, rgba(74,222,128,0.07) 0%, transparent 45%, rgba(245,158,11,0.06) 100%)",
          }}
        />
        <div className="relative">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
            Join
          </p>
          <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-white">
            Create account
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-400">
            One minute to your personal task list.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-premium"
                required
              />
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Choose a secure password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:from-emerald-400 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
