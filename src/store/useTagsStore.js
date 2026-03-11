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
 return 
     
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

  createProductTags: async (data) => {
    try {
      set({ isCreateTag: true, error: null });
      const response = await createProductTagsRequest({ postBody: data });
      if(response.success){
        set({ tags: response.data, isCreateTag: false });
      }else{
        toast.error(response)
      }
     
      return response
    } catch (err) {
     return err.message
    }
  },
}));
