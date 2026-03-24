import { getAllMediaRequest } from "@/services/media.picker.service";
import { toast } from "react-toastify";
import { create } from "zustand";

export const useMediaStore = create((set, get) => ({
  /*---------------------------------------------- */
  /*          Get All Media Files                 */
  /*---------------------------------------------- */

  // --- State ---
  isLoadingMedia: null,
  allMediaFiles: [],

  // --- Actions --- //
  fetchAllMediaFiles: async () => {
    try {
      const data = await getAllMediaRequest();
      set({ allMediaFiles: data.data });
      console.log(data);
    } catch (err) {
      set({
        error: err?.message || "Failed to fetch media",
        isLoadingTags: false,
      });
    }
  },

  /*---------------------------------------------- */
  /*         Create Product Tags Data              */
  /*---------------------------------------------- */
  // --- State ---

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
