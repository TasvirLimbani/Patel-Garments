'use client';

import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DesignPage = () => {
  const [list, setList] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 DATE DEFAULT
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1);
  const currentYear = String(today.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [searchTerm, setSearchTerm] = useState('');


  // 👉 FETCH LIST
  const fetchList = async () => {
    setLoading(true);
    const res = await fetch('/api/design', { cache: 'no-store' });
    const data = await res.json();

    if (data.status) {
      setList(data.data);
    }
    setLoading(false);
  };

  // 👉 FETCH DETAIL
  const fetchDetail = async (design_no) => {
    setLoading(true);

    const res = await fetch('/api/design/detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ design_no }),
    });

    const data = await res.json();

    if (data.status) {
      setDetail(data.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredList = list.filter((item) => {
    // 🔍 search by design no
    const matchesSearch = item.design_no
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 📅 month/year filter
    const d = new Date(item.first_entry_date);

    const matchesDate =
      String(d.getMonth() + 1) === selectedMonth &&
      String(d.getFullYear()) === selectedYear;

    return matchesSearch && matchesDate;
  });

  // 🔥 MONTHS
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

  const years = [
    ...new Set(
      list.map((item) =>
        String(new Date(item.first_entry_date).getFullYear())
      )
    ),
  ];

  // 🔥 PER PIECE PRICE (unique operation rate sum)
  const perPiecePrice = detail?.entries
    ? Object.values(
      detail.entries.reduce((acc, item) => {
        if (!acc[item.operation]) {
          acc[item.operation] = parseFloat(item.rate);
        }
        return acc;
      }, {})
    ).reduce((sum, rate) => sum + rate, 0)
    : 0;

        if (loading) {
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
    <div className="p-6 pt-0 space-y-6 animate-fade-in">

      {/* ================= LIST VIEW ================= */}
      {!selectedDesign && (
        <>
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

            {/* RIGHT: SEARCH (TAKES REMAINING SPACE) */}
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search Design No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

          </div>

          {/* 🔥 TABLE */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">

                <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Design No</th>
                    <th className="px-6 py-4">Total Piece</th>
                    <th className="px-6 py-4">Avg Rate</th>
                    <th className="px-6 py-4">Total Cost</th>
                    {/* <th className="px-6 py-4">Actions</th> */}
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredList.map((item, i) => (
                    <tr
                      key={i}
                      onClick={() => {
                        setSelectedDesign(item.design_no);
                        fetchDetail(item.design_no);
                      }}
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4">{item.first_entry_date}</td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {item.design_no}
                      </td>
                      <td className="px-6 py-4">{item.total_piece}</td>
                      <td className="px-6 py-4">₹{item.avg_rate}</td>
                      <td className="px-6 py-4 font-bold">
                        ₹{item.total_cost}
                      </td>
                      
                    </tr>
                  ))}

                </tbody>
              </table>

              {/* EMPTY */}
              {filteredList.length === 0 && !loading && (
                <div className="p-6 text-center text-gray-500">
                  No designs for selected month/year
                </div>
              )}

              {loading && (
                <div className="p-6 text-center">Loading...</div>
              )}

            </div>
          </div>
        </>
      )}

      {/* ================= DETAIL VIEW ================= */}
      {selectedDesign && detail && (
        <div className="space-y-6">

          {/* 🔙 BACK */}
          <button
            onClick={() => {
              setSelectedDesign(null);
              setDetail(null);
            }}
            className="px-2 py-2 bg-primary text-white rounded-4xl hover:bg-primary/80 transition"
          >
            <ChevronLeft />
          </button>

          {/* 🔥 SUMMARY CARDS */}
          <div className="grid md:grid-cols-4 gap-4">

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Design No</p>
              <p className="text-xl font-bold text-primary">
                {detail.design_no}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Total Entries</p>
              <p className="text-xl font-bold">
                {detail.total_entries}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Grand Total</p>
              <p className="text-xl font-bold text-green-600">
                ₹{detail.grand_total}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Per piece price</p>
              <p className="text-xl font-bold text-blue-600">
                ₹{perPiecePrice}
              </p>
            </div>

          </div>

          {/* 🔥 ENTRIES TABLE */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">

              <table className="w-full text-sm text-center">

                <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                  <tr>
                    {/* <th className="px-6 py-4">Date</th> */}
                    {/* <th className="px-6 py-4">Employee</th> */}
                    <th className="px-6 py-4">Operation</th>
                    <th className="px-6 py-4">Piece</th>
                    <th className="px-6 py-4">Rate</th>
                    <th className="px-6 py-4">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {detail.entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      {/* <td className="px-6 py-4">{entry.date}</td>
                      <td className="px-6 py-4 font-medium">
                        {entry.employee_name}
                      </td> */}
                      <td className="px-6 py-4">{entry.operation}</td>
                      <td className="px-6 py-4">{entry.piece}</td>
                      <td className="px-6 py-4">₹{entry.rate}</td>
                      <td className="px-6 py-4 font-semibold">
                        ₹{entry.total}
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DesignPage;