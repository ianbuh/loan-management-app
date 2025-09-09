import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function Dashboard({ loans }) {
  let returned = 0,
    overdue = 0,
    pending = 0;

  const now = dayjs();

  loans.forEach((loan) => {
    const due = dayjs(loan.due_date);
    if (loan.returned) returned++;
    else if (now.isAfter(due)) overdue++;
    else pending++;
  });

  const chartData = [
    { name: "Returned", count: returned },
    { name: "Pending", count: pending },
    { name: "Overdue", count: overdue },
  ];

  const totalLoans = loans.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center transition-colors">
          <h2 className="text-lg font-semibold">Total Loans</h2>
          <p className="text-2xl font-bold">{totalLoans}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center transition-colors">
          <h2 className="text-lg font-semibold">Returned</h2>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{returned}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center transition-colors">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{pending}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center transition-colors">
          <h2 className="text-lg font-semibold">Overdue</h2>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdue}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md transition-colors">
        <h2 className="text-xl font-bold mb-4">Loan Status Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
