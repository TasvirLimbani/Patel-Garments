'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, CloudUpload, CloudSync } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DesignDetailPage = ({ designNo }: any) => {
    const [detail, setDetail] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [showUploadForm, setShowUploadForm] = useState(false);

    const [showPreview, setShowPreview] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);


    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    const fetchDetail = async () => {
        setLoading(true);
        const res = await fetch(`/api/design/detail?design_no=${designNo}`);
        const data = await res.json();

        if (data.status) setDetail(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDetail();
    }, [designNo]);

    const uploadImage = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('design_no', designNo);
        formData.append('image', file);

        const res = await fetch('/api/image', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();

        if (data.status) {
            alert('Uploaded!');
            setShowUploadForm(false);
            fetchDetail();
        }
    };

    if (loading) return <div className="h-full absolute inset-0 flex items-center justify-center backdrop-blur-sm z-0">
        <div className="flex flex-col items-center gap-3 pl-56">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-primary">Loading data...</p>
        </div>
    </div>;
    if (!detail) return <div>Design not found</div>;

    const images = detail?.images
        ? Object.values(detail.images).filter((img) => img)
        : [];

    return (
        <>
            <div className="space-y-6">

                {/* 🔙 BACK */}
                <button
                    onClick={() => {
                        router.push('/design');
                    }}
                    className="px-2 py-2 bg-primary text-white rounded-4xl hover:bg-primary/80 transition"
                >
                    <ChevronLeft />
                </button>

                {/* 🔥 SUMMARY CARDS */}
                <div className="grid xl:grid-cols-5 gap-4">

                    <div className="bg-white p-5 rounded-xl shadow">
                        <p className="text-gray-500 text-sm">Design No</p>
                        <p className="text-xl font-bold text-primary">
                            {detail.design.design_number}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow">
                        <p className="text-gray-500 text-sm">Grand Total</p>
                        <p className="text-xl font-bold text-green-600">
                            ₹{detail.design.total_cost}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow">
                        <p className="text-gray-500 text-sm">Per piece price</p>
                        <p className="text-xl font-bold text-blue-600">
                            ₹{detail.design.one_piece_price}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow">
                        <p className="text-gray-500 text-sm">Status</p>
                        <p className="text-xl font-bold">
                            {detail.design.status}
                        </p>
                    </div>

                    <div className="bg-white p-2 rounded-xl shadow flex flex-col">
                        <div className="flex gap-2 flex-nowrap flex-1 items-start">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`design-${index}`}
                                    onClick={() => {
                                        setActiveIndex(index);
                                        setShowPreview(true);
                                    }}
                                    className="w-18 h-18 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🔥 ENTRIES TABLE */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">

                        <table className="w-full text-sm text-center">

                            <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                <tr>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Operation</th>
                                    <th className="px-6 py-4">Piece</th>
                                    <th className="px-6 py-4">Rate</th>
                                    <th className="px-6 py-4">Total</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {detail.entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">
                                            {entry.employee_name}
                                        </td>
                                        <td className="px-6 py-4">{entry.operation}</td>
                                        <td className="px-6 py-4">{entry.piece}</td>
                                        <td className="px-6 py-4">₹{entry.rate}</td>
                                        <td className="px-6 py-4 font-semibold">
                                            ₹{entry.operation_cost}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>
                </div>
            </div>

            {showPreview && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center">

                    {/* ❌ CLOSE BUTTON */}
                    <button
                        onClick={() => setShowPreview(false)}
                        className="absolute top-5 right-5 text-white text-2xl"
                    >
                        ✕
                    </button>

                    {/* ⬅️ PREV */}
                    <button
                        onClick={() =>
                            setActiveIndex((prev) =>
                                prev === 0 ? images.length - 1 : prev - 1
                            )
                        }
                        className="absolute left-5 text-white text-3xl"
                    >
                        ‹
                    </button>

                    {/* ➡️ NEXT */}
                    <button
                        onClick={() =>
                            setActiveIndex((prev) =>
                                prev === images.length - 1 ? 0 : prev + 1
                            )
                        }
                        className="absolute right-5 text-white text-3xl"
                    >
                        ›
                    </button>

                    {/* 🔥 BIG IMAGE */}
                    {images.length > 0 && (
                        <img
                            src={images[activeIndex]}
                            className="max-h-[70vh] max-w-[90%] rounded-xl shadow-lg"
                        />
                    )}

                    {/* 🔽 THUMBNAILS */}
                    <div className="flex gap-3 mt-6 flex-wrap justify-center">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() => setActiveIndex(index)}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${activeIndex === index
                                    ? 'border-white'
                                    : 'border-transparent opacity-60'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}

        </>
    );
};

export default DesignDetailPage;