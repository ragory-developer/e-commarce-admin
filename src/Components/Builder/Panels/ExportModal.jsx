"use client";
import React from "react";

const ExportModal = ({ showExport, setShowExport, getExportJSON }) => {
  if (!showExport) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={() => setShowExport(false)}>
      <div
        className="bg-gray-900 rounded-xl border border-gray-800 w-[520px] max-h-[80vh] overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-100 text-base font-bold">
            📦 Export as JSON
          </h3>
          <button
            className="bg-none border-none text-gray-500 text-xl cursor-pointer"
            onClick={() => setShowExport(false)}>
            ×
          </button>
        </div>
        <p className="text-gray-500 text-xs mb-3">
          This JSON represents your page configuration. Paste it into your
          hosted app to render the page.
        </p>
        <div className="bg-gray-950 rounded-lg border border-gray-800 p-4 overflow-x-auto text-xs leading-relaxed text-green-400 font-mono whitespace-pre">
          {JSON.stringify(getExportJSON(), null, 2)}
        </div>
        <button
          className="mt-3 bg-gray-800 text-gray-300 border border-gray-700 rounded px-3.5 py-1.5 text-xs cursor-pointer w-full"
          onClick={() => {
            navigator.clipboard.writeText(
              JSON.stringify(getExportJSON(), null, 2),
            );
          }}>
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
