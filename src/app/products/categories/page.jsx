"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import {
  FiSearch,
  FiMoreHorizontal,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { useCategoryStore } from "@/store/useCategoryStore";
import CategoryForm from "@/Components/Forms/Category/CategoryForm";
import { useMediaStore } from "@/store/useMediaStore";

// ------------------- Helper: Flatten nested categories -------------------
const flattenCategories = (categories, level = 0) => {
  return categories.reduce((acc, cat) => {
    const flat = { ...cat, level };
    acc.push(flat);

    if (cat.children?.length) {
      acc.push(...flattenCategories(cat.children, level + 1));
    }
    return acc;
  }, []);
};


// ------------------- Header Component -------------------
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


// ------------------- Table Row Actions Dropdown -------------------
const CategoryActionsDropdown = () => (
  <div className="dropdown dropdown-left dropdown-end">
    <label
      tabIndex={0}
      className="btn btn-ghost btn-sm btn-square border border-slate-200 bg-white hover:bg-slate-100 transition-colors duration-150"
      aria-label="Category actions">
      <FiMoreHorizontal size={18} className="text-slate-500" />
    </label>
    <ul
      tabIndex={0}
      className="dropdown-content z-[100] menu p-2 shadow-xl bg-white rounded-xl w-48 border border-slate-200 mt-2">
      <li>
        <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors">
          <FiEye className="text-blue-500" size={16} /> View Details
        </button>
      </li>
      <li>
        <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors">
          <FiEdit2 className="text-amber-500" size={16} /> Edit Category
        </button>
      </li>
      <div className="divider my-1 opacity-50" />
      <li>
        <button className="flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <FiTrash2 size={16} /> Delete
        </button>
      </li>
    </ul>
  </div>
);

// ------------------- Table Component -------------------
const CategoryTable = ({ categories }) => {
  return (
    <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-6 overflow-visible">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="text-slate-400 uppercase text-xs">
            <tr className="border-b border-gray-100">
              <th className="bg-white">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                />
              </th>
              <th className="bg-white font-bold">ID</th>
              <th className="bg-white font-bold">Image</th>
              <th className="bg-white font-bold">Name</th>
              <th className="bg-white font-bold">Description</th>
              <th className="bg-white font-bold">Slug</th>
              <th className="bg-white font-bold">Order</th>
              <th className="bg-white text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="group hover:bg-slate-50/80 border-b border-slate-100 last:border-0 transition-colors duration-150">
                <td className="pl-4">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary rounded"
                      aria-label={`Select category ${cat.name}`}
                    />
                  </div>
                </td>
                <td className="font-mono text-xs font-medium text-slate-500">
                  #{cat.id}
                </td>
                <td>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-50"
                    loading="lazy"
                  />
                </td>
                <td className="font-semibold text-slate-800">{cat.name}</td>
                <td className="max-w-[160px]">
                  <p
                    className="truncate text-slate-500"
                    title={cat.description}>
                    {cat.description}
                  </p>
                </td>
                <td>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                    {cat.slug}
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {cat.order}
                  </span>
                </td>
                <td className="text-right pr-4">
                  <CategoryActionsDropdown />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ------------------- Main Page -------------------
const CategoriesPage = () => {
  const { categories, fetchCategoriesTree } = useCategoryStore();
  const { fetchAllMediaFiles } = useMediaStore()

  useEffect(() => {
    fetchCategoriesTree();
  }, [fetchCategoriesTree]);

  const flatCategories = useMemo(() => {
    if (!categories) return [];
    return flattenCategories(categories);
  }, [categories]);

  useEffect(() => {
    (async () => {

      await fetchAllMediaFiles();
    })
  }, [fetchAllMediaFiles]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-700">
      <CategoryHeader />
      <div className="flex flex-col lg:flex-row gap-8">
        <CategoryForm />
        <CategoryTable categories={categories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
