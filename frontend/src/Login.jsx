import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logIn } from "./Api/api";

export default function Login({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await logIn({ email, password });
      console.log("Login successful:", res.data);

      // Navigate only if backend confirms success
      navigate("/dashboard");
      
      // reset form
      setEmail("");
      setPassword("");
    } catch (err) {
      setMsg(err.response?.data?.detail || "Login failed ❌");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Continue
      </button>

      <p className="text-sm text-center text-gray-500">or continue with Google</p>
      <button type="button" className="w-full border py-2 rounded-lg">Google</button>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={switchToSignup}
          className="text-blue-500 underline"
        >
          Signup
        </button>
      </div>

      {msg && <p className="text-center text-sm text-gray-700">{msg}</p>}
    </form>
  );
}
