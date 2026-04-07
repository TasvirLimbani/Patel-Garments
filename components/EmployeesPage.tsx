'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
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
];

export function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    operation: '',
    employee_number: '',
    account_number: '',
    old_employee_id: '',
  });

  // FETCH
  const fetchEmployees = async () => {
    const res = await fetch('/api/employee', {
      cache: 'no-store',
    });

    const data = await res.json();

    if (data.success) {
      setEmployees(data.employees); // ✅ FIXED
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
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
      old_employee_id: emp.id, // 👈 IMPORTANT
    });

    setShowModal(true);
  };

  // DELETE
  const handleDelete = async (emp: any) => {
    if (!confirm('Are you sure you want to delete?')) return;

    try {
      await fetch(`/api/employee/delete?employee_number=${emp.employee_number}`, {
        method: 'DELETE',
      });

      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch {
      toast.error('Delete failed');
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      const isEdit = !!editData;

      const url = isEdit
        ? '/api/employee/edit'
        : '/api/employee/add';

      const payload = isEdit
        ? {
          name: form.name,
          operation: form.operation,
          employee_number: form.employee_number,
          old_employee_id: form.old_employee_id, // 👈 MUST SEND
          account_number: form.account_number,
        }
        : {
          name: form.name,
          operation: form.operation,
          employee_number: form.employee_number,
          account_number: form.account_number,
        };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json(); // 👈 DEBUG

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed');
      }

      toast.success(isEdit ? 'Employee updated' : 'Employee added');

      setShowModal(false);
      fetchEmployees();
    } catch (err: any) {
      console.log(err); // 👈 DEBUG
      toast.error(err.message || 'Something went wrong');
    }
  };

  const filteredEmployees = employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employee..."
            className="w-full pl-12 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-primary"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={handleAdd}
          className="ml-4 px-6 py-3 bg-primary text-white rounded-xl shadow hover:scale-105 transition"
        >
          + Add Employee
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-visible">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-4">Name</th>
              <th>Operation</th>
              <th>Employee ID</th>
              <th>Account</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp: any) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{emp.name}</td>
                <td>{emp.operation}</td>
                <td>{emp.employee_number}</td>
                <td>{emp.account_number}</td>
                <td className="p-4 text-center relative">
                  <div className="inline-block text-left">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === emp.id ? null : emp.id);
                      }}
                    >
                      ⋮
                    </button>

                    {openMenu === emp.id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">

                        <button
                          onClick={() => {
                            handleEdit(emp);
                            setOpenMenu(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          ✏️ Edit
                        </button>

                        <div className="border-t"></div>

                        <button
                          onClick={() => {
                            handleDelete(emp);
                            setOpenMenu(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                        >
                          🗑 Delete
                        </button>

                      </div>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">

            {/* HEADER (GRADIENT) */}
            <div className="bg-gradient-to-r from-[#00885a] to-[#00a86b] px-6 py-4">
              <h2 className="text-white text-lg font-semibold">
                {editData ? 'Edit Employee' : 'Add Employee'}
              </h2>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-4">

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-600">Employee Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00885a]"
                />
              </div>

              {/* OPERATION */}
              <div>
                <label className="text-sm text-gray-600">Operation</label>
                <select
                  value={form.operation}
                  onChange={(e) => setForm({ ...form, operation: e.target.value })}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00885a]"
                >
                  <option value="">Select Operation</option>
                  {operations.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {/* EMP NUMBER */}
              <div>
                <label className="text-sm text-gray-600">Employee Number</label>
                <input
                  value={form.employee_number}
                  onChange={(e) =>
                    setForm({ ...form, employee_number: e.target.value })
                  }
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg"
                />
              </div>

              {/* ACCOUNT */}
              <div>
                <label className="text-sm text-gray-600">Account Number</label>
                <input
                  value={form.account_number}
                  onChange={(e) =>
                    setForm({ ...form, account_number: e.target.value })
                  }
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg"
                />
              </div>

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg text-white font-medium shadow-md transition hover:scale-[1.03]"
                style={{
                  background: 'linear-gradient(135deg, #00885a, #00a86b)',
                }}
              >
                {editData ? 'Update' : 'Add'}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}