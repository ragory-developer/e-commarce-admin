"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { FiSearch } from "react-icons/fi";

import { useCategoryStore } from "@/store/useCategoryStore";
import CategoryForm from "@/Components/Forms/Category/CategoryForm";
import { useMediaStore } from "@/store/useMediaStore";
import TreeView from "@/Components/TreeView/TreeView";

// ─── Header ──────────────────────────────────────────────────────────────────
const CategoryHeader = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-bold text-slate-800">Categories</h1>
    </div>
    <div className="relative w-full md:w-80">
      <input
        type="text"
        placeholder="Search Categories"
        className="input input-bordered w-full bg-white pr-10 focus:outline-teal-600"
      />
      <FiSearch className="absolute right-3 top-4 text-gray-400" />
    </div>
  </div>
);

// ─── Category Table Panel (now hosts the TreeView) ────────────────────────────
const CategoryTable = ({ parentId, setParentId }) => (
  <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-slate-700">Category Tree</h2>
      <span className="badge badge-ghost text-slate-400 text-xs normal-case border-slate-200">
        Hierarchical view
      </span>
    </div>

    <div className="border-t border-slate-100 mb-4" />

    <div className="flex-1 min-h-0" style={{ minHeight: 480 }}>
      <TreeView parentId={parentId} setParentId={setParentId} />
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const CategoriesPage = () => {
  const { categories, fetchCategoriesTree } = useCategoryStore();
  const { fetchAllMediaFiles } = useMediaStore();
  const [parentId, setParentId] = useState(null)
  useEffect(() => {
    fetchCategoriesTree();
  }, [fetchCategoriesTree]);

  useEffect(() => {
    (async () => {
      await fetchAllMediaFiles();
    })();
  }, [fetchAllMediaFiles]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-700">
      <ToastContainer position="top-right" autoClose={3000} />
      <CategoryHeader />
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <CategoryForm setParentId={setParentId} parentId={parentId} />
        <CategoryTable setParentId={setParentId} parentId={parentId} />
      </div>
    </div>
  );
};

export default CategoriesPage;