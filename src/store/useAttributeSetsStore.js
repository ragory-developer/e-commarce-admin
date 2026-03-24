import { create } from "zustand";
import {
  getProductAttributeSetsRequest,
  createProductAttributeSetRequest,
} from "@/services/attributes.sets.service";
import { toast } from "react-toastify";

export const useAttributeSetsStore = create((set, get) => ({
  /*---------------------------------------------- */
  /*          Get Categories Tree Data             */
  /*---------------------------------------------- */

  // --- State ---
  attributesSets: [],
  isLoadingAttributesSets: false,
  error: null,

  // --- Actions --- //
  fetchAttributesSets: async () => {
    try {
      set({ isLoadingAttributesSets: true, error: null });
      const data = await getProductAttributeSetsRequest();
      console.log(data);
      set({ attributesSets: data.data, isLoadingAttributesSets: false });
      return true;
    } catch (err) {
      set({
        error: err?.message || "Failed to fetch attributes sets",
        isLoadingAttributesSets: false,
      });
      return false;
    }
  },

  /*---------------------------------------------- */
  /*         Create Categories Tree Data           */
  /*---------------------------------------------- */

  createAttributeSets: async (payload) => {
    try {
      const response = await createProductAttributeSetRequest(payload);

      if (!response.data.success) {
        toast.error(response.data.message);
      }
      toast.success(response.message);
      return response.data;
    } catch (err) {
      toast.error(err.message);
    }
  },
}));
