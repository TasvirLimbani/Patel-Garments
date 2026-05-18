'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { toast } from 'sonner';



export function FixEmployeesPage() {
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
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenseEmployee, setExpenseEmployee] = useState<any>(null);
    const [expenseForm, setExpenseForm] = useState({
        date: '',
        amount: '',
        reason: '',
    });

    const [expenseEditId, setExpenseEditId] = useState<string | null>(null);
    const [showExpenseDeleteModal, setShowExpenseDeleteModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    function getPaginationRange(currentPage: number, totalPages: number) {
        const siblingCount = 1;
        const range: (number | string)[] = [];

        const left = Math.max(currentPage - siblingCount, 1);
        const right = Math.min(currentPage + siblingCount, totalPages);

        if (left > 1) range.push(1);

        if (left > 2) range.push("...");

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < totalPages - 1) range.push("...");

        if (right < totalPages) range.push(totalPages);

        return range;
    }

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
        amount: '',
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
            fetchDetail(selectedEmployee.id, selectedMonth, selectedYear);
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
        const res = await fetch('/api/fixEmployee', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setEmployees(data.employees);
        setEmployeesLoading(false);
    };

    // FETCH DETAIL
    const fetchDetail = async (id: string, month: string, year: string) => {
        setLoading(true);

        const res = await fetch(
            `/api/fixEmployee/detail?id=${encodeURIComponent(id)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}`,
            {
                method: 'GET',
                cache: 'no-store',
            }
        );

        const data = await res.json();

        if (data.status || data.success) {
            setDetail(data);
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
            amount: '',
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
            amount: String(emp.amount ?? ''),
            old_employee_id: emp.id,
        });
        setShowModal(true);
    };

    const handleAddExpense = (emp: any) => {
        const today = new Date().toISOString().slice(0, 10);

        setExpenseEmployee(emp);
        setExpenseForm({
            date: today,
            amount: '',
            reason: '',
        });
        setExpenseEditId(null);
        setShowExpenseModal(true);
    };

    const handleSaveExpense = async () => {
        if (!expenseEmployee) return;

        const payload = {
            date: expenseForm.date,
            employee_name: expenseEmployee.name,
            employee_id: expenseEmployee.employee_number,
            amount: expenseForm.amount,
            reason: expenseForm.reason,
        };

        try {
            const res = await fetch('/api/expense' + (expenseEditId ? '' : ''), {
                method: expenseEditId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseEditId ? { id: expenseEditId, ...payload } : payload),
            });

            const data = await res.json();
            const isSuccess = data.success ?? data.status;

            if (!isSuccess) {
                toast.error(data.message || 'Failed to add expense');
                return;
            }

            toast.success('Expense added successfully');
            setShowExpenseModal(false);
            setExpenseEmployee(null);
            setExpenseForm({ date: '', amount: '', reason: '' });
            setExpenseEditId(null);

            // Refresh detail to show the new/updated expense
            if (selectedEmployee) {
                fetchDetail(selectedEmployee.id, selectedMonth, selectedYear);
            } else {
                fetchEmployees();
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to add expense');
        }
    };

    const handleEditExpense = (eItem: any) => {
        const today = eItem.date || new Date().toISOString().slice(0, 10);

        // set a minimal employee object for the modal
        setExpenseEmployee({
            name: eItem.employee_name,
            employee_number: eItem.employee_id,
        });

        setExpenseForm({
            date: today,
            amount: String(eItem.amount || ''),
            reason: eItem.reason || '',
        });

        setExpenseEditId(String(eItem.id));
        setShowExpenseModal(true);
    };

    const handleDeleteExpense = (eItem: any) => {
        setExpenseToDelete(eItem);
        setShowExpenseDeleteModal(true);
    };

    const confirmDeleteExpense = async () => {
        if (!expenseToDelete) return;

        try {
            const res = await fetch('/api/expense', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: String(expenseToDelete.id) }),
            });

            const data = await res.json();
            const isSuccess = data.success ?? data.status;

            if (!isSuccess) {
                toast.error(data.message || 'Failed to delete expense');
                return;
            }

            toast.success('Expense deleted');
            setShowExpenseDeleteModal(false);
            setExpenseToDelete(null);

            if (selectedEmployee) {
                fetchDetail(selectedEmployee.id, selectedMonth, selectedYear);
            } else {
                fetchEmployees();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete expense');
        }
    };

    // DELETE
    const handleDelete = async () => {
        if (!deleteEmployee) return;

        try {
            await fetch('/api/fixEmployee', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteEmployee.id }),
            });

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

        const url = '/api/fixEmployee';
        const method = isEdit ? 'PUT' : 'POST';
        const payload = isEdit
            ? {
                id: editData?.id || form.old_employee_id || '',
                name: form.name,
                operation: form.operation,
                employee_number: form.employee_number,
                account_number: form.account_number,
                bank_name: form.bank_name,
                amount: form.amount,
                remarks: 'Monthly fixed salary',
            }
            : {
                name: form.name,
                operation: form.operation,
                employee_number: form.employee_number,
                account_number: form.account_number,
                bank_name: form.bank_name,
                amount: form.amount === '' ? 0 : Number(form.amount),
                remarks: 'Monthly fixed salary',
            };

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        const isSuccess = data.success ?? data.status;

        if (!isSuccess) {
            toast.error(data.message);
            return;
        }

        toast.success(isEdit ? 'Updated' : 'Added');
        setShowModal(false);
        await fetchEmployees();
    };

    const filteredEmployees = employees.filter((emp: any) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.employee_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage));

    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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
                                        <th>Amount</th>
                                        <th>Add Expense</th>
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

                                                fetchDetail(emp.id, current.month, current.year);
                                            }}
                                        >
                                            <td>{emp.employee_number}</td>
                                            <td className="p-4">{emp.name}</td>
                                            <td>{emp.operation}</td>
                                            <td>{emp.account_number}</td>
                                            <td>{emp.bank_name}</td>
                                            <td>₹{Number(emp.amount).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddExpense(emp);
                                                    }}
                                                    className='bg-primary px-4 py-2 rounded-xl text-white font-bold'
                                                >
                                                    Add Exp +
                                                </button>
                                            </td>
                                            <td
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex justify-center align-middle p-4 "
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenu(openMenu === emp.id ? null : emp.id);
                                                    }}

                                                >
                                                    ⋮
                                                </button>

                                                {openMenu === emp.id && (
                                                    <div className="dropdown-menu absolute right-2 mt-8 w-40 z-99 bg-white border rounded-lg shadow">

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

                                <div className="text-sm text-gray-500">
                                    Page {currentPage} of {totalPages}
                                </div>

                                <div className="flex gap-2 items-center flex-wrap">

                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>

                                    {getPaginationRange(currentPage, totalPages).map((page, index) => {
                                        if (page === "...") {
                                            return (
                                                <span key={index} className="px-2 text-gray-400">
                                                    ...
                                                </span>
                                            );
                                        }

                                        return (
                                            <button
                                                key={`${page}-${index}`}
                                                onClick={() => setCurrentPage(Number(page))}
                                                className={`px-3 py-1 border rounded ${currentPage === page
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

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
                                    <p className="font-semibold text-lg">{detail.data?.name}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow">
                                    <p className="text-xs text-gray-500">Operation</p>
                                    <p className="font-medium">{detail.data?.operation}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow">
                                    <p className="text-xs text-gray-500">Employee ID</p>
                                    <p className="font-medium">{detail.data?.employee_number}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow">
                                    <p className="text-xs text-gray-500">Account</p>
                                    <p className="font-medium">{detail.data?.account_number}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow">
                                    <p className="text-xs text-gray-500">Bank</p>
                                    <p className="font-medium">{detail.data?.bank_name}</p>
                                </div>

                                <div className="bg-white  p-4 rounded-xl shadow">
                                    <p className="text-xs">Advance</p>
                                    <p className="font-semibold text-lg">₹{detail.total_advance}</p>
                                </div>

                                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-xl shadow">
                                    <p className="text-xs">Salary</p>
                                    <p className="font-semibold text-lg">₹{detail.data?.amount}</p>
                                </div>

                                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-xl shadow">
                                    <p className="text-xs">Total Expense</p>
                                    <p className="font-semibold text-lg">₹{detail.total_expense}</p>
                                </div>

                            </div>

                            {/* ================= TOTAL ================= */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow flex justify-between items-center">
                                <p className="text-lg font-medium">Total Salary</p>
                                <p className="text-3xl font-bold">
                                    ₹{(Number(detail.data?.amount || 0) + Number(detail.total_expense || 0) - Number(detail.total_advance || 0)).toFixed(2)}
                                </p>
                            </div>

                            {/* ================= TABLE ================= */}
                            <div className="bg-white rounded-xl shadow overflow-hidden">

                                <div className="p-4 border-b font-semibold">
                                    Expense History
                                </div>

                                <div className="bg-white rounded-xl shadow-md">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-center">
                                            <thead className="bg-gray-100 text-gray-700">
                                                <tr>
                                                    <th className="p-3">Date</th>
                                                    <th>Employee Name</th>
                                                    <th>Employee ID</th>
                                                    <th>Reason</th>
                                                    <th>Amount</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {(detail.expense_history || []).map((e: any) => (
                                                    <tr key={e.id} className="border-t hover:bg-gray-50">
                                                        <td className="p-3">{e.date}</td>
                                                        <td>{e.employee_name}</td>
                                                        <td>{e.employee_id}</td>
                                                        <td>{e.reason}</td>
                                                        <td className="font-semibold text-green-600">
                                                            ₹{Number(e.amount).toFixed(2)}
                                                        </td>
                                                        <td onClick={(ev) => ev.stopPropagation()} className="p-3">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={(ev) => {
                                                                        ev.stopPropagation();
                                                                        handleEditExpense(e);
                                                                    }}
                                                                    className="px-3 py-1 bg-yellow-50 text-yellow-800 border border-yellow-100 rounded-md hover:bg-yellow-100"
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    onClick={(ev) => {
                                                                        ev.stopPropagation();
                                                                        handleDeleteExpense(e);
                                                                    }}
                                                                    className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-md hover:bg-red-100"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
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

                        <input placeholder="Operation" value={form.operation}
                            onChange={(e) => setForm({ ...form, operation: e.target.value })}
                            className="w-full border p-2 rounded" />

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

                        <input
                            placeholder="Amount"
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            className="w-full border p-2 rounded"
                        />

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

            {showExpenseModal && expenseEmployee && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
                        <h2 className="font-bold text-lg">Add Expense</h2>

                        <p className="text-sm text-gray-500">
                            Employee: <span className="font-semibold text-primary">{expenseEmployee.name}</span>
                        </p>

                        {expenseEditId ? (
                            <div className="w-full border p-2 rounded bg-gray-50 text-sm">
                                {expenseForm.date}
                            </div>
                        ) : (
                            <input
                                type="date"
                                value={expenseForm.date}
                                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        )}

                        <input
                            type="number"
                            placeholder="Amount"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                            className="w-full border p-2 rounded"
                        />

                        <input
                            type='text'
                            placeholder="Reason"
                            value={expenseForm.reason}
                            onChange={(e) => setExpenseForm({ ...expenseForm, reason: e.target.value })}
                            className="w-full border p-2 rounded "
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowExpenseModal(false);
                                    setExpenseEmployee(null);
                                }}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveExpense}
                                className="bg-primary text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExpenseDeleteModal && expenseToDelete && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 text-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Delete Expense?
                        </h2>

                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete this expense of{' '}
                            <span className="font-semibold text-primary">
                                ₹{Number(expenseToDelete.amount || 0).toFixed(2)}
                            </span>
                            ?
                        </p>

                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setShowExpenseDeleteModal(false);
                                    setExpenseToDelete(null);
                                }}
                                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDeleteExpense}
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
