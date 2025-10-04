import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form);
      if(data.success){
        login(data);
      }
      localStorage.setItem('token',data.token)
      console.log('user',data?.user?.email);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
  <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/30">
    <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
      Login Page
    </h1>
    <form className="flex flex-col gap-3" onSubmit={signUpHandler}>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Enter your email"
        className="border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 p-3 rounded-lg outline-none transition"
      />

      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Enter your password"
        className="border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 p-3 rounded-lg outline-none transition"
      />

      <button
        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-2 rounded-lg shadow-md transition"
        type="submit"
      >
        Login
      </button>
    </form>
  </div>
</div>

  );
};

export default Login;
