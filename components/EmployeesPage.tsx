'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
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
  'Press',
  'Gaj Button',
  'Shoulder',
  'Sample',
  'Alter',
];

export function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  const [deleteEmployee, setDeleteEmployee] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const getCurrentMonth = () => {
    const d = new Date();
    return d.toISOString().slice(0, 7); // "YYYY-MM"
  };

  const START_YEAR = 2026;
  const START_MONTH = 3;

  const getCurrent = () => {
    const d = new Date();
    return {
      month: String(d.getMonth() + 1).padStart(2, '0'),
      year: String(d.getFullYear()),
    };
  };

  const current = getCurrent();

  const [selectedMonth, setSelectedMonth] = useState(current.month);
  const [selectedYear, setSelectedYear] = useState(current.year);

  const [form, setForm] = useState({
    name: '',
    operation: '',
    employee_number: '',
    account_number: '',
    bank_name: '',
    old_employee_id: '',
  });

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let y = START_YEAR; y <= currentYear; y++) {
      years.push(String(y));
    }

    return years.reverse();
  };

  const getMonths = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let start = 1;
    let end = 12;

    if (Number(selectedYear) === START_YEAR) {
      start = START_MONTH;
    }

    if (Number(selectedYear) === currentYear) {
      end = currentMonth;
    }

    const allMonths = [
      { label: 'Jan', value: '01' },
      { label: 'Feb', value: '02' },
      { label: 'Mar', value: '03' },
      { label: 'Apr', value: '04' },
      { label: 'May', value: '05' },
      { label: 'Jun', value: '06' },
      { label: 'Jul', value: '07' },
      { label: 'Aug', value: '08' },
      { label: 'Sep', value: '09' },
      { label: 'Oct', value: '10' },
      { label: 'Nov', value: '11' },
      { label: 'Dec', value: '12' },
    ];

    return allMonths.slice(start - 1, end);
  };

  useEffect(() => {
    if (selectedEmployee) {
      const monthYear = `${selectedYear}-${selectedMonth}`;
      fetchDetail(selectedEmployee.employee_number, monthYear);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const validMonths = getMonths();

    const exists = validMonths.find(m => m.value === selectedMonth);

    if (!exists && validMonths.length > 0) {
      setSelectedMonth(validMonths[0].value);
    }
  }, [selectedYear]);

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    const res = await fetch('/api/employee', { cache: 'no-store' });
    const data = await res.json();
    if (data.success) setEmployees(data.employees);
    setEmployeesLoading(false);
  };

  // FETCH DETAIL
  const fetchDetail = async (employee_number: string, month?: string) => {
    setLoading(true);

    const res = await fetch('/api/employee/detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_number,
        month_year: month || selectedMonth, // ✅ important
      }),
    });

    const data = await res.json();

    if (data.status) {
      setDetail(data.data);
    } else {
      toast.error('Failed to fetch detail');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Only close if click is NOT inside dropdown
      if (!target.closest('.dropdown-menu')) {
        setOpenMenu(null);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // ADD
  const handleAdd = () => {
    setEditData(null);
    setForm({
      name: '',
      operation: '',
      employee_number: '',
      account_number: '',
      bank_name: '',
      old_employee_id: '',
    });
    setShowModal(true);
  };

  // EDIT
  const handleEdit = (emp: any) => {
    setEditData(emp);
    setForm({
      name: emp.name,
      operation: emp.operation,
      employee_number: emp.employee_number,
      account_number: emp.account_number,
      bank_name: emp.bank_name,
      old_employee_id: emp.id,
    });
    setShowModal(true);
  };

  // DELETE
  const handleDelete = async () => {
    if (!deleteEmployee) return;

    try {
      await fetch(
        `/api/employee/delete?employee_number=${deleteEmployee.employee_number}`,
        {
          method: 'DELETE',
        }
      );

      toast.success('Deleted successfully');

      setShowDeleteModal(false);
      setDeleteEmployee(null);

      fetchEmployees();

    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    const isEdit = !!editData;

    const url = isEdit ? '/api/employee/edit' : '/api/employee/add';

    const payload = isEdit
      ? { ...form }
      : { ...form };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(isEdit ? 'Updated' : 'Added');
    setShowModal(false);
    fetchEmployees();
  };

  const filteredEmployees = employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.employee_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      {/* ================= LIST VIEW ================= */}
      {!selectedEmployee && (
        <>
          {/* TOP BAR */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                placeholder="Search employee..."
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleAdd}
              className="px-5 py-2 bg-primary text-white rounded-lg"
            >
              + Add
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm sm:text-base text-center">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className='p-4'>ID</th>
                    <th>Name</th>
                    <th>Operation</th>
                    <th>Account</th>
                    <th>Bank</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedEmployees.map((emp: any) => (
                    <tr
                      key={emp.id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        const current = getCurrent();

                        setSelectedMonth(current.month);
                        setSelectedYear(current.year);
                        setSelectedEmployee(emp);

                        const monthYear = `${current.year}-${current.month}`;
                        fetchDetail(emp.employee_number, monthYear);
                      }}
                    >
                      <td>{emp.employee_number}</td>
                      <td className="p-4">{emp.name}</td>
                      <td>{emp.operation}</td>
                      <td>{emp.account_number}</td>
                      <td>{emp.bank_name}</td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="flex justify-center align-middle p-4 "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === emp.id ? null : emp.id);
                          }}
                          hitslop
                        >
                          ⋮
                        </button>

                        {openMenu === emp.id && (
                          <div className="dropdown-menu absolute right-2 mt-8 w-40 bg-white border rounded-lg shadow">

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(emp);
                                setOpenMenu(null);
                              }}
                              className="block w-full p-2 hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteEmployee(emp);
                                setShowDeleteModal(true);
                                setOpenMenu(null);
                              }}
                              className="block w-full p-2 text-red-500 hover:bg-red-50"
                            >
                              Delete
                            </button>

                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center px-4 py-3">

                {/* LEFT */}
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>

                {/* RIGHT */}
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
        </>
      )}

      {/* ================= DETAIL VIEW ================= */}
      {selectedEmployee && (
        <div className="space-y-6">

          {/* ================= HEADER ================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow">

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setDetail(null);
                }}
                className="px-2 py-2 bg-primary text-white rounded-4xl hover:bg-primary/80 transition"
              >
                <ChevronLeft />
              </button>

              <h2 className="text-xl font-semibold">
                Employee Details
              </h2>
            </div>

            {/* RIGHT FILTERS */}
            <div className="flex gap-3">

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-gray-50 hover:bg-white"
              >
                {getMonths().map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-gray-50 hover:bg-white"
              >
                {getYears().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

            </div>
          </div>


          <div className="flex"> {/* IMPORTANT */}
            {loading && (
              <div className="h-full absolute inset-0 flex items-center justify-center backdrop-blur-sm z-0">
                <div className="flex flex-col items-center gap-3 pl-56">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-primary">Loading data...</p>
                </div>
              </div>
            )}

            {/* Your page content */}
          </div>

          {detail && (
            <>
              {/* ================= EMPLOYEE CARDS ================= */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-lg">{detail.employee.name}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Operation</p>
                  <p className="font-medium">{detail.employee.operation}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="font-medium">{detail.employee.employee_number}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Account</p>
                  <p className="font-medium">{detail.employee.account_number}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Bank</p>
                  <p className="font-medium">{detail.employee.bank_name}</p>
                </div>

                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-xl shadow">
                  <p className="text-xs">Month</p>
                  <p className="font-semibold text-lg">{detail.month_year}</p>
                </div>

              </div>

              {/* ================= TOTAL ================= */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow flex justify-between items-center">
                <p className="text-lg font-medium">Total Salary</p>
                <p className="text-3xl font-bold">
                  ₹{Number(detail.total_amount).toFixed(2)}
                </p>
              </div>

              {/* ================= TABLE ================= */}
              <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-4 border-b font-semibold">
                  Entries
                </div>

                <table className="w-full text-sm text-center">

                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3">Date</th>
                      <th>Operation</th>
                      <th>Design</th>
                      <th>Colour</th>
                      <th>Piece</th>
                      <th>Rate</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {detail.entries.map((e: any) => (
                      <tr key={e.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{e.date}</td>
                        <td>{e.operation}</td>
                        <td>{e.design_no}</td>
                        <td>{e.colour_no}</td>
                        <td>{e.piece}</td>
                        <td>₹{Number(e.rate).toFixed(2)}</td>
                        <td className="font-semibold text-green-600">
                          ₹{Number(e.total).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </>
          )}

        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="font-bold">
              {editData ? 'Edit Employee' : 'Add Employee'}
            </h2>

            <input placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded" />

            <select value={form.operation}
              onChange={(e) => setForm({ ...form, operation: e.target.value })}
              className="w-full border p-2 rounded">
              <option>Select Operation</option>
              {operations.map(op => <option key={op}>{op}</option>)}
            </select>

            <input placeholder="Employee No"
              value={form.employee_number}
              onChange={(e) => setForm({ ...form, employee_number: e.target.value })}
              className="w-full border p-2 rounded" />

            <input placeholder="Account"
              value={form.account_number}
              onChange={(e) => setForm({ ...form, account_number: e.target.value })}
              className="w-full border p-2 rounded" />

            <input placeholder="Bank"
              value={form.bank_name}
              onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
              className="w-full border p-2 rounded" />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSubmit} className="bg-primary text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 text-center">

            <h2 className="text-lg font-semibold text-gray-800">
              Delete Employee?
            </h2>

            <p className="text-sm text-gray-500">
              Are you sure you want to delete employee{" "}
              <span className="font-semibold text-primary">
                {deleteEmployee?.employee_number}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteEmployee(null);
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