'use client';

import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, IndianRupee, Wallet } from 'lucide-react';
{/* <IndianRupee /> */ }
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="h-full absolute inset-0 flex items-center justify-center backdrop-blur-sm z-0">
      <div className="flex flex-col items-center gap-3 pl-56">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-primary">Loading data...</p>
      </div>
    </div>;
  }

  const summary = data?.summary || {};
  const monthData = [...(data?.month_data || [])].reverse();
  const originalMonthData = data?.month_data || [];
  const graphDataRaw = data?.last_7_days_graph || [];

  // 🔥 Format graph data properly
  const graphData = graphDataRaw.map((g: any) => ({
    date: g.work_date,
    amount: Number(g.total_amount),
    pieces: Number(g.total_piece),
  }));

  const stats = [
    {
      label: 'Total Employees',
      value: summary.total_employees || 0,
      icon: Users,
    },
    {
      label: 'Total Salary',
      value: `₹${Number(summary.total_salary || 0).toFixed(2)}`,
      icon: IndianRupee,
    },
    {
      label: 'Total Advance',
      value: `₹${summary.total_advance || 0}`,
      icon: TrendingUp,
    },
    {
      label: 'Total Payable',
      value: `₹${Number(summary.total_payable || 0).toFixed(2)}`,
      icon: Wallet,
    },
  ];

  const LastMonthStats = [
    {
      label: 'Total Salary',
      value: `₹${Number(summary.last_month_total_salary || 0).toFixed(2)}`,
      icon: IndianRupee,
    },
    {
      label: 'Total Advance',
      value: `₹${summary.last_month_total_advance || 0}`,
      icon: TrendingUp,
    },
    {
      label: 'Total Payable',
      value: `₹${Number(summary.last_month_total_payable || 0).toFixed(2)}`,
      icon: Wallet,
    },
  ];

  const monthGraphData = originalMonthData.map((m: any) => {
    const [month, year] = m.label.split('-');

    return {
      name: new Date(year, month - 1).toLocaleString('en-IN', {
        month: 'short',
      }),
      amount: Number(m.data),
    };
  });

  return (
    <div className="space-y-6">

      {/* 🔹 TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon size={26} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 TOP EMPLOYEES + GRAPH SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 📅 MONTH DATA TABLE */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Monthly Overview</h3>

          {monthData.length === 0 ? (
            <p>No data</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* LEFT SIDE (first 6 months) */}
              <div className="space-y-3">
                {monthData.slice(0, 6).map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">
                      {new Date(item.label.split('-')[1], item.label.split('-')[0] - 1)
                        .toLocaleString('en-IN', {
                          month: 'long',
                          year: 'numeric',
                        })}
                    </span>
                    <span className="font-bold text-primary">
                      Pcs. {Number(item.data).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDE (last 6 months) */}
              <div className="space-y-3">
                {monthData.slice(6, 12).map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">
                      {new Date(item.label.split('-')[1], item.label.split('-')[0] - 1)
                        .toLocaleString('en-IN', {
                          month: 'long',
                          year: 'numeric',
                        })}
                    </span>
                    <span className="font-bold text-primary">
                      Pcs. {Number(item.data).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* 📊 GRAPH */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Last 12 Months Performance</h3>

          {graphData.length === 0 ? (
            <p>No graph data</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={monthGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Last Month */}
      <h1 className='text-lg font-bold mb-4'>Last Month Stats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LastMonthStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon size={26} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}