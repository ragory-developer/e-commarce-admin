"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Tree } from "react-arborist";
import {
  Folder,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import { useCategoryStore } from "@/store/useCategoryStore";
import {
  deleteCategoryRequest,
  createCategoryRequest,
} from "@/services/category.service";
import { toast } from "react-toastify";

// --------------------------------------------------------------
// Helper: convert flat categories array to nested tree structure
// --------------------------------------------------------------
function buildTreeFromFlat(categories) {
  if (!categories?.length) return [];

  const map = new Map();
  const roots = [];

  categories.forEach((cat) => {
    map.set(cat.id, { id: cat.id, name: cat.name, children: [] });
  });

  categories.forEach((cat) => {
    const node = map.get(cat.id);
    if (node) {
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId).children.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
}

// --------------------------------------------------------------
// Custom renderer for each tree node (includes indent lines)
// --------------------------------------------------------------
const TreeNodeRenderer = ({ node, style, dragHandle, indent, onDelete }) => {
  const isFolder = node.data.children && node.data.children.length > 0;

  const lines = [];
  for (let i = 1; i <= node.level; i++) {
    lines.push(
      <div
        key={`line-${i}`}
        className="absolute top-0 bottom-0 w-px border-l border-dashed border-slate-200"
        style={{
          left: `${i * indent - indent / 2}px`,
          pointerEvents: "none",
        }}
      />,
    );
  }

  return (
    <div
      style={style}
      ref={dragHandle}
      className={`relative flex items-center h-8 px-2 rounded-lg cursor-pointer group ${
        node.isSelected
          ? "bg-teal-50 border border-teal-200"
          : "hover:bg-slate-50"
      }`}
      onClick={() => node.select()}>
      {lines}

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (node.isInternal) node.toggle();
        }}
        className="w-5 h-5 flex items-center justify-center text-slate-400">
        {node.isLeaf ? null : node.isOpen ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </button>

      <span className="mx-1.5">
        {isFolder ? (
          <Folder className="w-4 h-4 text-teal-600" />
        ) : (
          <FileText className="w-4 h-4 text-slate-400" />
        )}
      </span>

      <span
        className={`flex-1 text-sm truncate ${
          node.isSelected ? "text-teal-700 font-medium" : "text-slate-700"
        }`}>
        {node.data.name}
      </span>

      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.data.id);
          }}
          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// --------------------------------------------------------------
// Main component
// --------------------------------------------------------------
export default function TreeView({ setParentId }) {
  const { categories, fetchCategoriesTree } = useCategoryStore();

  const [treeData, setTreeData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const INDENT = 24;

  // ✅ FIX 1: guard added, hasFetched removed from deps
  useEffect(() => {
    if (hasFetched) return;
    (async () => {
      await fetchCategoriesTree();
      setHasFetched(true);
    })();
  }, [fetchCategoriesTree]);

  // Rebuild tree when categories change
  useEffect(() => {
    const newTree = buildTreeFromFlat(categories);
    setTreeData(newTree);
  }, [categories]);

  // Handle selection
  const handleSelect = useCallback(
    (nodes) => {
      const selected = nodes[0]?.data;
      if (selected) {
        setSelectedId(selected.id);
        setParentId(selected.id);
      }
    },
    [setParentId],
  );

  // ✅ FIX 2: calls API then refetches — uses real server ID
  const addRootCategory = useCallback(async () => {
    const name = prompt("Root category name:", "New Category");
    if (!name?.trim()) return;

    try {
      const result = await createCategoryRequest({
        name: name.trim(),
        parentId: null,
      });
      if (result.data.success) {
        toast.success(result.data.message);
        await fetchCategoriesTree();
        setSelectedId(result.data.category.id);
        setParentId(result.data.category.id);
      } else {
        toast.error(result.data.message);
      }
    } catch (err) {
      toast.error("Failed to create category.");
      console.error(err);
    }
  }, [setParentId, fetchCategoriesTree]);

  // ✅ FIX 3: calls API with real parentId then refetches
  const addSubCategory = useCallback(async () => {
    if (!selectedId) return;

    const name = prompt("Subcategory name:", "New Subcategory");
    if (!name?.trim()) return;

    try {
      const result = await createCategoryRequest({
        name: name.trim(),
        parentId: selectedId,
      });
      if (result.data.success) {
        toast.success(result.data.message);
        await fetchCategoriesTree();
      } else {
        toast.error(result.data.message);
      }
    } catch (err) {
      toast.error("Failed to create subcategory.");
      console.error(err);
    }
  }, [selectedId, fetchCategoriesTree]);

  // ✅ FIX 4: no circular dep, correct deps array
  const handleDeleteCategory = useCallback(
    async (id) => {
      if (isDeleting) return;
      setIsDeleting(true);

      try {
        const result = await deleteCategoryRequest(id);
        if (result.data.success) {
          toast.success(result.data.message);
          await fetchCategoriesTree();
        } else {
          toast.error(result.data.message);
        }

        if (selectedId === id) {
          setSelectedId(null);
          setParentId(null);
        }
      } catch (error) {
        toast.error("Failed to delete category.");
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    },
    [selectedId, setParentId, isDeleting, fetchCategoriesTree],
  );

  const treeHeight = useMemo(() => {
    const countNodes = (node) =>
      1 +
      (node.children?.reduce((sum, child) => sum + countNodes(child), 0) || 0);
    const totalNodes = treeData.reduce(
      (sum, node) => sum + countNodes(node),
      0,
    );
    return Math.min(500, Math.max(200, totalNodes * 36));
  }, [treeData]);

  if (!hasFetched) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
        <button
          onClick={addRootCategory}
          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg flex items-center gap-1.5 transition-colors">
          <Plus className="w-4 h-4" /> Add Root
        </button>

        {selectedId && (
          <button
            onClick={addSubCategory}
            className="px-3 py-1.5 border border-teal-300 text-teal-700 hover:bg-teal-50 text-sm rounded-lg flex items-center gap-1.5 transition-colors">
            <Plus className="w-4 h-4" /> Add Subcategory
          </button>
        )}
      </div>

      {/* Tree area */}
      <div className="flex-1 overflow-auto min-h-0">
        {treeData.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No categories yet.
          </div>
        ) : (
          <Tree
            data={treeData}
            idAccessor="id"
            childrenAccessor="children"
            onSelect={handleSelect}
            openByDefault={true}
            indent={INDENT}
            width="100%"
            height={treeHeight}
            rowHeight={36}
            selection={selectedId}>
            {({ node, style, dragHandle }) => (
              <TreeNodeRenderer
                node={node}
                style={style}
                dragHandle={dragHandle}
                indent={INDENT}
                onDelete={handleDeleteCategory}
              />
            )}
          </Tree>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-400 text-right">
        {treeData.length} root{" "}
        {treeData.length !== 1 ? "categories" : "category"}
      </div>
    </div>
  );
}
