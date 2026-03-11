"use client";
import React from "react";
import {
  FiPlus,
  FiTrendingUp,
  FiShoppingBag,
  FiGrid,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Dashboard = () => {
  // --- Chart Data Configurations ---
  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales",
        data: [18, 17, 4, 3, 2, 20, 25, 31, 25, 22, 20, 9],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Visitors",
        data: [40, 20, 17, 9, 23, 38, 39, 30, 34, 25, 27, 17],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Products",
        data: [30, 10, 27, 20, 33, 20, 20, 30, 25, 20, 37, 5],
        borderColor: "#f472b6",
        backgroundColor: "rgba(244, 114, 182, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ["900", "1200", "1400", "1600"],
    datasets: [
      { label: "US", data: [230, 320, 780, 900], backgroundColor: "#3b82f6" },
      {
        label: "Europe",
        data: [410, 550, 680, 740],
        backgroundColor: "#10b981",
      },
      {
        label: "Asian",
        data: [210, 450, 580, 640],
        backgroundColor: "#fb923c",
      },
      {
        label: "Africa",
        data: [120, 350, 120, 300],
        backgroundColor: "#a78bfa",
      },
    ],
  };

  return (
    <div className="p-4 bg-[#f8f9fa] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Whole data about your business here
          </p>
        </div>
        <button className="bg-[#088178] hover:bg-[#066d65] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all">
          <FiPlus /> Create report
        </button>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Revenue",
            val: "$13,456.5",
            sub: "Shipping fees not included",
            color: "bg-teal-50 text-teal-600",
            icon: <FiTrendingUp />,
          },
          {
            label: "Orders",
            val: "53.668",
            sub: "Excluding orders in transit",
            color: "bg-green-50 text-green-600",
            icon: <FiShoppingBag />,
          },
          {
            label: "Products",
            val: "9.856",
            sub: "In 19 Categories",
            color: "bg-orange-50 text-orange-600",
            icon: <FiGrid />,
          },
          {
            label: "Monthly Earning",
            val: "$6,982",
            sub: "Based in your local time.",
            color: "bg-blue-50 text-blue-600",
            icon: <FiCreditCard />,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4"
          >
            <div className={`p-3 rounded-full ${card.color}`}>{card.icon}</div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{card.label}</p>
              <h3 className="text-xl font-bold text-slate-800">{card.val}</h3>
              <p className="text-[11px] text-slate-400 mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Sale statistics</h3>
          <div className="h-87.5">
            <Line
              data={lineData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: "top", align: "end" } },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">
            Revenue Base on Area
          </h3>
          <div className="h-87.5">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                scales: { x: { stacked: false }, y: { stacked: false } },
              }}
            />
          </div>
        </div>
      </div>

      {/* BOTTOM WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Members */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">New Members</h3>
          <div className="space-y-4">
            {["Patric Adams", "Dilan Specter", "Tomas Baker"].map((name, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    <img
                      src={`https://i.pravatar.cc/150?u=${i}`}
                      alt="avatar"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400">Sanfrancisco</p>
                  </div>
                </div>
                <button className="bg-[#088178] text-white p-1 rounded text-xs px-3 font-bold flex items-center gap-1">
                  <FiPlus size={10} /> Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Recent activities</h3>
          <div className="space-y-4">
            {[
              { time: "Today", desc: "Lorem ipsum dolor sit amet consectetur" },
              {
                time: "17 May",
                desc: "Debitis nesciunt voluptatum dicta reprehenderi",
              },
              { time: "13 May", desc: "Accusamus voluptatibus voluptas." },
            ].map((act, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1">
                  <FiCheckCircle className="text-teal-500" size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{act.time}</p>
                  <p className="text-xs text-slate-400 mt-1">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Channels */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Marketing Chanel</h3>
          <div className="space-y-4">
            {[
              { label: "Facebook", val: 15 },
              { label: "Instagram", val: 65 },
              { label: "Google", val: 51 },
              { label: "Twitter", val: 80 },
            ].map((chan, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span>{chan.label}</span>
                  <span className="text-slate-400">{chan.val}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#088178] h-full"
                    style={{ width: `${chan.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
