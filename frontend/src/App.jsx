import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainPage from "./components/MainPage.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LoanForm from "./components/LoanForm.jsx";
import LoanList from "./components/LoanList.jsx";
import EmployeesTab from "./components/EmployeesTab.jsx";

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // 'super-admin', 'admin', 'employee'
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const fetchLoans = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/loans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchUsers();
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <Login setToken={setToken} setRole={setRole} />}
        />
        <Route
          path="/dashboard"
          element={
            token ? (
              <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans transition-colors">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-md">
                  <h1 className="text-2xl font-bold mb-6 text-gray-800">Loan Management</h1>

                  <button
                    className={`mb-3 px-4 py-2 rounded text-left ${
                      activeTab === "dashboard" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    Dashboard
                  </button>

                  <button
                    className={`mb-3 px-4 py-2 rounded text-left ${
                      activeTab === "loans" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("loans")}
                  >
                    Loans
                  </button>

                  {(role === "super-admin" || role === "admin") && (
                    <button
                      className={`mb-3 px-4 py-2 rounded text-left ${
                        activeTab === "employees" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("employees")}
                    >
                      Users
                    </button>
                  )}

                  <button
                    className="mt-auto px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    onClick={() => {
                      setToken(null);
                      setRole(null);
                    }}
                  >
                    Logout
                  </button>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-8 overflow-x-auto">
                  {activeTab === "dashboard" && <Dashboard loans={loans} />}
                  {activeTab === "loans" && (
                    <>
                      <LoanForm fetchLoans={fetchLoans} token={token} />
                      <LoanList loans={loans} fetchLoans={fetchLoans} token={token} role={role} />
                    </>
                  )}
                  {activeTab === "employees" &&
                    (role === "super-admin" || role === "admin") && (
                      <EmployeesTab users={users} fetchUsers={fetchUsers} token={token} role={role} />
                    )}
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
