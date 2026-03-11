"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCalendar } from "react-icons/hi";
import { useFormState } from "../../Context/FormContext";

const PricingForm = ({ onNext }) => {
  const { formData, saveTabData } = useFormState();

  const variationsArray = formData.variations?.variations || [];
  const hasVariants =
    Array.isArray(variationsArray) &&
    variationsArray.some((v) => v.labels?.some((l) => l.value?.trim() !== ""));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData.pricing || {
      price: "",
      specialPrice: "",
      type: "",
      start: "",
      end: "",
    },
  });

  const onSubmit = (data) => {
    saveTabData("pricing", data);
    onNext();
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-gray-700 font-medium">Pricing</h2>
      </div>

      {hasVariants && (
        <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-blue-700 text-sm flex items-center gap-2">
          <span>
            Pricing is managed in the <strong>Variations</strong> tab because
            this product has variants.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              step="0.01"
              disabled={hasVariants}
              {...register("price", {
                required: !hasVariants ? "Price is required" : false,
              })}
              className={`input input-bordered rounded-l-none w-full h-10 focus:outline-teal-500 ${
                errors.price ? "border-red-500" : ""
              } ${hasVariants ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
          {errors.price && (
            <span className="text-red-500 text-xs mt-1">
              {errors.price.message}
            </span>
          )}
        </div>

        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            Special Price
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              step="0.01"
              disabled={hasVariants}
              {...register("specialPrice")}
              className={`input input-bordered rounded-l-none w-full h-10 focus:outline-teal-500 ${
                hasVariants ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            Special Price Type
          </label>
          <select
            disabled={hasVariants}
            {...register("type")}
            className={`select select-bordered w-full h-10 min-h-0 font-normal focus:outline-teal-500 ${
              hasVariants ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label-text mb-2 text-gray-600 font-medium">
              Special Price Start
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <HiOutlineCalendar />
              </span>
              <input
                type="date"
                disabled={hasVariants}
                {...register("start")}
                className={`input input-bordered rounded-l-none w-full h-10 focus:outline-teal-500 ${
                  hasVariants ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label-text mb-2 text-gray-600 font-medium">
              Special Price End
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <HiOutlineCalendar />
              </span>
              <input
                type="date"
                disabled={hasVariants}
                {...register("end")}
                className={`input input-bordered rounded-l-none w-full h-10 focus:outline-teal-500 ${
                  hasVariants ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>
        {/* Tax Class */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">
              Tax Class
            </span>
          </label>
          <select
            {...register("taxClass")}
            className="select select-bordered w-full h-11 focus:outline-teal-500 font-normal"
          >
            <option value="">Please Select</option>
            <option value="standard">Standard Tax</option>
            <option value="exempt">Tax Exempt</option>
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

export default PricingForm;
