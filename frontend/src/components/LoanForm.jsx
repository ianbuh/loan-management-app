import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function LoanForm({ fetchLoans, token }) {
  const [borrower, setBorrower] = useState("");
  const [item, setItem] = useState("");

  const now = dayjs();
  const [dateBorrowed, setDateBorrowed] = useState(now.format("YYYY-MM-DDTHH:mm"));
  const [dueDate, setDueDate] = useState(now.add(7, "day").format("YYYY-MM-DDTHH:mm"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/loans",
        { borrower, item, date_borrowed: dateBorrowed, due_date: dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBorrower("");
      setItem("");
      setDateBorrowed(now.format("YYYY-MM-DDTHH:mm"));
      setDueDate(now.add(7, "day").format("YYYY-MM-DDTHH:mm"));
      fetchLoans();
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "border border-gray-800 dark:border-gray-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors";

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-lg mx-auto mb-6 space-y-4 transition-colors">
      <h2 className="text-xl font-bold mb-2">Add New Loan</h2>
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Borrower</label>
        <input type="text" value={borrower} onChange={(e) => setBorrower(e.target.value)} placeholder="Enter borrower name" className={inputClass} />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Item</label>
        <input type="text" value={item} onChange={(e) => setItem(e.target.value)} placeholder="Enter item name" className={inputClass} />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Date Borrowed</label>
        <input type="datetime-local" value={dateBorrowed} onChange={(e) => setDateBorrowed(e.target.value)} className={inputClass} />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Due Date</label>
        <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
      </div>
      <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
        Add Loan
      </button>
    </form>
  );
}
