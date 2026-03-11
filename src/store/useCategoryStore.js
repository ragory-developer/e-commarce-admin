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

  /*---------------------------------------------- */
  /*         Create Categories Tree Data           */
  /*---------------------------------------------- */
  // --- State ---
  error: null,
  isCreateCategory: false,
  // --- Actions --- //

  createCategories: async (data) => {
    try {
      set({ isCreateCategory: true, error: null });
      const response = await createCategoryTreeAPI({ postBody: data });
      console.log(response);
      set({ categories: response.data, isCreateCategory: false });
      return true;
    } catch (err) {
      set({
        error: err?.message || "Failed to create categories",
        isCreateCategory: false,
      });
      return false;
    }
  },
}));
