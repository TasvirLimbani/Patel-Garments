'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Salary } from '@/lib/mockData';

export function SalaryPage() {
  const { user } = useAuth();

  const today = new Date();
  const currentMonth = String(today.getMonth() + 1);
  const currentYear = String(today.getFullYear());

  const [salarys, setSalary] = useState<Salary[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // FETCH
  const fetchSalaries = async () => {
    try {
      setEmployeesLoading(true);

      const res = await fetch('/api/salary', {
        cache: 'no-store',
      });

      const data = await res.json();
      setSalary(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  // FILTER
  const filteredSalaries = salarys.filter((s) => {
    const matchesSearch =
      s.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      s.month === selectedMonth && s.year === selectedYear;

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredSalaries.length / itemsPerPage);

  const paginatedSalaries = filteredSalaries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // MONTHS
  const months = [
    { value: '1', label: 'Jan' },
    { value: '2', label: 'Feb' },
    { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' },
    { value: '5', label: 'May' },
    { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' },
    { value: '8', label: 'Aug' },
    { value: '9', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
  ];

  const years = Array.from(new Set(salarys.map((s) => s.year)));

  // 🔥 PRINT FUNCTION
  const handlePrint = () => {
    const monthLabel = months.find((m) => m.value === selectedMonth)?.label;

    const printContent = `
      <html>
        <head>
          <title>Salary Report</title>
          <style>
            body {
              font-family: Arial;
              padding: 20px;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            th {
              background: #eee;
            }
            .box {
              width: 40px;
              height: 25px;
              border: 1px solid black;
              margin: auto;
            }
          </style>
        </head>
        <body>
          <h2>Salary Report - ${monthLabel} ${selectedYear}</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Total Salary</th>
                <th>Advance</th>
                <th>Payable</th>
                <th>Account No.</th>
                <th>Bank Name</th>
                <th>Paid</th>
              </tr>
            </thead>

            <tbody>
              ${filteredSalaries
        .map(
          (s) => `
                <tr>
                  <td>${s.employee_id}</td>
                  <td>${s.employee_name}</td>
                  <td>₹${s.total_salary}</td>
                  <td>₹${(s.total_advance - s.previous_balance) ?? 0}</td>
                  <td>₹${s.final_payable}</td>
                  <td>${s.account_number}</td>
                  <td>${s.bank_name}</td>
                  <td><div class="box"></div></td>
                </tr>
              `
        )
        .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const win = window.open('', '', 'width=900,height=700');
    win?.document.write(printContent);
    win?.document.close();
    win?.print();
  };

  if (employeesLoading) {
    return (
      <div className="h-full absolute inset-0 flex items-center justify-center backdrop-blur-sm z-0">
        <div className="flex flex-col items-center gap-3 pl-56">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-primary">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* 🔥 FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white p-3 sm:p-4 rounded-xl shadow-md gap-3">

        {/* LEFT: MONTH + YEAR */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

        </div>

        {/* CENTER: SEARCH (FULL WIDTH) */}
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* RIGHT: PRINT BUTTON */}
        <div className="w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto bg-primary text-white px-5 py-2 rounded-lg active:scale-95 sm:hover:scale-105 transition"
          >
            Print
          </button>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <th className="px-6 py-4 text-center text-sm font-semibold">ID</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Employee</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Total Salary</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Advance</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Payable</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Account No.</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Bank Name</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedSalaries.map((salary, index) => (
                <tr
                  key={salary.employee_id}
                  className="hover:bg-gray-50 transition-colors duration-200 text-center"
                >
                  <td className="px-6 py-4">{salary.employee_id}</td>

                  <td className="px-6 py-4 font-medium">
                    {salary.employee_name}
                  </td>

                  <td className="px-6 py-4">
                    ₹{salary.total_salary}
                  </td>

                  <td className="px-6 py-4 text-red-600">
                    ₹{(salary.total_advance - salary.previous_balance) ?? 0}
                  </td>

                  <td className="px-6 py-4 font-bold text-primary">
                    ₹{salary.final_payable}
                  </td>

                  <td className="px-6 py-4">
                    {salary.account_number}
                  </td>

                  <td className="px-6 py-4">
                    {salary.bank_name}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY */}
          {filteredSalaries.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No salary data for selected month/year
            </div>
          )}

          <div className="flex justify-between items-center px-4 py-3">

            {/* LEFT */}
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>

            {/* RIGHT */}
            <div className="flex gap-2 flex-wrap">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1
                    ? 'bg-primary text-white'
                    : ''
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}