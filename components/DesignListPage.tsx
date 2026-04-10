'use client';

import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import {
  CloudUpload,
  CloudSync,
  Eye,
  PencilRuler,
  Trash2

} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DesignPage = () => {
  const [list, setList] = useState([]);
  const [editData, setEditData] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState({
    name: '',
    operation: '',
    employee_number: '',
    account_number: '',
    bank_name: '',
    old_employee_id: '',
  });
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Limit to max 3 images
    const totalImages = [...images, ...newFiles].slice(0, 3);
    setImages(totalImages);
  };
  // 🔥 DATE DEFAULT
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1);
  const currentYear = String(today.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    fetchList();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredList = list.filter((item) => {
    // 🔍 search by design no
    const matchesSearch = item.design_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 📅 month/year filter
    const d = new Date(item.date);

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
        String(new Date(item.date).getFullYear())
      )
    ),
  ];

  // ADD
  const handleAdd = () => {
    setEditData(null);
    setForm({
      date: new Date().toISOString().split('T')[0],
      design_number: '',
      piece: '',

    });
    setShowModal(true);
  };

  const handleEdit = (entry: any) => {
    setEditData(entry);
    setForm({
      date: entry.date,
      design_number: entry.design_number,
      piece: entry.piece,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append('design_number', form.design_number);
      formData.append('piece', form.piece);
      formData.append('date', form.date);

      // ✅ IMPORTANT: send ID for edit
      if (editData?.id) {
        formData.append('id', String(editData.id));
      }

      // ✅ Images (optional like Postman)
      if (images[0]) formData.append('image1', images[0]);
      if (images[1]) formData.append('image2', images[1]);
      if (images[2]) formData.append('image3', images[2]);

      // 🔥 Decide API
      const url = editData
        ? '/api/design/edit'   // ✅ EDIT
        : '/api/design';       // ✅ ADD

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.status) {
        toast.error(data.message || 'Failed');
        return;
      }

      toast.success(editData ? 'Updated successfully' : 'Added successfully');

      setShowModal(false);
      setImages([]);
      fetchList();

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const uploadImage1 = async (file: File, designNo: string) => {
    const formData = new FormData();
    formData.append("design_no", designNo);
    formData.append("image", file);

    const res = await fetch("/api/image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);

    if (data.status) {
      alert("Image uploaded successfully!");
      setShowUploadForm(false);
    } else {
      alert("Failed to upload image.");
    }

  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const formData = new FormData();
      formData.append('id', String(deleteId));

      const res = await fetch('/api/design/delete', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.status) {
        toast.error(data.message || 'Delete failed');
        return;
      }

      toast.success('Design deleted successfully');

      setShowDeleteModal(false);
      setDeleteId(null);
      fetchList();

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

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
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 text-center animate-fade-in">

            <h2 className="text-lg font-semibold text-gray-800">
              Delete Design?
            </h2>

            <p className="text-sm text-gray-500">
              Are you sure you want to delete this design? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
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
      <div className="p-6 pt-0 space-y-6 animate-fade-in">
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
            <button
              onClick={handleAdd}
              className="px-5 py-2 bg-primary text-white rounded-lg"
            >
              + Add
            </button>
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
                    <th className="px-6 py-4">OutPut Piece</th>
                    <th className="px-6 py-4">Remaining Piece</th>
                    <th className="px-6 py-4">Reason</th>
                    {/* <th className="px-6 py-4">Avg Rate</th>
                    <th className="px-6 py-4">Total Cost</th> */}
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredList.map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4">{item.date}</td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {item.design_number}
                      </td>
                      <td className="px-6 py-4">{item.piece}</td>
                      <td className="px-6 py-4">{item.output_piece}</td>
                      <td className="px-6 py-4 font-bold">
                        {item.remaining_piece}
                      </td>
                      <td className="px-6 py-4">
                        {item.missing_operations.length || '-'}
                      </td>

                      {/* ACTION */}
                      <td className="p-2 sm:p-4 flex justify-center align-middle">
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              router.push(`/design/${item.design_number}`);
                            }}
                            className="p-2 bg-primary/60 hover:bg-primary/90 text-white rounded-md"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              handleEdit(item);
                            }}
                            className="p-2 bg-blue-400 hover:bg-blue-700 text-white rounded-md"
                          >
                            <PencilRuler size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(item.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 bg-red-400 hover:bg-red-700 text-white rounded-md"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
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

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
              <h2 className="font-bold">
                {editData ? 'Edit Design' : 'Add Design'}
              </h2>

              <input type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border p-2 rounded" />

              <input placeholder="Design Number"
                value={form.design_number}
                onChange={(e) => setForm({ ...form, design_number: e.target.value })}
                className="w-full border p-2 rounded" />

              <input placeholder="Piece"
                value={form.piece}
                onChange={(e) => setForm({ ...form, piece: e.target.value })}
                className="w-full border p-2 rounded" />
              <div>
                <h1 className="text-md font-bold text-primary/70">Images</h1>
              </div>
              <div className="flex gap-2 items-center">

                {/* Upload Box */}
                {images.length < 3 && (
                  <div
                    onClick={handleClick}
                    className="border-2 border-dotted border-gray-400 text-gray-600 rounded-lg hover:border-primary hover:text-primary transition flex items-center justify-center h-10 w-10 cursor-pointer"
                  >
                    <CloudUpload size={16} />
                  </div>
                )}

                {/* Hidden Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />

                {/* Preview Images */}
                {images.map((file, index) => (

                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="h-15 w-15 object-cover rounded-2xl border"
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowModal(false); setImages([]); }}>Cancel</button>
                <button onClick={handleSubmit} className="bg-primary text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DesignPage;