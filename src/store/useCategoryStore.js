import { create } from "zustand";
import {
  categoryTreeAPI,
  createCategoryTreeAPI,
} from "@/services/category.service";

export const useCategoryStore = create((set, get) => ({
  /*---------------------------------------------- */
  /*          Get Categories Tree Data             */
  /*---------------------------------------------- */

  // --- State ---
  categories: [],
  isLoadingCategory: false,
  error: null,

  // --- Actions --- //
  fetchCategoriesTree: async () => {
    try {
      set({ isLoadingCategory: true, error: null });
      const data = await categoryTreeAPI();
      set({ categories: data.data, isLoadingCategory: false });
      return true;
    } catch (err) {
      set({
        error: err?.message || "Failed to fetch categories",
        isLoadingCategory: false,
      });
      return false;
    }
  },
}));
