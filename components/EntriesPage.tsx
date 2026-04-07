// 'use client';

// import React, { useState, useEffect } from 'react';
// import { toast } from 'sonner';

// const operations = [
//   'Collar Making',
//   'Cuff Making',
//   'Front',
//   'Lable',
//   'Sleve Patti',
//   'Half Dab',
//   'Collar Att',
//   'Cuff Attaching',
//   'Side Munda',
//   'Side Pocket',
//   'Bottom',
//   'Press',
//   'Gaj Button',
// ];

// export function EntriesPage() {
//   const [entries, setEntries] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );

//   const [showModal, setShowModal] = useState(false);
//   const [editData, setEditData] = useState<any>(null);
//   const [openMenu, setOpenMenu] = useState<number | null>(null);

//   // 🔥 NEW STATES
//   const [employeeList, setEmployeeList] = useState<any[]>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

//   const [form, setForm] = useState({
//     date: new Date().toISOString().split('T')[0],
//     employee_name: '',
//     employee_id: '',
//     operation: '',
//     design_no: '',
//     colour_no: '',
//     piece: '',
//     rate: '',
//   });

//   // FETCH ENTRIES
//   const fetchEntries = async () => {
//     const res = await fetch('/api/entries');
//     const data = await res.json();
//     if (data.status === 'success') setEntries(data.data);
//     setLoading(false);
//   };

//   // 🔥 FETCH EMPLOYEES
//   const fetchEmployees = async () => {
//     try {
//       const res = await fetch('/api/employee');
//       const data = await res.json();

//       if (data.success) {
//         setEmployeeList(data.employees);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEntries();
//     fetchEmployees(); // 👈 IMPORTANT
//   }, []);

//   const filteredEntries = entries.filter(
//     (entry) => entry.date === selectedDate
//   );

//   // 🔥 SEARCH EMPLOYEE
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
//     const url = editData
//       ? `/api/entries/${editData.id}`
//       : '/api/entries';

//     const method = editData ? 'PUT' : 'POST';

//     const body = editData ? { ...form, id: editData.id } : form;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();

//       // 🔴 BACKEND ERROR (your case)
//       if (data.status === 'error') {
//         toast.error(`${data.message}`);
//         return;
//       }

//       // ✅ SUCCESS
//       toast.success(editData ? 'Entry updated successfully' : 'Entry added successfully');

//       setShowModal(false);
//       setEditData(null);
//       fetchEntries();

//     } catch (err) {
//       toast.error('Server error');
//     }
//   };

//   // EDIT
//   const handleEdit = (entry: any) => {
//     setEditData(entry);
//     setForm({
//       date: entry.date,
//       employee_name: entry.employee_name,
//       employee_id: entry.employee_id,
//       operation: entry.operation,
//       design_no: entry.design_no,
//       colour_no: entry.colour_no,
//       piece: entry.piece,
//       rate: entry.rate,
//     });
//     setShowModal(true);
//   };

//   // DELETE
//   const handleDelete = async (entry: any) => {
//     if (!confirm('Are you sure to delete?')) return;

//     await fetch(`/api/entries/${entry.id}`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id: entry.id }),
//     });

//     fetchEntries();
//   };

//   if (loading) return <p className="p-6">Loading...</p>;

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
//             setForm({
//               date: new Date().toISOString().split('T')[0],
//               employee_name: '',
//               employee_id: '',
//               operation: '',
//               design_no: '',
//               colour_no: '',
//               piece: '',
//               rate: '',
//             });
//             setEditData(null);
//             setShowModal(true);
//             setShowEmployeeDropdown(false);
//           }}
//           className="px-5 py-2 text-white rounded-lg"
//           style={{ background: 'linear-gradient(135deg,#00885a,#00a86b)' }}
//         >
//           + Add Entry
//         </button>
//       </div>

//       {/* TABLE */}
//       <table className="w-full bg-white rounded-xl">
//         <thead className="bg-primary text-white">
//           <tr>
//             <th className="p-4">Date</th>
//             <th className="p-4">Employee</th>
//             <th className="p-4">Operation</th>
//             <th className="p-4">Design</th>
//             <th className="p-4">Colour</th>
//             <th className="p-4">Piece</th>
//             <th className="p-4">Rate</th>
//             <th className="p-4">Total</th>
//             <th className="p-4">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredEntries.map((entry) => (
//             <tr key={entry.id} className="border-t">
//               <td className="p-4">{entry.date}</td>
//               <td className="p-4">{entry.employee_name}</td>
//               <td className="p-4">{entry.operation}</td>
//               <td className="p-4">{entry.design_no}</td>
//               <td className="p-4">{entry.colour_no}</td>
//               <td className="p-4">{entry.piece}</td>
//               <td className="p-4">₹{entry.rate}</td>
//               <td className="p-4 font-bold">₹{entry.total}</td>

//               <td className="p-4 relative text-center">
//                 <button
//                   onClick={() =>
//                     setOpenMenu(openMenu === Number(entry.id) ? null : Number(entry.id))
//                   }
//                 >
//                   ⋮
//                 </button>

//                 {openMenu === Number(entry.id) && (
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
//               {editData ? 'Edit Entry' : 'Add Entry'}
//             </div>

//             <div className="p-6 space-y-4">

//               <input type="date" value={form.date}
//                 onChange={(e) => setForm({ ...form, date: e.target.value })}
//                 className="w-full border p-2 rounded" />

//               {/* 🔥 AUTOCOMPLETE INPUT */}
//               <div className="relative">
//                 <input
//                   placeholder="Employee Name"
//                   value={form.employee_name}
//                   onChange={(e) => handleEmployeeSearch(e.target.value)}
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
//                             employee_id: emp.employee_number,
//                             operation: emp.operation,
//                           });
//                           setShowEmployeeDropdown(false);
//                         }}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                       >
//                         {emp.name} ({emp.employee_number}) - {emp.operation}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <input placeholder="Employee ID" value={form.employee_id}
//                 className="w-full border p-2 rounded" readOnly />

//               <select
//                 value={form.operation}
//                 onChange={(e) => setForm({ ...form, operation: e.target.value })}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="">Select Operation</option>

//                 {operations.map((op, index) => (
//                   <option key={index} value={op}>
//                     {op}
//                   </option>
//                 ))}
//               </select>

//               <input placeholder="Design No" value={form.design_no}
//                 onChange={(e) => setForm({ ...form, design_no: e.target.value })}
//                 className="w-full border p-2 rounded" />

//               <input placeholder="Colour No" value={form.colour_no}
//                 onChange={(e) => setForm({ ...form, colour_no: e.target.value })}
//                 className="w-full border p-2 rounded" />

//               <input type="number" placeholder="Piece" value={form.piece}
//                 onChange={(e) => setForm({ ...form, piece: e.target.value })}
//                 className="w-full border p-2 rounded" />

//               <input type="number" placeholder="Rate" value={form.rate}
//                 onChange={(e) => setForm({ ...form, rate: e.target.value })}
//                 className="w-full border p-2 rounded" />

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
  'Press',
  'Gaj Button',
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
    if (startDate && endDate) {
      return entry.date >= startDate && entry.date <= endDate;
    }
    return entry.date === startDate;
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

  const handleDelete = async (entry: any) => {
    if (!confirm('Are you sure to delete?')) return;

    await fetch(`/api/entries/${entry.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: entry.id }),
    });

    fetchEntries();
  };

  if (loading) return <p className="p-6">Loading...</p>;

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
          className="px-5 py-2 text-white rounded-lg"
          style={{ background: 'linear-gradient(135deg,#00885a,#00a86b)' }}
        >
          + Add Entry
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white rounded-xl">
        <thead className="bg-primary text-white text-center">
          <tr>
            <th className="p-4">Date</th>
            <th className="p-4">Employee</th>
            <th className="p-4">Operation</th>
            <th className="p-4">Design</th>
            <th className="p-4">Colour</th>
            <th className="p-4">Piece</th>
            <th className="p-4">Rate</th>
            <th className="p-4">Total</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredEntries.map((entry) => (
            <tr key={entry.id} className="border-t text-center">
              <td className="p-4">{entry.date}</td>
              <td className="p-4">{entry.employee_name}</td>
              <td className="p-4">{entry.operation}</td>
              <td className="p-4">{entry.design_no}</td>
              <td className="p-4">{entry.colour_no}</td>
              <td className="p-4">{entry.piece}</td>
              <td className="p-4">₹{entry.rate}</td>
              <td className="p-4 font-bold">₹{entry.total}</td>

              <td className="p-4 relative text-center">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === Number(entry.id) ? null : Number(entry.id))
                  }
                >
                  ⋮
                </button>

                {openMenu === Number(entry.id) && (
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
              {editData ? 'Edit Entry' : 'Add Entry'}
            </div>

            <div className="p-6 space-y-4">

              <input type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border p-2 rounded" />

              <div className="relative">
                <input
                  placeholder="Employee Name"
                  value={form.employee_name}
                  onChange={(e) => handleEmployeeSearch(e.target.value)}
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
                            operation: emp.operation,
                          });
                          setShowEmployeeDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {emp.name} ({emp.employee_number}) - {emp.operation}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input placeholder="Employee ID" value={form.employee_id}
                className="w-full border p-2 rounded" readOnly />

              <select
                value={form.operation}
                onChange={(e) => setForm({ ...form, operation: e.target.value })}
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

              <input placeholder="Colour No" value={form.colour_no}
                onChange={(e) => setForm({ ...form, colour_no: e.target.value })}
                className="w-full border p-2 rounded" />

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
    </div>
  );
}