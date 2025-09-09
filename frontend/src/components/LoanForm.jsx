import { useState } from "react";
import axios from "axios";

export default function LoanForm({ fetchLoans, token, apiUrl }) {
  const [employee, setEmployee] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employee || !amount) return;

    try {
      await axios.post(
        `${apiUrl}/loans`,
        { employee, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployee("");
      setAmount("");
      fetchLoans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Add Loan</h2>
      <input
        type="text"
        placeholder="Employee Name"
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add Loan
      </button>
    </form>
  );
}
