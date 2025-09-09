import { useState, useEffect } from "react";
import axios from "axios";

export default function AddEmployee({ token }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editUsername, setEditUsername] = useState("");

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.filter((u) => u.role === "employee"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add new employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!username || !password) return setMessage("Please enter username and password");

    try {
      await axios.post(
        "http://localhost:5000/users",
        { username, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Employee '${username}' added successfully!`);
      setUsername("");
      setPassword("");
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding employee");
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const startEdit = (id, username) => {
    setEditId(id);
    setEditUsername(username);
  };

  // Save edited username
  const saveEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/users/${id}`,
        { username: editUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditUsername("");
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Employee Form */}
      <form
        onSubmit={handleAddEmployee}
        className="bg-white dark:bg-gray-800 text-black dark:text-gray-100 p-6 rounded shadow-md w-full max-w-md mx-auto space-y-4 transition-colors"
      >
        <h2 className="text-xl font-bold mb-2">Add New Employee</h2>
        {message && <p className="text-sm text-red-600 dark:text-red-400">{message}</p>}

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-400 dark:border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 dark:border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black dark:bg-white text-white dark:text-black p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Add Employee
        </button>
      </form>

      {/* Employee Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow-md transition-colors">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Username</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-3 border-b">{emp.id}</td>
                <td className="p-3 border-b">
                  {editId === emp.id ? (
                    <input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    emp.username
                  )}
                </td>
                <td className="p-3 border-b space-x-2">
                  {editId === emp.id ? (
                    <button
                      onClick={() => saveEdit(emp.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(emp.id, emp.username)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-3">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
