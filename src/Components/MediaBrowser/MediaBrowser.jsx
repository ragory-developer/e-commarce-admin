"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, RefreshCw, Upload, X } from "lucide-react";
import { useMediaStore } from "@/store/useMediaStore";
import { uploadMultipleMediaRequest } from "@/services/media.picker.service";
import { toast } from "react-toastify";

const MAX_IMAGES = 10;

const MediaBrowser = ({ mode = "page", onInsert, onClose }) => {
  const { allMediaFiles, fetchAllMediaFiles, deleteMedia } = useMediaStore();
  const tableRef = useRef(null);
  const tableInstanceRef = useRef(null);
  const jQueryRef = useRef(null); // ✅ FIX: persist $ across async boundary
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteBtnContainer, setDeleteBtnContainer] = useState(null);

  // Fetch media on mount
  useEffect(() => {
    const loadMedia = async () => {
      setIsLoading(true);
      await fetchAllMediaFiles();
      setDataLoaded(true);
      setIsLoading(false);
    };
    loadMedia();
  }, [fetchAllMediaFiles]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  // Initialize DataTable when data is loaded
  useEffect(() => {
    if (!dataLoaded || !allMediaFiles) return;

    const initTable = async () => {
      const $ = (await import("jquery")).default;
      await import("datatables.net-dt");

      // ✅ FIX: store $ in the ref so cleanup can safely access it
      jQueryRef.current = $;

      if (!$.fn.DataTable) {
        console.error("DataTables not loaded correctly");
        return;
      }

      if (tableInstanceRef.current) {
        tableInstanceRef.current.destroy();
        tableInstanceRef.current = null;
      }

      const columns = [
        {
          data: null,
          orderable: false,
          className: "text-center w-10",
          render: () =>
            `<input type="checkbox" class="checkbox checkbox-sm row-checkbox" />`,
        },
        { data: "id", className: "text-gray-500" },
        {
          data: null,
          orderable: false,
          render: (data) => {
            const thumbUrl =
              data.variants?.thumb?.url ||
              data.storageUrl ||
              "/placeholder.png";
            return `<div class="avatar"><div class="w-10 h-10 rounded border bg-gray-100"><img src="${thumbUrl}" alt="Thumb" class="object-cover w-full h-full" /></div></div>`;
          },
        },
        { data: "originalName", className: "font-medium text-gray-700" },
        {
          data: "createdAt",
          className: "text-left text-gray-500",
          render: (data) => {
            if (!data) return "";
            const date = new Date(data);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
          },
        },
      ];

      if (mode === "modal") {
        columns.push({
          data: null,
          orderable: false,
          className: "text-right w-20",
          render: (data) =>
            `<button class="btn btn-ghost btn-xs bg-gray-100 hover:bg-gray-200 insert-row-btn normal-case px-3" data-img='${JSON.stringify(data)}'>Insert</button>`,
        });
      }

      const table = $(tableRef.current).DataTable({
        data: allMediaFiles,
        columns,
        pageLength: 20,
        pagingType: "numbers",
        lengthChange: true,
        ordering: true,
        searching: true,
        info: true,
        destroy: true,
        dom:
          "<'dt-top flex flex-col sm:flex-row justify-between items-center p-4 gap-4'<'dt-left flex items-center'l<'ml-4 delete-btn'>>f>" +
          "t" +
          "<'dt-bottom flex flex-col sm:flex-row justify-between items-center p-4 gap-4'i p>",
        language: {
          search: "",
          searchPlaceholder: "Search here...",
          lengthMenu: "Show _MENU_ entries",
        },
        initComplete: function () {
          const container = document.querySelector(".delete-btn");
          setDeleteBtnContainer(container);
        },
      });

      tableInstanceRef.current = table;

      $(tableRef.current).on("click", "tbody tr", function (e) {
        if ($(e.target).is("input")) return;
        $(this).toggleClass("selected");
        const checkbox = $(this).find(".row-checkbox");
        checkbox.prop("checked", $(this).hasClass("selected"));
      });

      $(tableRef.current).on("click", ".row-checkbox", function (e) {
        e.stopPropagation();
        const row = $(this).closest("tr");
        row.toggleClass("selected", this.checked);
      });

      if (mode === "modal") {
        $(tableRef.current).on("click", ".insert-row-btn", function () {
          const data = $(this).data("img");
          onInsert?.(data);
          onClose?.();
        });
      }
    };

    initTable().catch(console.error);

    return () => {
      // ✅ FIX: destroy DataTable instance
      if (tableInstanceRef.current) {
        tableInstanceRef.current.destroy();
        tableInstanceRef.current = null;
      }

      // ✅ FIX: use jQueryRef.current instead of bare $ — safe even if
      //    initTable never completed (jQueryRef.current will be null)
      if (jQueryRef.current && tableRef.current) {
        jQueryRef.current(tableRef.current).off();
      }

      setDeleteBtnContainer(null);
    };
  }, [dataLoaded, allMediaFiles, mode, onInsert, onClose]);

  // --- Upload logic (unchanged) ---
  const validateAndAddFiles = (files) => {
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`Skipped "${file.name}" – only images are allowed.`);
        continue;
      }
      validFiles.push(file);
    }

    const currentCount = selectedFiles.length;
    const newCount = validFiles.length;

    if (currentCount + newCount > MAX_IMAGES) {
      alert(
        `You can only upload up to ${MAX_IMAGES} images. You already have ${currentCount} selected. Adding these would exceed the limit.`,
      );
      return;
    }

    const newItems = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setSelectedFiles((prev) => [...prev, ...newItems]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddFiles(files);
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setSelectedFiles([]);
  };

  const handleSubmitUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((item) => {
      formData.append("files", item.file, item.file.name);
    });

    setIsUploading(true);
    try {
      const result = await uploadMultipleMediaRequest(formData);

      if (result.data.success) {
        toast.success(result.data.message);
      } else {
        toast.error(result.data.message);
      }

      await fetchAllMediaFiles();
      setDataLoaded(false);
      clearAll();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefresh = async () => {
    setDataLoaded(false);
    await fetchAllMediaFiles();
    setDataLoaded(true);
  };

  // --- Delete button (portal) ---
  const DeleteButton = () => {
    const handleDelete = async () => {
      const table = tableInstanceRef.current;
      if (!table) return;

      const selectedRows = [];
      $(tableRef.current)
        .find("tbody tr.selected")
        .each(function () {
          const rowData = table.row(this).data();
          selectedRows.push(rowData);
        });

      if (selectedRows.length === 0) {
        toast.info("No rows selected.");
        return;
      }

      const confirmed = confirm(
        `Delete ${selectedRows.length} item(s)? This action cannot be undone.`,
      );
      if (!confirmed) return;

      for (const row of selectedRows) {
        await deleteMedia(row.id);
      }

      await fetchAllMediaFiles();
      setDataLoaded(false);
    };

    return (
      <button
        className="btn btn-outline btn-sm normal-case flex items-center gap-2 text-gray-600 hover:text-error"
        onClick={handleDelete}>
        <Trash2 size={16} />
        Delete
      </button>
    );
  };

  // --- UploadArea component (unchanged) ---
  const UploadArea = () => {
    const isLimitReached = selectedFiles.length >= MAX_IMAGES;

    return (
      <div className="mb-8">
        <div
          className={`bg-white rounded-lg border-2 border-dashed border-gray-200 hover:border-primary transition-colors p-8 text-center cursor-pointer ${
            isLimitReached ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onDrop={isLimitReached ? undefined : handleDrop}
          onDragOver={isLimitReached ? undefined : handleDragOver}
          onClick={() =>
            !isLimitReached && document.getElementById("fileInput").click()
          }>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileSelect}
            multiple
            accept="image/*"
            disabled={isLimitReached}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">
            Drag & drop images here, or click to select
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supported formats: JPEG, PNG, GIF, WebP (max {MAX_IMAGES} images)
          </p>
          {isLimitReached && (
            <p className="text-xs text-error mt-2">
              Maximum {MAX_IMAGES} images reached. Clear some to add more.
            </p>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">
                Selected Images ({selectedFiles.length}/{MAX_IMAGES})
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={clearAll}
                  className="btn btn-ghost btn-sm text-gray-500 hover:text-error"
                  disabled={isUploading}>
                  Clear all
                </button>
                <button
                  onClick={handleSubmitUpload}
                  className="btn btn-primary btn-sm normal-case flex items-center gap-1"
                  disabled={isUploading || selectedFiles.length === 0}>
                  {isUploading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload {selectedFiles.length} image(s)
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedFiles.map((item) => (
                <div
                  key={item.id}
                  className="relative group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center">
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removeFile(item.id)}
                      className="btn btn-circle btn-xs bg-white shadow-md text-gray-600 hover:text-error"
                      disabled={isUploading}>
                      <X size={12} />
                    </button>
                  </div>
                  <div className="p-1 text-xs truncate text-gray-500 bg-white border-t">
                    {item.file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Modal and page rendering (unchanged) ---
  if (mode === "modal") {
    return (
      <div className="modal modal-open items-start pt-10 pb-10">
        <div className="modal-box w-11/12 max-w-6xl p-0 bg-[#f8f9fa] flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center p-4 bg-white border-b shrink-0 sticky top-0 z-50">
            <h3 className="font-bold text-lg text-slate-700">File Manager</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="p-4 overflow-y-auto custom-scrollbar">
            <UploadArea />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="datatable-container">
                <table ref={tableRef} className="display w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600">
                      <th className="w-10"></th>
                      <th>ID</th>
                      <th>Thumbnail</th>
                      <th>Filename</th>
                      <th>Created</th>
                      {mode === "modal" && <th className="w-20"></th>}
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-black/50"
          onClick={onClose}>
          <button>close</button>
        </form>
        {deleteBtnContainer &&
          createPortal(<DeleteButton />, deleteBtnContainer)}
      </div>
    );
  }

  // Page mode
  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Media</h1>
        <button
          onClick={handleRefresh}
          className="btn btn-ghost btn-sm normal-case flex items-center gap-2"
          disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <UploadArea />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="datatable-container">
          <table ref={tableRef} className="display w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="w-10"></th>
                <th>ID</th>
                <th>Thumbnail</th>
                <th>Filename</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">Loading...</div>
        </div>
      )}

      {deleteBtnContainer && createPortal(<DeleteButton />, deleteBtnContainer)}
    </div>
  );
};

export default MediaBrowser;
