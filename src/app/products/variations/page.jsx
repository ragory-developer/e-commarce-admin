"use client";

import React, { useEffect, useRef } from "react";
import variationsData from "@/Data/variations.json";
import Link from "next/link";

const VariationsPage = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    let table;
    let $;

    const initTable = async () => {
      $ = (await import("jquery")).default;
      const DataTable = (await import("datatables.net-dt")).default;

      if (!$.fn.DataTable) {
        DataTable(window, $);
      }

      table = $(tableRef.current).DataTable({
        data: variationsData,

        pageLength: 10,
        pagingType: "numbers", // no prev/next arrows
        lengthChange: true,
        ordering: true,
        searching: true,
        info: true,
        destroy: true,

        // ✅ Same layout as BrandsPage
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
          { data: "id" },
          { data: "name" },
          { data: "type" },
          {
            data: "updated",
            className: "text-left",
          },
        ],

        language: {
          search: "",
          searchPlaceholder: "Search here...",
          lengthMenu: "Show _MENU_ entries",
        },
      });

      // ✅ Inject Delete button
      $(".delete-btn").html(`
        <button class="btn btn-outline btn-sm">
          Delete
        </button>
      `);

      // ============================
      // ✅ ROW SELECTION LOGIC
      // ============================

      // Row click → toggle select
      $(tableRef.current).on("click", "tbody tr", function (e) {
        if ($(e.target).is("input")) return;

        $(this).toggleClass("selected");
        $(this)
          .find(".row-checkbox")
          .prop("checked", $(this).hasClass("selected"));
      });

      // Checkbox click → sync row
      $(tableRef.current).on("click", ".row-checkbox", function (e) {
        e.stopPropagation();

        const row = $(this).closest("tr");
        row.toggleClass("selected", this.checked);
      });
    };

    initTable();

    return () => {
      if (table) table.destroy();
      if ($) $(tableRef.current).off();
    };
  }, []);

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between mb-5">
        <h1 className="text-3xl text-primary font-bold">Variations</h1>
        <div>
          <Link
            href="/products/variations/create-variation"
            type="button"
            className="btn btn-primary btn-outline"
          >
            Create Variation
          </Link>
        </div>
      </div>

      {/* DataTable */}
      <div className="datatable-container">
        <table ref={tableRef} className="display w-full">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th className="text-left">Updated</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default VariationsPage;
