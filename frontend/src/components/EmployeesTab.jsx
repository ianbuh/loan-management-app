import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EmployeesTab({ token, role }) {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("employee");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/users`,
        { name, email, password, role: userRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setEmail("");
      setPassword("");
      setUserRole("employee");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "border border-gray-400 dark:border-gray-600 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors";

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddUser} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-lg mx-auto space-y-4 transition-colors">
        <h2 className="text-xl font-bold">Add New User</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className={inputClass}>
          {role === "super-admin" && <option value="admin">Admin</option>}
          <option value="employee">Employee</option>
        </select>
        <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
          Add User
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow-md transition-colors">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <td className="p-3 border-b">{user.name}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
