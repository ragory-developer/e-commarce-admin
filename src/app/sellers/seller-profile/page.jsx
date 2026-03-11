import React from "react";
import { FiExternalLink, FiChevronDown, FiArrowLeft } from "react-icons/fi";
import products from "@/Data/products.json";

const SellerProfile = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-700">
      {/* Top Back Link */}
      <div className="p-4">
        <button className="flex items-center gap-1 text-[#00b09b] text-sm font-medium hover:underline">
          <FiArrowLeft /> Go back
        </button>
      </div>

      {/* Header Banner & Profile Section */}
      <div className="mx-4 md:mx-8 mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Blue Banner */}
        <div className="h-32 md:h-48 bg-[#0066ff] w-full"></div>

        {/* Profile Info Row */}
        <div className="relative px-6 pb-6">
          {/* Logo Overlap */}
          <div className="absolute -top-12 left-6 w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg shadow-md border border-gray-100 flex items-center justify-center p-4">
            <img
              src="/images/logo-placeholder.png"
              alt="Cocorico Logo"
              className="object-contain"
            />
          </div>

          {/* Shop Name and Actions */}
          <div className="pt-4 ml-32 md:ml-40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Cocorico sports shop
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                3891 Ranchview Dr. Richardson, California 62639
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm bg-white border-gray-200 text-slate-600 hover:bg-gray-50 normal-case font-medium flex items-center gap-2">
                Actions <FiChevronDown />
              </button>
              <button className="btn btn-sm bg-[#007b70] hover:bg-[#005f56] text-white border-none normal-case font-medium flex items-center gap-2">
                View live <FiExternalLink />
              </button>
            </div>
          </div>

          {/* Stats and Contact Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-gray-50">
            {/* Stats */}
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Total sales:
                </p>
                <p className="text-lg font-bold text-[#00b09b]">238</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Revenue:
                </p>
                <p className="text-lg font-bold text-[#00b09b]">$2380</p>
              </div>
            </div>

            {/* Contacts */}
            <div className="md:col-span-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                Contacts
              </p>
              <p className="text-xs text-slate-600 font-medium">
                Manager: Jerome Bell
              </p>
              <p className="text-xs text-[#00b09b] mt-1 italic">
                info@example.com
              </p>
              <p className="text-xs text-slate-500 mt-1">
                (229) 555-0109, (808) 555-0111
              </p>
            </div>

            {/* Address */}
            <div className="md:col-span-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                Address
              </p>
              <p className="text-xs text-slate-600">Country: California</p>
              <p className="text-xs text-slate-600 mt-1">
                Address: Ranchview Dr. Richardson
              </p>
              <p className="text-xs text-slate-600 mt-1">Postal code: 62639</p>
            </div>

            {/* Map Placeholder */}
            <div className="h-24 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-100 relative group">
              <img
                src="/images/map-placeholder.png"
                alt="Map"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              <div className="absolute bottom-1 right-1 bg-white px-1 rounded text-[8px] font-bold text-slate-400">
                Leaflet
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4 md:px-8 pb-10">
        <h2 className="text-lg font-bold text-slate-700 mb-6">
          Products by seller
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="aspect-square bg-white flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 border-t border-gray-50 bg-[#f9fafb]">
                <h3 className="text-[11px] text-slate-400 truncate">
                  {product.name || "Product name"}
                </h3>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  ${product.price || "179.00"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
