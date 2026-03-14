import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // If you have a real MediaModal, import it; otherwise use the mock modal below
import MediaModal from "@/Components/Modals/MediaModal";

// ---------- MOCK DATA (replace with real API calls later) ----------
// Mock categories tree (for parent dropdown)
const mockCategoriesTree = [
  {
    id: "cat_1",
    name: "Electronics",
    children: [
      { id: "cat_2", name: "Laptops", children: [] },
      { id: "cat_3", name: "Phones", children: [] },
    ],
  },
  {
    id: "cat_4",
    name: "Fashion",
    children: [
      { id: "cat_5", name: "Men", children: [] },
      { id: "cat_6", name: "Women", children: [] },
    ],
  },
  {
    id: "cat_7",
    name: "Home & Garden",
    children: [],
  },
];

// Mock media items (for preview and modal)
const mockMedia = [
  {
    id: "media_1",
    url: "https://via.placeholder.com/150/088178?text=Electronics",
    name: "Electronics",
  },
  {
    id: "media_2",
    url: "https://via.placeholder.com/150/007b70?text=Fashion",
    name: "Fashion",
  },
  {
    id: "media_3",
    url: "https://via.placeholder.com/150/ff6b6b?text=Home",
    name: "Home",
  },
  {
    id: "media_4",
    url: "https://via.placeholder.com/150/4ecdc4?text=Books",
    name: "Books",
  },
];
// ---------- END MOCK DATA ----------

const CategoryForm = () => {
  // Flatten categories for tree‑view dropdown
  const [flatCategories, setFlatCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null); // 'image' or 'icon'

  // Mock function to simulate fetching categories (replace with real fetch)
  const fetchCategoriesTree = async () => {
    // In a real app you would call your API and update state
    return mockCategoriesTree;
  };

  // Mock function to simulate creating a category (replace with real API call)
  const createCategories = async (data) => {
    console.log("Creating category with data:", data);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  };

  // Flatten categories tree on mount
  useEffect(() => {
    const loadCategories = async () => {
      const tree = await fetchCategoriesTree();
      const flatten = (items, level = 0) => {
        return items.reduce((acc, item) => {
          acc.push({ ...item, level });
          if (item.children && item.children.length) {
            acc.push(...flatten(item.children, level + 1));
          }
          return acc;
        }, []);
      };
      setFlatCategories(flatten(tree));
    };
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
      image: "",
      icon: "",
      position: 0,
      isActive: true,
    },
  });

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
    const toastId = toast.loading("Creating category...");
    try {
      await createCategories(data);
      toast.success("Category created successfully!", { id: toastId });
      reset();
      // Re‑fetch categories if needed (to show new category in parent dropdown)
      const tree = await fetchCategoriesTree();
      const flatten = (items, level = 0) => {
        return items.reduce((acc, item) => {
          acc.push({ ...item, level });
          if (item.children && item.children.length) {
            acc.push(...flatten(item.children, level + 1));
          }
          return acc;
        }, []);
      };
      setFlatCategories(flatten(tree));
    } catch (error) {
      toast.error(error.message || "Failed to create category", {
        id: toastId,
      });
    }
  };

  // Helper to get preview URL from media ID
  const getPreviewUrl = (mediaId) => {
    const media = mockMedia.find((m) => m.id === mediaId);
    return media ? media.url : "https://via.placeholder.com/48?text=No+Image";
  };

  return (
    <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label font-semibold text-slate-600 pb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Electronics"
            className={`input input-bordered w-full bg-slate-50 focus:bg-white ${
              errors.name ? "border-red-500" : ""
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
            className={`input input-bordered w-full bg-slate-50 focus:bg-white ${
              errors.slug ? "border-red-500" : ""
            }`}
            {...register("slug", { required: "Slug is required" })}
          />
          {errors.slug && (
            <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
          )}
        </div>

        {/* Parent Category (Tree View) */}
        <div>
          <label className="label font-semibold text-slate-600 pb-1">
            Parent Category
          </label>
          <select
            className={`select select-bordered w-full bg-slate-50 font-normal ${
              errors.parentId ? "border-red-500" : ""
            }`}
            {...register("parentId")}>
            <option value="">None (Top Level)</option>
            {flatCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {"— ".repeat(cat.level)}
                {cat.name}
              </option>
            ))}
          </select>
          {errors.parentId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.parentId.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="label font-semibold text-slate-600 pb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`textarea textarea-bordered h-32 bg-slate-50 w-full focus:bg-white ${
              errors.description ? "border-red-500" : ""
            }`}
            placeholder="Type here"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Image Field with Preview and Picker */}
        <div>
          <label className="label font-semibold text-slate-600 pb-1">
            Image
          </label>
          <div className="flex items-center gap-3">
            {watchImage && (
              <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={getPreviewUrl(watchImage)}
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
                className="btn btn-outline btn-primary whitespace-nowrap">
                Browse
              </button>
            </div>
          </div>
        </div>

        {/* Icon Field with Preview and Picker */}
        <div>
          <label className="label font-semibold text-slate-600 pb-1">
            Icon
          </label>
          <div className="flex items-center gap-3">
            {watchIcon && (
              <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={getPreviewUrl(watchIcon)}
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
                className="btn btn-outline btn-primary whitespace-nowrap">
                Browse
              </button>
            </div>
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="label font-semibold text-slate-600 pb-1">
            Position
          </label>
          <input
            type="number"
            placeholder="0"
            className="input input-bordered w-full bg-slate-50 focus:bg-white"
            {...register("position", { valueAsNumber: true })}
          />
        </div>

        {/* Status (isActive) */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            className="checkbox checkbox-primary"
            {...register("isActive")}
          />
          <label
            htmlFor="isActive"
            className="label font-semibold text-slate-600">
            Active
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn bg-[#007b70] hover:bg-[#005f56] text-white border-none w-full mt-4 normal-case text-lg shadow-md disabled:opacity-50">
          {isSubmitting ? "Creating..." : "Create category"}
        </button>
      </form>

      {/* Media Modal – assumes it receives isOpen, onClose, onInsert */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onInsert={handleMediaInsert}
      />
    </div>
  );
};

export default CategoryForm;
