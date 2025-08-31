import { useState } from "react";
import { signUp } from "./Api/api";

export default function Signup({ switchToLogin }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
        setMsg("Password must be at least 8 characters long ❌");
        return;
    }
    try {
      await signUp(form);
      setMsg("Signup successful 🎉");
      switchToLogin();
    } catch (err) {
      setMsg(err.response?.data?.detail || "Signup failed ❌");
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Signup</h2>

      <div className="flex space-x-2">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="w-1/2 p-2 border rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="w-1/2 p-2 border rounded-lg"
          onChange={handleChange}
          required
        />
      </div>

      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full p-2 border rounded-lg"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-2 border rounded-lg"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        className="w-full p-2 border rounded-lg"
        onChange={handleChange}
        minLength={8}
        required
      />

      <button
        type="submit"
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Continue
      </button>

      <p className="text-sm text-center text-gray-500">or continue with Google</p>
      <button className="w-full border py-2 rounded-lg">Google</button>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={switchToLogin}
          className="text-blue-500 underline"
        >
          Login
        </button>
        <button type="submit" className="text-green-500 underline">
          Signup
        </button>
      </div>

      {msg && <p className="text-center text-sm text-gray-700">{msg}</p>}
    </form>
  );
}
