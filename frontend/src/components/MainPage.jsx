import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-6 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold">Loan Management System</h1>
        <p className="mt-2 text-gray-300">Keep track of loans, due dates, and manage your employees efficiently.</p>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between p-6 md:p-12 gap-6">
        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Why Use Loan Management?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Track borrowed items and due dates automatically.</li>
            <li>Highlight overdue items to prevent losses.</li>
            <li>Manage employees and admins with role-based access.</li>
            <li>Interactive dashboard with live stats and charts.</li>
            <li>Mobile-friendly and professional interface.</li>
          </ul>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 bg-blue-500 hover:bg-blue-600 transition-colors text-black font-semibold px-6 py-3 rounded shadow-md"
          >
            Get Started
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Loan Management Illustration"
            className="w-64 md:w-80"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="p-6 md:p-12 bg-gray-800 rounded-t-3xl mt-6 md:mt-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
          <div className="bg-gray-700 p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Loan Tracking</h3>
            <p>Keep records of all borrowed items and automatically highlight overdue items.</p>
          </div>
          <div className="bg-gray-700 p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
            <p>Role-based access for super-admin, admin, and employees. Control who can manage loans and users.</p>
          </div>
          <div className="bg-gray-700 p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Interactive Dashboard</h3>
            <p>View live stats, overdue items, and charts that dynamically update according to loans.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 p-6 text-center mt-auto text-gray-400">
        &copy; {new Date().getFullYear()} Loan Management System. All rights reserved.
      </footer>
    </div>
  );
}
