import axios from "axios";
import dayjs from "dayjs";

export default function LoanList({ loans, fetchLoans, token, role }) {
  const handleReturn = async (id) => {
    try {
      await axios.put(`http://localhost:5000/loans/${id}/return`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLoans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/loans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLoans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
<div className="overflow-x-auto mt-4 shadow-md rounded-lg bg-white">
      <table className="min-w-full bg-white text-gray-900 border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-6 border-b border-gray-200 text-left">Item</th>
            <th className="py-3 px-6 border-b border-gray-200 text-left">Borrower</th>
            <th className="py-3 px-6 border-b border-gray-200 text-left">Due Date</th>
            <th className="py-3 px-6 border-b border-gray-200 text-left">Status</th>
            {role !== "employee" && <th className="py-3 px-6 border-b border-gray-200 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => {
            const now = dayjs();
            const due = dayjs(loan.due_date);
            let status = "Pending";

            if (loan.returned) status = "Returned";
            else if (now.isAfter(due)) status = "Overdue";

            return (
              <tr
                key={loan.id}
                className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  status === "Overdue" ? "bg-red-100 dark:bg-red-800" : ""
                } transition-colors`}
              >
                <td className="p-3 border-b">{loan.borrower}</td>
                <td className="p-3 border-b">{loan.item}</td>
                <td className="p-3 border-b">{dayjs(loan.date_borrowed).format("YYYY-MM-DD HH:mm")}</td>
                <td className="p-3 border-b">{dayjs(loan.due_date).format("YYYY-MM-DD HH:mm")}</td>
                <td
                  className={`p-3 border-b font-semibold ${
                    status === "Overdue"
                      ? "text-red-700 dark:text-red-400"
                      : status === "Returned"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {status}
                </td>
                {(role === "super-admin" || role === "admin") && (
                  <td className="p-3 border-b space-x-2">
                    {!loan.returned && (
                      <button
                        onClick={() => handleReturn(loan.id)}
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                      >
                        Return
                      </button>
                    )}
                    {(role === "super-admin") && (
                      <button
                        onClick={() => handleDelete(loan.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
