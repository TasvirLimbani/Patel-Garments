// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { Salary } from '@/lib/mockData';

// export function SalaryPage() {
//   const { user } = useAuth();

//   const today = new Date();
//   const currentMonth = String(today.getMonth() + 1); // 1-12
//   const currentYear = String(today.getFullYear());

//   const [salarys, setSalary] = useState<Salary[]>([]);

//   // 🔥 NEW STATES
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   // FETCH
//   const fetchSalaries = async () => {
//     const res = await fetch('/api/salary', {
//       cache: 'no-store',
//     });

//     const data = await res.json();
//     setSalary(data.data);
//   };

//   useEffect(() => {
//     fetchSalaries();
//   }, []);

//   // 🔥 FILTER LOGIC
//   const filteredSalaries = salarys.filter((s) => {
//     return s.month === selectedMonth && s.year === selectedYear;
//   });

//   // 🔥 MONTH OPTIONS
//   const months = [
//     { value: '1', label: 'Jan' },
//     { value: '2', label: 'Feb' },
//     { value: '3', label: 'Mar' },
//     { value: '4', label: 'Apr' },
//     { value: '5', label: 'May' },
//     { value: '6', label: 'Jun' },
//     { value: '7', label: 'Jul' },
//     { value: '8', label: 'Aug' },
//     { value: '9', label: 'Sep' },
//     { value: '10', label: 'Oct' },
//     { value: '11', label: 'Nov' },
//     { value: '12', label: 'Dec' },
//   ];

//   // 🔥 YEAR OPTIONS (dynamic from data)
//   const years = Array.from(new Set(salarys.map((s) => s.year)));

//   return (
//     <div className="space-y-6 animate-fade-in">

//       {/* 🔥 FILTER BAR */}
//       <div className="flex gap-4 bg-white p-4 rounded-xl shadow-md">

//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="px-4 py-2 border rounded-lg"
//         >
//           {months.map((m) => (
//             <option key={m.value} value={m.value}>
//               {m.label}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//           className="px-4 py-2 border rounded-lg"
//         >
//           {years.map((y) => (
//             <option key={y} value={y}>
//               {y}
//             </option>
//           ))}
//         </select>

//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-primary to-primary/80 text-white">
//                 <th className="px-6 py-4 text-center text-sm font-semibold">Employee</th>
//                 <th className="px-6 py-4 text-center text-sm font-semibold">Month</th>
//                 <th className="px-6 py-4 text-center text-sm font-semibold">Pieces</th>
//                 <th className="px-6 py-4 text-center text-sm font-semibold">Total Salary</th>
//                 <th className="px-6 py-4 text-center text-sm font-semibold">Advance</th>
//                 <th className="px-6 py-4 text-center text-sm font-semibold">Net Salary</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {filteredSalaries.map((salary, index) => (
//                 <tr
//                   key={salary.employee_id}
//                   className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in text-center"
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                       {salary.employee_name}
//                   </td>

//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {salary.month}/{salary.year}
//                   </td>

//                   <td className="px-6 py-4 text-sm">
//                     {salary.total_piece}
//                   </td>

//                   <td className="px-6 py-4 text-sm ">
//                     ₹{salary.total_salary}
//                   </td>

//                   <td className="px-6 py-4 text-sm text-red-600">
//                     ₹{salary.total_advance}
//                   </td>

//                   <td className="px-6 py-4 text-sm font-bold text-primary">
//                     ₹{salary.payable}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* 🔥 EMPTY STATE */}
//           {filteredSalaries.length === 0 && (
//             <div className="p-6 text-center text-gray-500">
//               No salary data for selected month/year
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


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

  // FETCH
  const fetchSalaries = async () => {
    const res = await fetch('/api/salary', {
      cache: 'no-store',
    });

    const data = await res.json();
    setSalary(data.data);
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  // FILTER
  const filteredSalaries = salarys.filter((s) => {
    return s.month === selectedMonth && s.year === selectedYear;
  });

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
                <th>Pieces</th>
                <th>Total Salary</th>
                <th>Advance</th>
                <th>Payable</th>
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
                  <td>${s.total_piece}</td>
                  <td>₹${s.total_salary}</td>
                  <td>₹${s.total_advance}</td>
                  <td>₹${s.payable}</td>
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

  return (
    <div className="space-y-6 animate-fade-in">

      {/* 🔥 FILTER BAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md">

        <div className="flex gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg"
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
            className="px-4 py-2 border rounded-lg"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* 🔥 PRINT BUTTON */}
        <button
          onClick={handlePrint}
          className="bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90"
        >
          Print
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <th className="px-6 py-4 text-center text-sm font-semibold">ID</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Employee</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Pieces</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Total Salary</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Advance</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Payable</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredSalaries.map((salary, index) => (
                <tr
                  key={salary.employee_id}
                  className="hover:bg-gray-50 transition-colors duration-200 text-center"
                >
                  <td className="px-6 py-4">{salary.employee_id}</td>

                  <td className="px-6 py-4 font-medium">
                    {salary.employee_name}
                  </td>

                  <td className="px-6 py-4">
                    {salary.total_piece}
                  </td>

                  <td className="px-6 py-4">
                    ₹{salary.total_salary}
                  </td>

                  <td className="px-6 py-4 text-red-600">
                    ₹{salary.total_advance}
                  </td>

                  <td className="px-6 py-4 font-bold text-primary">
                    ₹{salary.payable}
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
        </div>
      </div>
    </div>
  );
}