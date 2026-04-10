'use client';

import React, { useEffect, useState } from 'react';

interface Advance {
  id: number;
  date: string;
  employee_name: string;
  amount: number;
  employee_id?: number;
  reason?: string;
}

export function AdvancesPage() {
  const [data, setData] = useState<Advance[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Advance | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // 🔥 UPDATED STATES
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState('');

  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(-1);

  const [deleteAdvance, setDeleteAdvance] = useState<Advance | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState({
    date: today,
    employee_name: '',
    employee_id: '',
    amount: '',
    reason: '',
  });

  const fetchData = async () => {
    const res = await fetch('/api/advance');
    const json = await res.json();
    setData(json.data || []);
  };

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true); // start loading

      const res = await fetch('/api/employee');
      const data = await res.json();

      if (data.success) {
        setEmployeeList(data.employees);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEmployeesLoading(false); // stop loading (runs always)
    }
  };

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  // 🔥 UPDATED FILTER
  const filteredData = data.filter((d) => {
    if (startDate && endDate) {
      return d.date >= startDate && d.date <= endDate;
    }
    return d.date === startDate;
  });

  const handleEmployeeSearch = (value: string) => {
    setForm({ ...form, employee_name: value });
    setActiveIndex(-1); // 👈 important

    if (!value) {
      setShowEmployeeDropdown(false);
      return;
    }

    const filtered = employeeList.filter((emp) =>
      emp.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEmployees(filtered);
    setShowEmployeeDropdown(true);
  };

  const handleSubmit = async () => {
    const payload = {
      date: form.date,
      employee_name: form.employee_name,
      employee_id: Number(form.employee_id),
      amount: Number(form.amount),
      reason: form.reason, // ✅ NEW
      ...(editData && { id: editData.id }),
    };

    const res = await fetch(
      editData ? `/api/advance/${editData.id}` : '/api/advance',
      {
        method: editData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (result.status === 'success') {
      fetchData();
      setShowModal(false);
      setEditData(null);
      setForm({
        date: today,
        employee_name: '',
        employee_id: '',
        amount: '',
        reason: '', // ✅ NEW
      });
    }
  };

  const handleEdit = (item: Advance) => {
    setEditData(item);
    setForm({
      date: item.date,
      employee_name: item.employee_name,
      employee_id: String(item.employee_id || ''),
      amount: String(item.amount),
      reason: item.reason || '', // ✅ NEW
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteAdvance) return;

    try {
      const res = await fetch(
        `/api/advance/${deleteAdvance.id}?id=${deleteAdvance.id}`,
        {
          method: 'DELETE',
        }
      );

      const result = await res.json();

      if (result.status === 'success') {
        fetchData();
      }

      setShowDeleteModal(false);
      setDeleteAdvance(null);

    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showEmployeeDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredEmployees.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredEmployees.length - 1
      );
    }

    if (e.key === 'Enter') {
      e.preventDefault();

      if (activeIndex >= 0) {
        const emp = filteredEmployees[activeIndex];

        setForm({
          ...form,
          employee_name: emp.name,
          employee_id: emp.employee_number,
        });

        setShowEmployeeDropdown(false);
      }
    }
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
    <div className="space-y-6">

      {/* 🔥 UPDATED TOP BAR */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between bg-white p-3 sm:p-4 rounded-xl shadow-md gap-3">

        {/* DATE FILTER */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 sm:flex-none px-2 sm:px-4 py-2 text-sm sm:text-base border rounded-lg"
          />

          <span className="text-sm sm:text-base whitespace-nowrap">to</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 sm:flex-none px-2 sm:px-4 py-2 text-sm sm:text-base border rounded-lg"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={() => {
            setShowModal(true);
            setEditData(null);
            setForm({
              date: today,
              employee_name: '',
              employee_id: '',
              amount: '',
              reason: '', // ✅ NEW
            });
            setShowEmployeeDropdown(false);
          }}
          className="w-full sm:w-auto px-3 sm:px-5 py-2 text-sm sm:text-base text-white rounded-lg whitespace-nowrap active:scale-95 sm:hover:scale-105 transition"
          style={{ background: 'linear-gradient(135deg,#00885a,#00a86b)' }}
        >
          + <span>Add Advance</span>
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[500px] w-full text-xs sm:text-sm text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-2 sm:p-4">Date</th>
                <th className="p-2 sm:p-4">ID</th>
                <th className="p-2 sm:p-4">Employee</th>
                <th className="p-2 sm:p-4">Amount</th>
                <th className="p-2 sm:p-4">Reason</th>
                <th className="p-2 sm:p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((entry) => (
                  <tr key={entry.id} className="border-t text-center">

                    <td className="p-2 sm:p-4 whitespace-nowrap">
                      {entry.date}
                    </td>

                    <td className="p-2 sm:p-4 whitespace-nowrap">
                      {entry.employee_id}
                    </td>

                    <td className="p-2 sm:p-4 truncate max-w-[120px] sm:max-w-none">
                      {entry.employee_name}
                    </td>

                    <td className="p-2 sm:p-4 font-medium whitespace-nowrap">
                      ₹{entry.amount}
                    </td>

                    <td className="p-2 sm:p-4 whitespace-nowrap">
                      {entry.reason}
                    </td>

                    <td className="p-2 sm:p-4 flex justify-center align-middle">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === entry.id ? null : entry.id)
                        }
                        className="text-lg"
                      >
                        ⋮
                      </button>

                      {openMenu === entry.id && (
                        <div className="absolute right-2 mt-7 w-36 bg-white border rounded-lg shadow-lg z-50">
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
                              setDeleteAdvance(entry);
                              setShowDeleteModal(true);
                              setOpenMenu(null);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-gray-500 text-center">
                    No advance found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (UNCHANGED) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">

            <div className="bg-gradient-to-r from-[#00885a] to-[#00a86b] px-6 py-4 text-white">
              {editData ? 'Edit Advance' : 'Add Advance'}
            </div>

            <div className="p-6 space-y-4">

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="relative">
                <input
                  placeholder="Employee Name"
                  value={form.employee_name}
                  onChange={(e) =>
                    handleEmployeeSearch(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  className="w-full border p-2 rounded"
                />

                {showEmployeeDropdown && filteredEmployees.length > 0 && (
                  <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto z-50">
                    {filteredEmployees.map((emp, index) => (
                      <div
                        key={emp.id}
                        onClick={() => {
                          setForm({
                            ...form,
                            employee_name: emp.name,
                            employee_id: emp.employee_number,
                          });
                          setShowEmployeeDropdown(false);
                        }}
                        className={`px-4 py-2 cursor-pointer ${index === activeIndex ? 'bg-green-100' : 'hover:bg-gray-100'
                          }`}
                      >
                        {emp.name} ({emp.employee_number})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                placeholder="Employee ID"
                value={form.employee_id}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />

              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <select
                value={form.reason}
                onChange={(e) =>
                  setForm({ ...form, reason: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select Reason</option>
                <option value="Room Rent">Room Rent</option>
                <option value="Advance">Advance</option>
                <option value="Room Rent + Advance">Room Rent + Advance</option>
              </select>

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
              Delete Advance?
            </h2>

            <p className="text-sm text-gray-500">
              Are you sure you want to delete this advance entry?
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteAdvance(null);
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