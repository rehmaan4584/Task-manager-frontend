import { signupUser } from "../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await signupUser(form);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed',error);
    }
  };

  return (
  <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
  <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/30">
    <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
      Signup Page
    </h1>
    <form className="flex flex-col gap-3" onSubmit={signUpHandler}>
      <input
        type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-300 p-3 rounded-lg outline-none transition"
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-300 p-3 rounded-lg outline-none transition"
      />

      <button
        type="submit"
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white font-semibold py-2 rounded-lg shadow-md transition"
      >
        Signup
      </button>
    </form>
  </div>
</div>

  );
};

export default Signup;
