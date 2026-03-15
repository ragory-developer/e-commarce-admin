"use client";
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Trash2 } from "lucide-react";
import { useMediaStore } from "@/store/useMediaStore";

const MediaModal = ({ isOpen, onClose, onInsert }) => {
  const { allMediaFiles, fetchAllMediaFiles } = useMediaStore();
  const tableRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    fetchAllMediaFiles();
  }, [isOpen, fetchAllMediaFiles]);


  useEffect(() => {
    if (!isOpen || !allMediaFiles) return;

    let table;
    let $;

    const initTable = async () => {
      $ = (await import("jquery")).default;
      const DataTable = (await import("datatables.net-dt")).default;

      if (!$.fn.DataTable) DataTable(window, $);

      table = $(tableRef.current).DataTable({
        data: allMediaFiles,
        pageLength: 20,
        pagingType: "numbers",
        lengthChange: true,
        ordering: true,
        searching: true,
        info: true,
        destroy: true,
        dom:
          "<'dt-top flex justify-between items-center p-4 text-sm text-gray-600'<'dt-left flex items-center'l>f>" +
          "t" +
          "<'dt-bottom flex justify-between items-center p-4 text-sm text-gray-500'i p>",
        columns: [
          {
            data: null,
            orderable: false,
            className: "text-center",
            render: () =>
              `<input type="checkbox" class="checkbox checkbox-sm row-checkbox" />`,
          },
          { data: "id", className: "text-gray-500" },
          {
            data: null,
            orderable: false,
            render: (data) => {
              const thumbUrl =
                data.variants?.thumb?.url || data.storageUrl || "/placeholder.png";
              return `<div class="avatar">
                        <div class="w-10 h-10 rounded border">
                          <img src="${thumbUrl}" alt="Thumb" />
                        </div>
                      </div>`;
            },
          },
          {
            data: "originalName",
            className: "font-medium text-gray-700",
            render: (data) => data
          },
          {
            data: "createdAt",
            className: "text-left text-gray-500",
            render: (data) => {
              if (!data.createdAt) return "";
              const date = new Date(data.createdAt);
              return date.toLocaleDateString() + " " + date.toLocaleTimeString();
            },
          },
          {
            data: null,
            orderable: false,
            className: "text-right",
            render: (data) =>
              `<button class="btn btn-ghost btn-xs bg-gray-100 hover:bg-gray-200 insert-row-btn normal-case px-3" data-img='${JSON.stringify(
                data
              )}'>Insert</button>`,
          },
        ],
        language: {
          search: "",
          searchPlaceholder: "Search here...",
          lengthMenu: "Show _MENU_ entries",
        },
        initComplete: function () {
          const dtLeft = document.querySelector(".dt-left");
          if (dtLeft) {
            let btnContainer = document.querySelector(".delete-btn");
            if (!btnContainer) {
              btnContainer = document.createElement("div");
              btnContainer.className = "delete-btn ml-4";
              dtLeft.appendChild(btnContainer);
            }

            const root = createRoot(btnContainer);
            root.render(
              <button
                className="btn btn-outline btn-sm normal-case flex items-center gap-2 text-gray-600"
                onClick={() => {
                  console.log("Delete clicked");
                  // Add your delete logic here
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            );
          }
        },
      });

      $(tableRef.current).on("click", ".insert-row-btn", function () {
        const data = $(this).data("img");
        onInsert(data);
        onClose();
      });
    };

    initTable();

    return () => {
      if (table) table.destroy();
      if ($) $(tableRef.current).off();
      const btnContainer = document.querySelector(".delete-btn");
      if (btnContainer) {
        const root = createRoot(btnContainer);
        root.unmount();
      }
    };
  }, [isOpen, allMediaFiles, onInsert, onClose]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a simple object that mimics the media structure
        const newMedia = {
          id: Date.now().toString(),
          filename: file.name,
          originalName: file.name,
          thumbnail: reader.result,
          variants: {
            thumb: { url: reader.result },
          },
          createdAt: new Date().toISOString(),
        };
        onInsert(newMedia);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open items-start pt-10 pb-10">
      <div className="modal-box w-11/12 max-w-6xl p-0 bg-[#f8f9fa] flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 bg-white border-b shrink-0 sticky top-0 z-50">
          <h3 className="font-bold text-lg text-slate-700">File Manager</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar">
          {/* Dropzone Area */}
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 mb-8 p-16 flex flex-col items-center justify-center transition-hover hover:border-primary">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              id="fileInput"
              multiple
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-gray-500 text-lg"
            >
              Drop files here or click to upload
            </label>
          </div>

          {/* Table Container */}
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
                    <th className="w-20"></th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <form
        method="dialog"
        className="modal-backdrop bg-black/50"
        onClick={onClose}
      >
        <button>close</button>
      </form>
    </div>
  );
};

export default MediaModal;