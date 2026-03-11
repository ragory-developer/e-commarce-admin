"use client";
import { useTagsStore } from "@/store/useTagsStore";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { slugify } from "@/app/lib/helper/helper";
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


    const payload = {
      name: data.name,
      slug: slugify(data.name),
      translation: {
        bn: data.nameTrans || "no translation added",
      },
    };

    const result = await createProductTags(payload);
    console.log(result.statusCode)
    if (result.statusCode === 201) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }

    // If the result indicates success (adjust based on your actual API response)


  };

  return (
    <div className="w-full bg-white font-sans border border-gray-200 rounded-sm shadow-sm">
      {/* Header Section */}
      <div className="border-b border-gray-200 py-3 px-6">
        <h2 className="text-gray-600 text-lg font-medium">General</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6">
          {/* Two-column grid for fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full border rounded-sm px-3 py-2.5 focus:outline-none focus:border-[#088178] focus:ring-1 focus:ring-[#088178] bg-white transition-all shadow-inner ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter name"
                aria-invalid={errors.name ? "true" : "false"}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
              <p className="text-gray-500 text-xs">Enter tags for this item</p>
            </div>

            {/* Name Translation Field */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">
                Name Translation
              </label>
              <input
                type="text"
                {...register("nameTrans")}
                className="w-full border border-gray-300 rounded-sm px-3 py-2.5 focus:outline-none focus:border-[#088178] focus:ring-1 focus:ring-[#088178] bg-white transition-all shadow-inner"
                placeholder="Enter translation"
                disabled={isSubmitting}
              />
              <p className="text-gray-500 text-xs">Enter Bangla tags name</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#088178] hover:bg-[#066a62] text-white hover:shadow-md"
                }`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TagsGeneralForm;
