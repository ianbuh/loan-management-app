import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import LoanList from "./components/LoanList";
import LoanForm from "./components/LoanForm";
import EmployeesTab from "./components/EmployeesTab";
import MainPage from "./components/MainPage";

// Environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(null);
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchLoans = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/loans`, {
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
      const res = await axios.get(`${API_URL}/users`, {
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

  const sidebarContent = (
    <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-md h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Loan Management
      </h1>

      <button
        className={`mb-3 px-4 py-2 rounded text-left ${
          activeTab === "dashboard"
            ? "bg-gray-200 font-semibold"
            : "hover:bg-gray-100"
        }`}
        onClick={() => setActiveTab("dashboard")}
      >
        Dashboard
      </button>

      <button
        className={`mb-3 px-4 py-2 rounded text-left ${
          activeTab === "loans"
            ? "bg-gray-200 font-semibold"
            : "hover:bg-gray-100"
        }`}
        onClick={() => setActiveTab("loans")}
      >
        Loans
      </button>

      {(role === "super-admin" || role === "admin") && (
        <button
          className={`mb-3 px-4 py-2 rounded text-left ${
            activeTab === "employees"
              ? "bg-gray-200 font-semibold"
              : "hover:bg-gray-100"
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
          setActiveTab("dashboard");
        }}
      >
        Logout
      </button>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setToken={setToken} setRole={setRole} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            token ? (
              <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-900 font-sans transition-colors">
                {/* Mobile top bar */}
                <div className="md:hidden flex justify-between items-center bg-white p-4 shadow-md">
                  <h1 className="text-xl font-bold">Loan Management</h1>
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-700 focus:outline-none"
                  >
                    {/* Hamburger icon */}
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Sidebar */}
                <div
                  className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 p-6 shadow-md transition-transform duration-300 md:relative md:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  {sidebarContent}
                </div>

                {/* Overlay when sidebar is open on mobile */}
                {sidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black opacity-25 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}

                {/* Main content */}
                <main className="flex-1 p-4 md:p-8 overflow-x-auto">
                  {activeTab === "dashboard" && <Dashboard loans={loans} />}
                  {activeTab === "loans" && (
                    <>
                      <LoanForm
                        fetchLoans={fetchLoans}
                        token={token}
                        apiUrl={API_URL}
                      />
                      <LoanList
                        loans={loans}
                        fetchLoans={fetchLoans}
                        token={token}
                        role={role}
                        apiUrl={API_URL}
                      />
                    </>
                  )}
                  {activeTab === "employees" &&
                    (role === "super-admin" || role === "admin") && (
                      <EmployeesTab
                        users={users}
                        fetchUsers={fetchUsers}
                        token={token}
                        role={role}
                        apiUrl={API_URL}
                      />
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
