"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Truck,
  MapPin,
  Calendar,
  Printer,
  ChevronDown,
} from "lucide-react";

export default function OrderDetail() {
  const tableRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Only run in the browser
    if (typeof window !== "undefined") {
      const initTable = async () => {
        // 2. Dynamically import jQuery and DataTables
        const jQuery = (await import("jquery")).default;
        window.jQuery = jQuery;
        window.$ = jQuery;
        await import("datatables.net-dt");

        // 3. Initialize DataTables
        if (tableRef.current) {
          const table = jQuery(tableRef.current).DataTable({
            paging: false,
            searching: false,
            info: false,
            ordering: false,
            responsive: true,
            destroy: true,
          });
          setIsLoaded(true);
          return table;
        }
      };

      let dt;
      initTable().then((table) => {
        dt = table;
      });

      return () => {
        if (dt) dt.destroy();
      };
    }
  }, []);

  const products = [
    {
      id: 1,
      name: "T-shirt blue, XXL size",
      price: 44.25,
      qty: 2,
      total: 99.5,
    },
    { id: 2, name: "Winter jacket for men", price: 7.5, qty: 2, total: 15.0 },
    { id: 3, name: "Jeans wear for men", price: 43.5, qty: 2, total: 102.04 },
    {
      id: 4,
      name: "Product name color and size",
      price: 99.0,
      qty: 3,
      total: 297.0,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 text-slate-700">
      {/* Load DataTables CSS via CDN to avoid module resolve issues */}
      <link
        rel="stylesheet"
        href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css"
      />

      <style jsx global>{`
        .dataTables_wrapper .dataTables_length,
        .dataTables_wrapper .dataTables_filter {
          display: none;
        }
        table.dataTable.no-footer {
          border-bottom: 1px solid #eee !important;
        }
        .dataTables_wrapper {
          padding: 0 !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-50">
          <h1 className="text-2xl font-semibold text-slate-800">
            Order detail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Details for Order ID: 3453012
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-3 bg-[#f8fafc] border-b border-gray-100 gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar size={16} />
            <span className="font-medium">Wed, Aug 13, 2026, 4:34PM</span>
            <span className="text-xs text-gray-400 ml-2 font-normal">
              Order ID: 3453012
            </span>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none pr-10 cursor-pointer">
                <option>Change status</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
            <button className="bg-[#0d9488] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-teal-700 transition-colors">
              Save
            </button>
            <button className="bg-slate-500 text-white p-2 rounded-md hover:bg-slate-600 transition-colors">
              <Printer size={18} />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 border-b border-gray-50">
          <InfoSection
            icon={<User size={20} />}
            title="Customer"
            lines={["John Alexander", "alex@example.com", "+998 99 22123456"]}
            linkText="View profile"
          />
          <InfoSection
            icon={<Truck size={20} />}
            title="Order info"
            lines={[
              "Shipping: Fargo express",
              "Pay method: card",
              "Status: new",
            ]}
            linkText="Download info"
          />
          <InfoSection
            icon={<MapPin size={20} />}
            title="Deliver to"
            lines={[
              "City: Tashkent, Uzbekistan",
              "Block A, House 123, Floor 2",
              "Po Box 10000",
            ]}
            linkText="View profile"
          />
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8">
          {/* Table */}
          <div className="lg:col-span-8 overflow-x-auto">
            <table
              ref={tableRef}
              className={`w-full text-sm ${!isLoaded ? "opacity-0" : "opacity-100"}`}
            >
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 uppercase text-[11px] tracking-wider">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Unit Price</th>
                  <th className="pb-4">Quantity</th>
                  <th className="pb-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 shrink-0" />
                      <span className="font-medium text-slate-700">
                        {item.name}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-4 text-gray-500">{item.qty}</td>
                    <td className="py-4 text-right font-semibold text-slate-800">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotals */}
            <div className="mt-8 flex flex-col items-end space-y-2 border-t border-gray-50 pt-6">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Subtotal:</span>
                  <span className="font-bold text-slate-700">$973.35</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">
                    Shipping cost:
                  </span>
                  <span className="font-bold text-slate-700">$10.00</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-lg font-bold text-slate-800">
                    Grand total:
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    $983.00
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                    Status:
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                    Payment done
                  </span>
                </div>
              </div>
            </div>

            <button className="mt-10 bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-3 rounded font-bold text-sm shadow-sm transition-all">
              View Order Tracking
            </button>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#f8fafc] p-6 rounded-lg border border-gray-200/60">
              <h3 className="font-bold text-sm text-slate-800 mb-5">
                Payment info
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-red-500 border border-white" />
                  <div className="w-6 h-6 rounded-full bg-yellow-500 border border-white opacity-80" />
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  Master Card **** **** 4768
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Business name: Grand Market LLC</p>
                <p>Phone: +1 (800) 555-154-52</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-bold text-sm text-slate-800">Notes</label>
              <textarea
                className="w-full min-h-[160px] p-4 bg-[#f8fafc] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm resize-none"
                placeholder="Type some note"
              />
              <button className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-2 rounded font-bold text-sm transition-all shadow-sm">
                Save note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ icon, title, lines, linkText }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 shrink-0 rounded-full bg-[#ccfbf1]/50 flex items-center justify-center text-[#0d9488] border border-[#ccfbf1]/50">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-800">{title}</h3>
        {lines.map((text, i) => (
          <p key={i} className="text-sm text-gray-500 leading-tight">
            {text}
          </p>
        ))}
        <button className="text-[#0d9488] text-sm font-bold mt-2 hover:underline block">
          {linkText}
        </button>
      </div>
    </div>
  );
}
