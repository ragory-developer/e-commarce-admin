import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import MediaModal from "@/Components/Modals/MediaModal";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useMediaStore } from "@/store/useMediaStore";
import { toast } from "react-toastify";
import { createCategoryRequest } from "@/services/category.service";
import { slugify } from "@/lib/helper/helper";

const getPreviewUrl = (id, allMedia) => {
  if (!id || !allMedia) return "";
  const media = allMedia.find((m) => m.id === id);
  return media?.storageUrl || "";
};

const CategoryForm = ({ category = null, onSuccess, parentId, setParentId }) => {
  const { createCategory, updateCategory } = useCategoryStore();
  const { allMediaFiles, fetchAllMediaFiles } = useMediaStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null); // 'image', 'icon'
  const { fetchCategoriesTree } = useCategoryStore()
  useEffect(() => {
    if (!allMediaFiles) {
      fetchAllMediaFiles();
    }
  }, [allMediaFiles, fetchAllMediaFiles]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: category
      ? {
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        parentId: category.parentId || "",
        image: category.image || "",
        icon: category.icon || "",
        position: category.position || 0,
        depth: category.depth || 0,
        isActive: category.isActive ?? true,
        seo: {
          metaTitle: category.seo?.metaTitle || "",
          metaDescription: category.seo?.metaDescription || "",
        },
      }
      : {
        name: "",
        slug: "",
        description: "",
        parentId: parentId || "",
        image: "",
        icon: "",
        position: 0,
        depth: 0,
        isActive: true,
        seo: {
          metaTitle: "",
          metaDescription: "",
        },
      },
  });

  // Auto‑generate slug from name (only for new categories)
  const name = watch("name");
  useEffect(() => {
    if (!category && name) {
      setValue("slug", slugify(name), { shouldValidate: true });
    }
  }, [name, setValue, category]);

  // Sync external parentId with form field (only for new categories)
  useEffect(() => {
    if (!category && parentId !== undefined) {
      setValue("parentId", parentId, { shouldValidate: true });
    }
  }, [parentId, setValue, category]);

  const watchImage = watch("image");
  const watchIcon = watch("icon");

  const openMediaModal = (field) => {
    setCurrentField(field);
    setModalOpen(true);
  };

  const handleMediaInsert = (media) => {
    if (currentField) {
      setValue(currentField, media.id, { shouldValidate: true });
    }
    setModalOpen(false);
  };

  const onSubmit = async (data) => {

    try {
      const payload = { ...data };
      const result = await createCategoryRequest(payload);
      await fetchCategoriesTree()
      console.log(result);

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Basic Information
          </h3>

          {/* Name */}
          <div>
            <label className="label font-semibold text-slate-600 pb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Electronics"
              className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.name ? "border-red-500" : ""
                }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="label font-semibold text-slate-600 pb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. electronics"
              className={`input input-bordered w-full bg-slate-50 focus:bg-white ${errors.slug ? "border-red-500" : ""
                }`}
              {...register("slug", { required: "Slug is required" })}
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="label font-semibold text-slate-600 pb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-32 bg-slate-50 w-full focus:bg-white ${errors.description ? "border-red-500" : ""
                }`}
              placeholder="Describe the category"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Active checkbox */}
          <div className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              id="isActive"
              className="checkbox checkbox-primary"
              {...register("isActive")}
            />
            <label htmlFor="isActive" className="label font-semibold text-slate-600">
              Active
            </label>
          </div>

          {/* Parent ID (now synced with tree selection) */}
          <div>
            <label className="label font-semibold text-slate-600 pb-1">
              Parent ID
            </label>
            <input
              type="text"
              placeholder="Parent category ID (optional)"
              className="input input-bordered w-full bg-slate-50 focus:bg-white"
              {...register("parentId")}
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Media
          </h3>

          {/* Image */}
          <div>
            <label className="label font-semibold text-slate-600 pb-1">Image</label>
            <div className="flex items-center gap-3">
              {watchImage && (
                <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                  <img
                    src={getPreviewUrl(watchImage, allMediaFiles) || "https://via.placeholder.com/48?text=Error"}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/48?text=Error";
                    }}
                  />
                </div>
              )}
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Media ID"
                  className="input input-bordered w-full bg-slate-50 focus:bg-white"
                  {...register("image")}
                />
                <button
                  type="button"
                  onClick={() => openMediaModal("image")}
                  className="btn btn-outline btn-primary whitespace-nowrap"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="label font-semibold text-slate-600 pb-1">Icon</label>
            <div className="flex items-center gap-3">
              {watchIcon && (
                <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src={getPreviewUrl(watchIcon, allMediaFiles) || "https://via.placeholder.com/48?text=Error"}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/48?text=Error";
                    }}
                  />
                </div>
              )}
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Icon ID"
                  className="input input-bordered w-full bg-slate-50 focus:bg-white"
                  {...register("icon")}
                />
                <button
                  type="button"
                  onClick={() => openMediaModal("icon")}
                  className="btn btn-outline btn-primary whitespace-nowrap"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            SEO
          </h3>

          <div>
            <label className="label font-semibold text-slate-600 pb-1">Meta Title</label>
            <input
              type="text"
              placeholder="Meta title for search engines"
              className="input input-bordered w-full bg-slate-50 focus:bg-white"
              {...register("seo.metaTitle")}
            />
          </div>

          <div>
            <label className="label font-semibold text-slate-600 pb-1">Meta Description</label>
            <textarea
              className="textarea textarea-bordered h-20 bg-slate-50 w-full focus:bg-white"
              placeholder="Brief description for search results"
              {...register("seo.metaDescription")}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn bg-[#007b70] hover:bg-[#005f56] text-white border-none w-full mt-6 normal-case text-lg shadow-md disabled:opacity-50"
        >
          {isSubmitting
            ? category
              ? "Updating..."
              : "Creating..."
            : category
              ? "Update Category"
              : "Create Category"}
        </button>
      </form>

      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onInsert={handleMediaInsert}
      />
    </div>
  );
};

export default CategoryForm;