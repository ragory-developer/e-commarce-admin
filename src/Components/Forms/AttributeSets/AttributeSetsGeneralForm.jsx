"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAttibutesSetsStore } from "@/store/useAttributesSetsStore";

const AttributeSetsGeneralForm = () => {
const { createAttributesSets } = useAttibutesSetsStore();

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

  const onSubmit = (data) => {
    console.log("Form submitted with name:", data);
    // Handle form submission logic here
    const result = createAttributesSets(data);
    if (result) {
      // Clear the form on successful submission
      toast.success("Attribute set created successfully!");
      reset();
    } else {
      toast.error("Failed to create attribute set. Please try again.");
    }
    // Optionally reset the form after successful submission
  };

  return (
    <div className="w-full bg-white font-sans border border-gray-200 rounded-sm shadow-sm">
      {/* Header Section */}
      <div className="border-b border-gray-200 py-3 px-6">
        <h2 className="text-gray-600 text-lg font-medium">General</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          {/* Name Field */}
          <div className="flex flex-col md:flex-row md:items-start mb-6">
            <label className="md:w-[200px] text-gray-700 text-sm font-normal mb-2 md:mb-0 pt-1">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                {...register("name", { required: "Campaign name is required" })}
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
          </div>

          {/* Save Button - Expert Alignment */}
          <div className="flex flex-col md:flex-row md:items-start">
            {/* Empty div to match the label width (creates the 2nd row alignment) */}
            <div className="md:w-[200px] hidden md:block"></div>

            {/* Button container aligned with input field */}
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
