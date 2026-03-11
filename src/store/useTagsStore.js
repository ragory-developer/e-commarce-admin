import {
  createProductTagsRequest,
  getProductTagsRequest,
} from "@/services/tags.service";
import { create } from "zustand";

export const useTagsStore = create((set, get) => ({
  /*---------------------------------------------- */
  /*          Get Product Tags Data                */
  /*---------------------------------------------- */

  // --- State ---
  tags: [],
  isLoadingTags: false,
  error: null,

  // --- Actions --- //
  fetchProductTags: async () => {
    try {
      set({ isLoadingTags: true, error: null });
      const data = await getProductTagsRequest();
      console.log(data);
      set({ tags: data.data, isLoadingTags: false });
      return true;
    } catch (err) {
      set({
        error: err?.message || "Failed to fetch tags",
        isLoadingTags: false,
      });
      return false;
    }
  },

  /*---------------------------------------------- */
  /*         Create Product Tags Data              */
  /*---------------------------------------------- */
  // --- State ---
  error: null,
  isCreateTag: false,
  // --- Actions --- //

  createProductTags: async (data) => {
    try {
      set({ isCreateTag: true, error: null });
      const response = await createProductTagsRequest({ postBody: data });
      console.log(response);
      set({ tags: response.data, isCreateTag: false });
      return true;
    } catch (err) {
      set({
        error: err?.message || "Failed to create tags",
        isCreateTag: false,
      });
      return false;
    }
  },
}));
