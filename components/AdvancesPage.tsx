// 'use client';

// import React, { useEffect, useState } from 'react';

// interface Advance {
//   id: number;
//   date: string;
//   employee_name: string;
//   amount: number;
//   employee_id?: number;
// }

// export function AdvancesPage() {
//   const [data, setData] = useState<Advance[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editData, setEditData] = useState<Advance | null>(null);
//   const [openMenu, setOpenMenu] = useState<number | null>(null);

//   const today = new Date().toISOString().split('T')[0];
//   const [selectedDate, setSelectedDate] = useState(today);

//   // 🔥 EMPLOYEE STATES (NEW)
//   const [employeeList, setEmployeeList] = useState<any[]>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

//   const [form, setForm] = useState({
//     date: today,
//     employee_name: '',
//     employee_id: '',
//     amount: '',
//   });

//   // FETCH ADVANCES
//   const fetchData = async () => {
//     const res = await fetch('/api/advance');
//     const json = await res.json();
//     setData(json.data || []);
//   };

//   // 🔥 FETCH EMPLOYEES
//   const fetchEmployees = async () => {
//     try {
//       const res = await fetch('/api/employee');
//       const data = await res.json();

//       if (data.success) {
//         setEmployeeList(data.employees);
//         console.log(data.employees);
        
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchEmployees(); // 👈 IMPORTANT
//   }, []);

//   const filteredData = data.filter((d) => d.date === selectedDate);

//   // 🔥 EMPLOYEE SEARCH
//   const handleEmployeeSearch = (value: string) => {
//     setForm({ ...form, employee_name: value });

//     if (!value) {
//       setShowEmployeeDropdown(false);
//       return;
//     }

//     const filtered = employeeList.filter((emp) =>
//       emp.name.toLowerCase().includes(value.toLowerCase())
//     );

//     setFilteredEmployees(filtered);
//     setShowEmployeeDropdown(true);
//   };

//   // SUBMIT
//   const handleSubmit = async () => {
//     const payload = {
//       date: form.date,
//       employee_name: form.employee_name,
//       employee_id: Number(form.employee_id),
//       amount: Number(form.amount),
//       ...(editData && { id: editData.id }),
//     };

//     console.log('::::::::data::::::::::',payload);
    

//     const res = await fetch(
//       editData ? `/api/advance/${editData.id}` : '/api/advance',
//       {
//         method: editData ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await res.json();

//     if (result.status === 'success') {
//       fetchData();
//       setShowModal(false);
//       setEditData(null);
//       setForm({
//         date: today,
//         employee_name: '',
//         employee_id: '',
//         amount: '',
//       });
//     }
//   };

//   // EDIT
//   const handleEdit = (item: Advance) => {
//     setEditData(item);
//     setForm({
//       date: item.date,
//       employee_name: item.employee_name,
//       employee_id: String(item.employee_id || ''),
//       amount: String(item.amount),
//     });
//     setShowModal(true);
//   };

//   // DELETE
//   const handleDelete = async (item: Advance) => {
//     if (!confirm('Are you sure you want to delete?')) return;

//     const res = await fetch(`/api/advance/${item.id}?id=${item.id}`, {
//       method: 'DELETE',
//     });

//     const result = await res.json();

//     if (result.status === 'success') {
//       fetchData();
//     }
//   };

//   return (
//     <div className="space-y-6">

//       {/* TOP BAR */}
//       <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="px-4 py-2 border rounded-lg"
//         />

//         <button
//           onClick={() => {
//             setShowModal(true);
//             setEditData(null);
//             setForm({
//               date: today,
//               employee_name: '',
//               employee_id: '',
//               amount: '',
//             });
//             setShowEmployeeDropdown(false);
//           }}
//           className="px-5 py-2 text-white rounded-lg"
//           style={{ background: 'linear-gradient(135deg,#00885a,#00a86b)' }}
//         >
//           + Add Advance
//         </button>
//       </div>

//       {/* TABLE */}
//       <table className="w-full bg-white rounded-xl">
//         <thead className="bg-primary text-white">
//           <tr>
//             <th className="p-4">Date</th>
//             <th className="p-4">Employee</th>
//             <th className="p-4">Amount</th>
//             <th className="p-4">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredData.map((entry) => (
//             <tr key={entry.id} className="border-t">
//               <td className="p-4">{entry.date}</td>
//               <td className="p-4">{entry.employee_name}</td>
//               <td className="p-4">₹{entry.amount}</td>

//               <td className="p-4 relative text-center">
//                 <button
//                   onClick={() =>
//                     setOpenMenu(openMenu === entry.id ? null : entry.id)
//                   }
//                 >
//                   ⋮
//                 </button>

//                 {openMenu === entry.id && (
//                   <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">
//                     <button
//                       onClick={() => {
//                         handleEdit(entry);
//                         setOpenMenu(null);
//                       }}
//                       className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//                     >
//                       ✏️ Edit
//                     </button>

//                     <button
//                       onClick={() => {
//                         handleDelete(entry);
//                         setOpenMenu(null);
//                       }}
//                       className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-50"
//                     >
//                       🗑 Delete
//                     </button>
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//           <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">

//             <div className="bg-gradient-to-r from-[#00885a] to-[#00a86b] px-6 py-4 text-white">
//               {editData ? 'Edit Advance' : 'Add Advance'}
//             </div>

//             <div className="p-6 space-y-4">

//               <input
//                 type="date"
//                 value={form.date}
//                 onChange={(e) =>
//                   setForm({ ...form, date: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />

//               {/* 🔥 AUTOCOMPLETE */}
//               <div className="relative">
//                 <input
//                   placeholder="Employee Name"
//                   value={form.employee_name}
//                   onChange={(e) =>
//                     handleEmployeeSearch(e.target.value)
//                   }
//                   className="w-full border p-2 rounded"
//                 />

//                 {showEmployeeDropdown && filteredEmployees.length > 0 && (
//                   <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto z-50">
//                     {filteredEmployees.map((emp) => (
//                       <div
//                         key={emp.id}
//                         onClick={() => {
//                           setForm({
//                             ...form,
//                             employee_name: emp.name,
//                             employee_id: emp.employee_number, // 👈 IMPORTANT
//                           });
//                           setShowEmployeeDropdown(false);
//                         }}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                       >
//                         {emp.name} ({emp.employee_number})
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* 🔥 AUTO FILLED ID */}
//               <input
//                 placeholder="Employee ID"
//                 value={form.employee_id}
//                 readOnly
//                 className="w-full border p-2 rounded bg-gray-100"
//               />

//               <input
//                 type="number"
//                 placeholder="Amount"
//                 value={form.amount}
//                 onChange={(e) =>
//                   setForm({ ...form, amount: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />

//             </div>

//             <div className="flex justify-end gap-3 p-4 border-t">
//               <button onClick={() => setShowModal(false)}>Cancel</button>

//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 text-white rounded"
//                 style={{ background: '#00885a' }}
//               >
//                 {editData ? 'Update' : 'Add'}
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';

interface Advance {
  id: number;
  date: string;
  employee_name: string;
  amount: number;
  employee_id?: number;
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

  const [form, setForm] = useState({
    date: today,
    employee_name: '',
    employee_id: '',
    amount: '',
  });

  const fetchData = async () => {
    const res = await fetch('/api/advance');
    const json = await res.json();
    setData(json.data || []);
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
    });
    setShowModal(true);
  };

  const handleDelete = async (item: Advance) => {
    if (!confirm('Are you sure you want to delete?')) return;

    const res = await fetch(`/api/advance/${item.id}?id=${item.id}`, {
      method: 'DELETE',
    });

    const result = await res.json();

    if (result.status === 'success') {
      fetchData();
    }
  };

  return (
    <div className="space-y-6">

      {/* 🔥 UPDATED TOP BAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md gap-4">

        <div className="flex gap-3 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />

          <span>to</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setEditData(null);
            setForm({
              date: today,
              employee_name: '',
              employee_id: '',
              amount: '',
            });
            setShowEmployeeDropdown(false);
          }}
          className="px-5 py-2 text-white rounded-lg"
          style={{ background: 'linear-gradient(135deg,#00885a,#00a86b)' }}
        >
          + Add Advance
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white rounded-xl">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Date</th>
            <th className="p-4">Employee</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((entry) => (
            <tr key={entry.id} className="border-t text-center">
              <td className="p-4">{entry.employee_id}</td>
              <td className="p-4">{entry.date}</td>
              <td className="p-4">{entry.employee_name}</td>
              <td className="p-4">₹{entry.amount}</td>

              <td className="p-4 relative text-center">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === entry.id ? null : entry.id)
                  }
                >
                  ⋮
                </button>

                {openMenu === entry.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">
                    <button
                      onClick={() => {
                        handleEdit(entry);
                        setOpenMenu(null);
                      }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => {
                        handleDelete(entry);
                        setOpenMenu(null);
                      }}
                      className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-50"
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
                  className="w-full border p-2 rounded"
                />

                {showEmployeeDropdown && filteredEmployees.length > 0 && (
                  <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto z-50">
                    {filteredEmployees.map((emp) => (
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
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
    </div>
  );
}