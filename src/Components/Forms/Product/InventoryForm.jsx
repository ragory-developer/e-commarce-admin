"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useFormState } from "../../Context/FormContext";

const InventoryForm = ({ onNext }) => {
  const { formData, saveTabData } = useFormState();

  const variationsArray = formData.variations?.variations || [];
  const hasVariants =
    Array.isArray(variationsArray) &&
    variationsArray.some((v) => v.labels?.some((l) => l.value?.trim() !== ""));

  const { register, handleSubmit } = useForm({
    defaultValues: formData.inventory || {
      sku: "",
      quantity: "",
      stock: "",
    },
  });

  const onSubmit = (data) => {
    saveTabData("inventory", data);
    onNext();
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="text-gray-700 font-medium">Inventory</h2>
      </div>

      {hasVariants && (
        <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-blue-700 text-sm">
          Inventory is managed in the <strong>Variations</strong> tab.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-3">
        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            SKU
          </label>
          <input
            type="text"
            disabled={hasVariants}
            {...register("sku")}
            className={`input input-bordered w-full h-10 focus:outline-teal-500 ${
              hasVariants ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            Quantity
          </label>
          <input
            type="number"
            disabled={hasVariants}
            {...register("quantity")}
            className={`input input-bordered w-full h-10 focus:outline-teal-500 ${
              hasVariants ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            Stock Availability
          </label>
          <select
            disabled={hasVariants}
            {...register("stock")}
            className={`select select-bordered w-full h-10 min-h-0 font-normal focus:outline-teal-500 ${
              hasVariants ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="btn bg-primary hover:bg-teal-700 text-white border-none px-8 capitalize"
          >
            Continue to next
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;
