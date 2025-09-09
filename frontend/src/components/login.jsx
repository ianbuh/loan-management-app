import { useState } from "react";
import axios from "axios";

export default function Login({ setToken, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      setToken(res.data.token);
      setRole(res.data.role);
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-400 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-colors";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4 transition-colors">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
        <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors">Login</button>

        {/* Demo Credentials */}
        <div className="mt-4 text-sm text-gray-700">
          <p><strong>Demo Super Admin:</strong> superadmin@example.com / admin123</p>
          <p><strong>Demo Admin:</strong> peyt@example.com / peyt123</p>
          <p><strong>Demo Employee:</strong> paul@example.com / paul123</p>
        </div>
      </form>
    </div>
  );
}
