"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { slugify } from "@/app/lib/helper/helper";
import { useAttributeSetsStore } from "@/store/useAttributeSetsStore";


const AttributeSetsGeneralForm = () => {
  const { createAttributeSets } = useAttributeSetsStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      slug: slugify(data.name),
      translation: {
        bn: {
          name: data.nameTranslation,
        },
      },
    };
    if (payload) {
      const result = await createAttributeSets(payload);
      console.log(result);
      if (result) toast.success(result.message);
    } else {
      toast.error("No Tags are given !");
    }
  };

  return (
    <div className="w-full bg-white font-sans border border-gray-200 rounded-sm shadow-sm">
      {/* Header Section */}
      <div className="border-b border-gray-200 py-3 px-6">
        <h2 className="text-gray-600 text-lg font-medium">General</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          {/* Name & Translation Field */}
          <div className="flex flex-col md:flex-row md:items-start mb-6">
            <label className="md:w-[200px] text-gray-700 text-sm font-normal mb-2 md:mb-0 pt-1">
              Campaign Name <span className="text-red-500">*</span>
            </label>

            {/* Container for the two inputs - responsive row/column */}
            <div className="flex-1 flex flex-col md:flex-row gap-4">
              {/* Original Name Input */}
              <div className="flex-1">
                <input
                  type="text"
                  {...register("name", {
                    required: "Campaign name is required",
                  })}
                  className={`w-full border rounded-[4px] px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all shadow-inner ${
                    errors.name ? "border-red-500" : "border-[#CED4DA]"
                  }`}
                  placeholder="Enter name"
                  aria-invalid={errors.name ? "true" : "false"}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Translation Input (new) */}
              <div className="flex-1">
                <input
                  type="text"
                  {...register("nameTranslation")} // optional field
                  className={`w-full border rounded-[4px] px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all shadow-inner ${
                    errors.nameTranslation
                      ? "border-red-500"
                      : "border-[#CED4DA]"
                  }`}
                  placeholder="Enter translation (optional)"
                  aria-invalid={errors.nameTranslation ? "true" : "false"}
                  disabled={isSubmitting}
                />
                {errors.nameTranslation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nameTranslation.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save Button - alignment unchanged */}
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="md:w-[200px] hidden md:block"></div>
            <div className="flex-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#088178] hover:bg-[#066a62] text-white hover:shadow"
                }`}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};


export default AttributeSetsGeneralForm;