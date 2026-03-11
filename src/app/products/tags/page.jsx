"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { FormProvider } from "@/Components/Context/FormContext";
import { useTagsStore } from "@/store/useTagsStore";

const TagsPage = () => {
  const { tags, fetchProductTags } = useTagsStore();
  const tableRef = useRef(null);
  const tableInstance = useRef(null); // keep reference to DataTable instance

  // Fetch tags on mount
  useEffect(() => {
    fetchProductTags();
  }, [fetchProductTags]);

  // Initialize DataTable once
  useEffect(() => {
    let $;
    let DataTable;

    const initTable = async () => {
      $ = (await import("jquery")).default;
      DataTable = (await import("datatables.net-dt")).default;

      if (!$.fn.DataTable) {
        DataTable(window, $);
      }

      // Initialise with empty data (will be populated later)
      tableInstance.current = $(tableRef.current).DataTable({
        data: tags, // initially empty
        pageLength: 10,
        pagingType: "numbers",
        lengthChange: true,
        ordering: true,
        searching: true,
        info: true,
        destroy: true, // allows safe re-init if needed

        dom:
          "<'dt-top flex justify-between items-center p-4'<'dt-left flex items-center'l<'ml-4 delete-btn'>>f>" +
          "t" +
          "<'dt-bottom flex justify-between items-center p-4'i p>",

        columns: [
          {
            data: null,
            orderable: false,
            className: "text-center",
            render: () =>
              `<input type="checkbox" class="checkbox checkbox-sm row-checkbox" />`,
          },
          { data: "id", title: "ID" },
          {
            data: "name",
            title: "Name",
            render: (data) =>
              `<div class="name-cell flex items-center gap-3">${data}</div>`,
          },
          {
            data: "createdAt",
            title: "Created",
            className: "text-left",
            render: (data) =>
              `<div class="name-cell flex items-center gap-3">${data}</div>`,
          },
        ],

        language: {
          search: "",
          searchPlaceholder: "Search here...",
          lengthMenu: "Show _MENU_ entries",
        },
      });

      // Inject Delete button into the custom toolbar
      $(".delete-btn").html(`
        <button class="btn btn-outline btn-sm">
          Delete
        </button>
      `);

      // Row selection logic (delegated)
      $(tableRef.current).on("click", "tbody tr", function (e) {
        if ($(e.target).is("input")) return;
        $(this).toggleClass("selected");
        $(this)
          .find(".row-checkbox")
          .prop("checked", $(this).hasClass("selected"));
      });

      $(tableRef.current).on("click", ".row-checkbox", function (e) {
        e.stopPropagation();
        const row = $(this).closest("tr");
        row.toggleClass("selected", this.checked);
      });
    };

    initTable();

    // Cleanup
    return () => {
      if (tableInstance.current) {
        tableInstance.current.destroy();
        tableInstance.current = null;
      }
      // Remove all event handlers attached to the table
      if (window.$ && tableRef.current) {
        $(tableRef.current).off();
      }
    };;
  }, []); // empty deps – only run once

  // Update table data whenever tags change
  useEffect(() => {
    if (tableInstance.current && tags.length > 0) {
      // Clear existing rows and add new data
      tableInstance.current.clear().rows.add(tags).draw();
    } else if (tableInstance.current && tags.length === 0) {
      // If tags becomes empty, clear the table
      tableInstance.current.clear().draw();
    }
  }, [tags]);

  return (
    <FormProvider>
      <div className="p-6 bg-[#f8f9fa] min-h-screen">
        <div className="flex justify-between mb-5">
          <h1 className="text-3xl text-primary font-bold">Tags</h1>
          <div>
            <Link
              href="/products/tags/create-tags"
              className="btn btn-primary btn-outline">
              Create Tags
            </Link>
          </div>
        </div>
        <div className="datatable-container">
          <table ref={tableRef} className="display w-full">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Name</th>
                <th className="text-left">Created</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </FormProvider>
  );
};

export default TagsPage;
