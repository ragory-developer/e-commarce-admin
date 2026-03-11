"use client";
import { useTagsStore } from "@/store/useTagsStore";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const TagsGeneralForm = () => {
  const { createProductTags } = useTagsStore();
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
    try {
      // Assume createProductTags might be async
      const result = await createProductTags(data);

      // If the result indicates success (adjust based on your actual API response)
      if (result?.success || result === true) {
        toast.success("Tag created successfully!");
        reset(); // Clear the form
      } else {
        // If result contains an error message
        const errorMessage =
          result?.message || "Failed to create tag. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      // Handle unexpected errors (network issues, etc.)
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
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
          {/* Name Field */}
          <div className="flex flex-col md:flex-row md:items-start mb-6">
            <label className="md:w-50 text-gray-700 text-sm font-normal mb-2 md:mb-0 pt-1">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                {...register("name", {
                  required: "Name is required", // Custom error message
                })}
                className={`w-full border rounded-sm px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all shadow-inner ${
                  errors.name ? "border-red-500" : "border-[#CED4DA]"
                }`}
                placeholder="Enter name"
                aria-invalid={errors.name ? "true" : "false"}
                disabled={isSubmitting} // Disable during submission
              />
              {/* Error message */}
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
              {/* Helper text */}
              <p className="text-gray-500 text-xs mt-2">
                Enter tags for this item
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
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
      </form>
    </div>
  );
};

export default TagsGeneralForm;
