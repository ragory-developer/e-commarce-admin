// "use client";

import React from "react";
import {
  Calendar,
  Printer,
  Image as ImageIcon,
  ChevronDown,
  ShoppingCart,
  Settings,
  Search,
  Truck,
  CheckCircle2,
} from "lucide-react";

export default function OrderTracking() {
  const steps = [
    {
      title: "Confirmed Order",
      date: "15 March 2026",
      icon: <ShoppingCart size={20} />,
      status: "completed",
    },
    {
      title: "Processing Order",
      date: "16 March 2026",
      icon: <Settings size={20} />,
      status: "completed",
    },
    {
      title: "Quality Check",
      date: "17 March 2026",
      icon: <Search size={20} />,
      status: "completed",
    },
    {
      title: "Product Dispatched",
      date: "18 March 2026",
      icon: <Truck size={20} />,
      status: "current",
    },
    {
      title: "Product Delivered",
      date: "20 March 2026",
      icon: <CheckCircle2 size={20} />,
      status: "upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-700">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden pb-12">
        {/* Header */}
        <div className="p-6 border-b border-gray-50">
          <h1 className="text-2xl font-bold text-slate-800">Order Tracking</h1>
          <p className="text-sm text-slate-400">
            Details for Order ID: 3453012
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-[#fcfcfc] border-b border-gray-100 gap-4">
          <div className="flex flex-col text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm font-semibold">
                Wed, Aug 13, 2026, 4:34PM
              </span>
            </div>
            <span className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">
              Order ID: 3453012
            </span>
            <span className="text-xs text-slate-500 mt-1 italic font-medium">
              Your order has been dispatched
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none pr-10 cursor-pointer">
                <option>Change status</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
            <button className="bg-[#0d9488] text-white px-5 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-teal-700 transition-all">
              <ImageIcon size={16} /> Screenshot
            </button>
            <button className="bg-slate-500 text-white px-5 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-slate-600 transition-all">
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        {/* Stepper Progress Section */}
        <div className="px-10 py-20 relative">
          <div className="flex items-center justify-between relative z-10 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center relative w-full"
              >
                {/* Step Circle */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all
                  ${
                    step.status === "completed"
                      ? "bg-[#0d9488] border-[#0d9488] text-white"
                      : step.status === "current"
                        ? "bg-white border-[#0d9488] text-[#0d9488]"
                        : "bg-white border-gray-100 text-gray-300"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Labels */}
                <div className="text-center mt-4 absolute -bottom-16 w-32">
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1">{step.date}</p>
                </div>

                {/* Connecting Line (SVG) */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-7 left-[50%] w-full h-[3px] -z-10 bg-gray-100">
                    <div
                      className={`h-full transition-all duration-500 ${step.status === "completed" ? "bg-[#0d9488] w-full" : "w-0"}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-20 pt-24 pb-12 mt-4 text-center">
          <InfoBox
            title="Customer"
            lines={["John Alexander", "alex@example.com", "+998 99 22123456"]}
            linkText="View profile"
          />
          <InfoBox
            title="Order info"
            lines={[
              "Shipping: Fargo express",
              "Pay method: card",
              "Status: new",
            ]}
            linkText="Download info"
          />
          <InfoBox
            title="Deliver to"
            lines={[
              "City: Tashkent, Uzbekistan",
              "Block A, House 123, Floor 2",
              "Po Box 10000",
            ]}
            linkText="View profile"
          />
        </div>

        {/* Footer Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-[#0d9488] text-white px-10 py-3 rounded text-sm font-bold shadow-sm hover:bg-teal-700 transition-all uppercase tracking-wide">
            View Order Details
          </button>
        </div>
      </div>

      {/* Page Footer Text */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mt-6 px-2 text-[10px] text-gray-400">
        <p>© 2026, Evans - HTML Ecommerce Template</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
}

function InfoBox({ title, lines, linkText }) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold text-sm text-slate-800 mb-3">{title}</h3>
      {lines.map((line, i) => (
        <p
          key={i}
          className="text-xs text-gray-500 leading-relaxed tracking-tight"
        >
          {line}
        </p>
      ))}
      <button className="text-[#0d9488] text-[11px] font-bold mt-2 hover:underline">
        {linkText}
      </button>
    </div>
  );
}
