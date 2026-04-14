'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const operations = [
  'Collar Making',
  'Cuff Making',
  'Front',
  'Lable',
  'Sleve Patti',
  'Half Dab',
  'Collar Att',
  'Cuff Attaching',
  'Side Munda',
  'Side Pocket',
  'Bottom',
  'Gaj Button',
  'Press',
];

export function EntriesPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 UPDATED STATES
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const [deleteEntry, setDeleteEntry] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    employee_name: '',
    employee_id: '',
    operation: '',
    design_no: '',
    colour_no: '',
    piece: '',
    rate: '',
  });

  const fetchEntries = async () => {
    const res = await fetch('/api/entries');
    const data = await res.json();
    if (data.status === 'success') setEntries(data.data);
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employee');
      const data = await res.json();

      if (data.success) {
        setEmployeeList(data.employees);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchEmployees();
  }, []);

  // 🔥 UPDATED FILTER LOGIC
  const filteredEntries = entries.filter((entry) => {
    // 🔍 search filter
    const matchesSearch =
      entry.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.design_no?.toLowerCase().includes(searchTerm.toLowerCase());

    // 📅 date filter
    let matchesDate = false;

    if (startDate && endDate) {
      matchesDate = entry.date >= startDate && entry.date <= endDate;
    } else {
      matchesDate = entry.date === startDate;
    }

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEmployeeSearch = (value: string) => {
    setForm({ ...form, employee_id: value }); // ✅ correct

    setActiveIndex(-1);

    if (!value) {
      setShowEmployeeDropdown(false);
      return;
    }

    const filtered = employeeList.filter((emp) =>
      emp.employee_number.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEmployees(filtered);
    setShowEmployeeDropdown(true);
  };

  const handleSubmit = async () => {
    const url = editData
      ? `/api/entries/${editData.id}`
      : '/api/entries';

    const method = editData ? 'PUT' : 'POST';

    const body = editData ? { ...form, id: editData.id } : form;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.status === 'error') {
        toast.error(`${data.message}`);
        return;
      }

      toast.success(editData ? 'Entry updated successfully' : 'Entry added successfully');

      setShowModal(false);
      setEditData(null);
      fetchEntries();

    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleEdit = (entry: any) => {
    setEditData(entry);
    setForm({
      date: entry.date,
      employee_name: entry.employee_name,
      employee_id: entry.employee_id,
      operation: entry.operation,
      design_no: entry.design_no,
      colour_no: entry.colour_no,
      piece: entry.piece,
      rate: entry.rate,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteEntry) return;

    try {
      await fetch(`/api/entries/${deleteEntry.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteEntry.id }),
      });

      setShowDeleteModal(false);
      setDeleteEntry(null);

      fetchEntries();

    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showEmployeeDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const newIndex = prev < filteredEmployees.length - 1 ? prev + 1 : 0;
        setTimeout(() => {
          const element = document.getElementById(`employee-option-${newIndex}`);
          element?.scrollIntoView({ block: 'nearest' });
        }, 0);
        return newIndex;
      });
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const newIndex = prev > 0 ? prev - 1 : filteredEmployees.length - 1;
        setTimeout(() => {
          const element = document.getElementById(`employee-option-${newIndex}`);
          element?.scrollIntoView({ block: 'nearest' });
        }, 0);
        return newIndex;
      });
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        const emp = filteredEmployees[activeIndex];

        setForm({
          ...form,
          employee_name: emp.name,
          employee_id: emp.employee_number,
          operation: emp.operation,
        });

        setShowEmployeeDropdown(false);
        setActiveIndex(-1);
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setShowEmployeeDropdown(false);
      setActiveIndex(-1);
    }
  };

  if (loading) return (
    <div className="h-full absolute inset-0 flex items-center justify-center backdrop-blur-sm z-0">
      <div className="flex flex-col items-center gap-3 pl-56">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-primary">Loading data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* 🔥 UPDATED TOP BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white p-3 sm:p-4 rounded-xl shadow-md gap-3">

        {/* LEFT: DATE FILTERS */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <span className="text-sm whitespace-nowrap">to</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* CENTER: SEARCH (TAKES FULL SPACE) */}
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* RIGHT: BUTTON */}
        <div className="w-full sm:w-auto">
          <button
            onClick={() => {
              setForm({
                date: new Date().toISOString().split('T')[0],
                employee_name: '',
                employee_id: '',
                operation: '',
                design_no: '',
                colour_no: '',
                piece: '',
                rate: '',
              });
              setEditData(null);
              setShowModal(true);
              setShowEmployeeDropdown(false);
            }}
            className="w-full sm:w-auto px-5 py-2 text-white rounded-lg whitespace-nowrap active:scale-95 sm:hover:scale-105 transition"
            style={{ background: 'linear-gradient(135deg,#00885a,#00a86b)' }}
          >
            + Add Entry
          </button>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-xs sm:text-sm text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-2 sm:p-4">Date</th>
                <th className="p-2 sm:p-4">ID</th>
                <th className="p-2 sm:p-4">Employee</th>
                <th className="p-2 sm:p-4">Operation</th>

                {/* Hide less important on mobile */}
                <th className="p-2 sm:p-4 hidden sm:table-cell">Design</th>
                <th className="p-2 sm:p-4 hidden sm:table-cell">Colour</th>

                <th className="p-2 sm:p-4">Piece</th>
                <th className="p-2 sm:p-4">Rate</th>
                <th className="p-2 sm:p-4">Total</th>
                <th className="p-2 sm:p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEntries.map((entry) => (
                <tr key={entry.id} className="border-t text-center">
                  <td className="p-2 sm:p-4 whitespace-nowrap">{entry.date}</td>

                  <td className="p-2 sm:p-4">{entry.employee_id}</td>

                  <td className="p-2 sm:p-4 truncate max-w-[120px] sm:max-w-none">
                    {entry.employee_name}
                  </td>

                  <td className="p-2 sm:p-4">{entry.operation}</td>

                  {/* Hidden on mobile */}
                  <td className="p-2 sm:p-4 hidden sm:table-cell">{entry.design_no}</td>
                  <td className="p-2 sm:p-4 hidden sm:table-cell">{entry.colour_no ?? "-"}</td>

                  <td className="p-2 sm:p-4">{entry.piece}</td>
                  <td className="p-2 sm:p-4">₹{entry.rate}</td>

                  <td className="p-2 sm:p-4 font-bold whitespace-nowrap">
                    ₹{entry.total}
                  </td>

                  {/* ACTION */}
                  <td className="p-2 sm:p-4 flex justify-center align-middle relative">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === Number(entry.id) ? null : Number(entry.id))
                      }
                      className="text-lg"
                    >
                      ⋮
                    </button>

                    {openMenu === Number(entry.id) && (
                      <div className="absolute right-2 mt-7 w-36 bg-white border rounded-lg shadow-lg z-1">
                        <button
                          onClick={() => {
                            handleEdit(entry);
                            setOpenMenu(null);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => {
                            setDeleteEntry(entry);
                            setShowDeleteModal(true);
                            setOpenMenu(null); // close dropdown
                          }}
                          className="block w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        <div className="flex justify-between items-center px-4 py-3">

          {/* LEFT: INFO */}
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>

          {/* RIGHT: BUTTONS */}
          <div className="flex gap-2">

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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>
        </div>
        </div>
      </div>

      {/* MODAL (UNCHANGED) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">

            <div className="bg-gradient-to-r from-[#00885a] to-[#00a86b] px-6 py-4 text-white">
              {editData ? 'Edit Entry' : 'Add Entry'}
            </div>

            <div className="p-6 space-y-4">

              <input type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border p-2 rounded" />

              <div className="relative">
                <input
                  // placeholder="Employee Name"
                  // value={form.employee_name}
                  placeholder="Employee ID"
                  value={form.employee_id}
                  onChange={(e) => handleEmployeeSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => form.employee_id && setShowEmployeeDropdown(true)}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  autoComplete="off"
                />

                {showEmployeeDropdown && filteredEmployees.length > 0 && (
                  <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-50 top-full left-0">
                    {filteredEmployees.map((emp, index) => (
                      <div
                        id={`employee-option-${index}`}
                        key={emp.id}
                        onClick={() => {
                          setForm({
                            ...form,
                            employee_name: emp.name,
                            employee_id: emp.employee_number,
                            operation: emp.operation,
                          });
                          setShowEmployeeDropdown(false);
                          setActiveIndex(-1);
                        }}
                        className={`px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors ${index === activeIndex
                          ? 'bg-green-500 text-white font-medium'
                          : 'hover:bg-gray-100'
                          }`}
                      >
                        <div className="font-semibold">{emp.name}</div>
                        <div className="text-xs opacity-75">
                          ID: {emp.employee_number} | Op: {emp.operation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                // placeholder="Employee ID"
                // value={form.employee_id}
                placeholder="Employee Name"
                value={form.employee_name}
                className="w-full border p-2 rounded" readOnly />

              <select
                value={form.operation}
                onChange={(e) => setForm({ ...form, operation: e.target.value, colour_no: e.target.value === "Press" ? '-' : '' })}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Operation</option>

                {operations.map((op, index) => (
                  <option key={index} value={op}>
                    {op}
                  </option>
                ))}
              </select>

              <input placeholder="Design No" value={form.design_no}
                onChange={(e) => setForm({ ...form, design_no: e.target.value })}
                className="w-full border p-2 rounded" />

              {
                form.operation !== "Press" ? <input placeholder="Colour No" value={form.colour_no}
                  onChange={(e) => setForm({ ...form, colour_no: e.target.value })}
                  className="w-full border p-2 rounded" />
                  : null
              }
              <input type="number" placeholder="Piece" value={form.piece}
                onChange={(e) => setForm({ ...form, piece: e.target.value })}
                className="w-full border p-2 rounded" />

              <input type="number" placeholder="Rate" value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
                className="w-full border p-2 rounded" />

            </div>

            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-white rounded"
                style={{ background: '#00885a' }}
              >
                {editData ? 'Update' : 'Add'}
              </button>
            </div>

          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 text-center">

            <h2 className="text-lg font-semibold text-gray-800">
              Delete Entry?
            </h2>

            <p className="text-sm text-gray-500">
              Are you sure you want to delete this entry?
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteEntry(null);
                }}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}