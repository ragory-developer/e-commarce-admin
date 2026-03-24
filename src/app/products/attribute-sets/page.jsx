"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { FormProvider } from "@/Components/Context/FormContext";
import { useAttributeSetsStore } from "@/store/useAttributeSetsStore";



const AttributesSetPage = () => {
  const { attributesSets, fetchAttributesSets } = useAttributeSetsStore();
  const tableRef = useRef(null);
  const tableInstance = useRef(null); // store DataTable instance

  // Fetch attribute sets on mount
  useEffect(() => {
    (async () => {
      await fetchAttributesSets();
    })();
  }, [fetchAttributesSets]);

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
        data: attributesSets, // initially empty
        pageLength: 10,
        pagingType: "numbers",
        lengthChange: true,
        ordering: true,
        searching: true,
        info: true,
        destroy: true,

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
          {
            data: "name",
            orderable: false,
            render: (data) => `
              <div class="name-cell flex items-center gap-3">
               ${data}
              </div>
            `,
          },
          {
            data: "slug",
            className: "text-left",
          },
          {
            data: "createdAt",
            className: "text-left",
          },
        ],

        language: {
          search: "",
          searchPlaceholder: "Search here...",
          lengthMenu: "Show _MENU_ entries",
        },
      });

      // Inject Delete button
      $(".delete-btn").html(`
        <button class="btn btn-outline btn-sm">
          Delete
        </button>
      `);

      // Row selection logic
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
    };;

    initTable();

    return () => {
      if (tableInstance.current) {
        tableInstance.current.destroy();
        tableInstance.current = null;
      }
      if (window.$ && tableRef.current) {
        $(tableRef.current).off();
      }
    };
  }, []); // empty deps – only run once

  // Update table data when attributesSets changes
  useEffect(() => {
    if (tableInstance.current && attributesSets.length > 0) {
      tableInstance.current.clear().rows.add(attributesSets).draw();
    } else if (tableInstance.current && attributesSets.length === 0) {
      tableInstance.current.clear().draw();
    }
  }, [attributesSets]);

  return (
    <FormProvider>
      <div className="p-6 bg-[#f8f9fa] min-h-screen">
        <div className="flex justify-between mb-5">
          <h1 className="text-3xl text-primary font-bold">Attribute Sets</h1>
          <div>
            <Link
              href="/products/attribute-sets/create-attribute-set"
              className="btn btn-primary btn-outline">
              Create Attribute Sets
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
                <th>Slug</th>
                <th className="text-left">Created</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

    </FormProvider>
  );
};

export default AttributesSetPage;
