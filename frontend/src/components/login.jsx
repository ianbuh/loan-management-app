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
    "w-full p-2 border border-gray-400 dark:border-gray-600 rounded text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm space-y-4 transition-colors">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
        <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Login</button>
      </form>
    </div>
  );
}
