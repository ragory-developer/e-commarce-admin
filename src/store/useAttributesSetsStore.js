import { create } from "zustand";

import {
  createProductAttributeSetsRequest,
  getProductAttributeSetsRequest,
} from "@/services/attributes.sets.service";

export const useAttibutesSetsStore = create((set, get) => ({
  /*---------------------------------------------- */
  /*          Get Categories Tree Data             */
  /*---------------------------------------------- */

  // --- State ---
  attributesSets: [],
  isLoadingAttibutesSets: false,
  error: null,

  // --- Actions --- //
  fetchAttributesSets: async () => {
    try {
      set({ isLoadingAttibutesSets: true, error: null });
      const data = await getProductAttributeSetsRequest();
      set({ attributesSets: data.data, isLoadingAttibutesSets: false });
      return true;
    } catch (err) {
      set({
        error: err?.message || "Failed to fetch attributes sets",
        isLoadingAttibutesSets: false,
      });
      return false;
    }
  },

  /*---------------------------------------------- */
  /*         Create Categories Tree Data           */
  /*---------------------------------------------- */
  // --- State ---
  error: null,
  isCreatingAttibutesSets: false,
  // --- Actions --- //

  createAttributesSets: async (data) => {
    try {
      set({ isCreatingAttibutesSets: true, error: null });
      const response = await createProductAttributeSetsRequest({
        postBody: data,
      });
      console.log(response);
      set({ attributesSets: response.data, isCreateAttibutesSets: false });
      return true;
    } catch (err) {
      set({
        error: err?.message || "Failed to create attributes sets",
        isCreateAttibutesSets: false,
      });
      return false;
    }
  },
}));
