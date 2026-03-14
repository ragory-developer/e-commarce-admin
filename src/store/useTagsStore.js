import {
  createProductTagsRequest,
  getProductTagsRequest,
} from "@/services/tags.service";
import { toast } from "react-toastify";
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

  isCreateTag: false,
  // --- Actions --- //

  createProductTags: async (payload) => {
    try {
      set({ isCreateTag: true, error: null });
      const data = await createProductTagsRequest(payload);
      console.log(data, payload);
      if (data.success && data.statusCode === 201) {
        toast.success(data.message);
        return data.massage;
      } else {
        toast.error(data.message);
        return data.massage;
      }
      return response;
    } catch (err) {
      return err.message;
    }
  },
}));
