"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ChevronRight, Plus, Trash2, FolderOpen, Folder, FileText } from "lucide-react";
import { useCategoryStore } from "@/store/useCategoryStore";

// ─── Helpers ─────────────────────────────────────────────────────────
let _uid = 9000;
const genId = () => `cat_${++_uid}`;

function findNode(node, id) {
  if (node.id === id) return node;
  for (const c of node.children || []) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return null;
}

function findParent(node, id) {
  for (const c of node.children || []) {
    if (c.id === id) return node;
    const found = findParent(c, id);
    if (found) return found;
  }
  return null;
}

function getAllIds(node, acc = []) {
  acc.push(node.id);
  (node.children || []).forEach(c => getAllIds(c, acc));
  return acc;
}

function countDescendants(node) {
  return (node.children || []).reduce((sum, c) => sum + 1 + countDescendants(c), 0);
}

function totalNodes(root) {
  return (root.children || []).reduce((sum, c) => sum + 1 + countDescendants(c), 0);
}

// ─── Collapsible wrapper (simple max-height transition) ─────────────
function Collapsible({ open, children }) {
  return (
    <div
      className={`
        overflow-hidden transition-all duration-200 ease-in-out
        ${open ? 'max-h-screen' : 'max-h-0'}
      `}
    >
      {children}
    </div>
  );
}

// ─── TreeNode component ─────────────────────────────────────────────
function TreeNode({
  node,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
  onAddChild,
  onDelete,
}) {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = (node.children || []).length > 0;
  const desc = countDescendants(node); // descendant count for badge

  return (
    <div className="group">
      <div
        onClick={() => onSelect(node.id)}
        className={`
          flex items-center h-7 pr-1 cursor-pointer select-none rounded-lg transition-colors
          ${isSelected ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'}
        `}
      >
        {/* Expand/collapse chevron */}
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
            className="w-4 h-4 flex items-center justify-center text-slate-400 focus:outline-none"
          >
            <ChevronRight
              className="w-[9px] h-[9px] transition-transform duration-150"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Folder / file icon */}
        <span className={`mx-1.5 ${hasChildren ? 'text-teal-600' : 'text-slate-300'}`}>
          {hasChildren ? (
            isExpanded ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
        </span>

        {/* Node name */}
        <span className={`flex-1 text-xs truncate ${isSelected ? 'text-teal-700 font-semibold' : 'text-slate-700'}`}>
          {node.name}
        </span>

        {/* Descendant count badge (only for folders with children) */}
        {hasChildren && desc > 0 && (
          <span className="text-[10px] text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5 mr-1 flex-shrink-0 leading-none">
            {desc}
          </span>
        )}

        {/* Action buttons (appear on hover) */}
        <div className="flex items-center gap-px opacity-0 group-hover:opacity-100 transition-opacity">
          {hasChildren && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }}
              title="Add subcategory"
              className="w-[18px] h-[18px] flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
            title="Delete"
            className="w-[18px] h-[18px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && (
        <Collapsible open={isExpanded}>
          <div className="ml-4 border-l border-slate-200 pl-2">
            {node.children.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                selectedId={selectedId}
                onSelect={onSelect}
                expandedIds={expandedIds}
                onToggle={onToggle}
                onAddChild={onAddChild}
                onDelete={onDelete}
              />
            ))}
          </div>
        </Collapsible>
      )}
    </div>
  );
}

// ─── Main TreeView component ────────────────────────────────────────
export default function TreeView({ setParentId }) {
  const { categories, fetchCategoriesTree } = useCategoryStore();
  const [localTree, setLocalTree] = useState({ id: '__root__', name: 'Root', children: [] });
  const [selectedId, setSelectedId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Convert flat categories array into nested tree
  useEffect(() => {
    if (categories?.length) {
      const nodeMap = {};
      categories.forEach(cat => {
        nodeMap[cat.id] = { id: cat.id, name: cat.name, children: [] };
      });

      const roots = [];
      categories.forEach(cat => {
        const node = nodeMap[cat.id];
        if (cat.parentId) {
          const parent = nodeMap[cat.parentId];
          if (parent) {
            parent.children.push(node);
          } else {
            roots.push(node);
          }
        } else {
          roots.push(node);
        }
      });

      setLocalTree({ id: '__root__', name: 'Root', children: roots });
      const idsToExpand = roots.map(r => r.id);
      setExpandedIds(new Set(['__root__', ...idsToExpand]));
    }
  }, [categories]);

  const total = totalNodes(localTree);
  const selectedNode = selectedId ? findNode(localTree, selectedId) : null;

  const toggle = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setParentId(id); // ← sync selected node to parent
  }, [setParentId]);

  const expandAll = () => setExpandedIds(new Set(getAllIds(localTree)));
  const collapseAll = () => setExpandedIds(new Set());

  const addRoot = () => {
    const name = window.prompt('Root category name:', 'New Category');
    if (!name?.trim()) return;
    const newNode = { id: genId(), name: name.trim(), children: [] };
    setLocalTree(prev => ({ ...prev, children: [...prev.children, newNode] }));
    setSelectedId(newNode.id);
    setParentId(newNode.id); // ← new root becomes parent
  };

  const addChildTo = useCallback((parentId) => {
    const name = window.prompt('Subcategory name:', 'New Subcategory');
    if (!name?.trim()) return;
    const newNode = { id: genId(), name: name.trim(), children: [] };
    setLocalTree(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parent = findNode(clone, parentId);
      if (parent) parent.children.push(newNode);
      return clone;
    });
    setExpandedIds(prev => new Set([...prev, parentId]));
    setSelectedId(newNode.id);
    setParentId(newNode.id); // ← new child becomes parent
  }, [setParentId]);

  const handleDelete = useCallback((id) => {
    const node = findNode(localTree, id);
    if (!node) return;
    const desc = countDescendants(node);
    const msg = desc > 0
      ? `Delete "${node.name}" and its ${desc} item(s)?`
      : `Delete "${node.name}"?`;
    if (!window.confirm(msg)) return;

    setLocalTree(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parent = findParent(clone, id);
      if (parent) parent.children = parent.children.filter(c => c.id !== id);
      return clone;
    });
    if (selectedId === id) {
      setSelectedId(null);
      setParentId(''); // ← clear parent when selected is deleted
    }
  }, [localTree, selectedId, setParentId]);

  return (
    <div className="flex flex-col min-h-s w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          onClick={addRoot}
          className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white border-none gap-1.5 normal-case font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add Root
        </button>
        <button
          onClick={() => selectedNode?.children && addChildTo(selectedNode.id)}
          disabled={!selectedNode?.children}
          className="btn btn-sm btn-outline border-teal-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 gap-1.5 normal-case font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" /> Add Subcategory
        </button>
        <div className="flex-1" />
        <button
          onClick={expandAll}
          className="btn btn-ghost btn-sm normal-case text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-normal"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="btn btn-ghost btn-sm normal-case text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-normal"
        >
          Collapse
        </button>
      </div>

      {/* Selected item info */}
      <div className="flex items-stretch bg-slate-50 border border-slate-200 rounded-lg mb-3 min-h-[32px] text-xs overflow-hidden">
        <span className="flex items-center px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-r border-slate-200 bg-slate-100">
          Selected
        </span>
        {selectedNode ? (
          <>
            <span className="flex items-center px-2.5 font-mono text-teal-600 border-r border-slate-200">
              {selectedNode.id}
            </span>
            <span className="flex items-center px-2.5 text-slate-600 truncate">
              {selectedNode.name}
            </span>
          </>
        ) : (
          <span className="flex items-center px-2.5 text-slate-400 italic">
            — nothing selected
          </span>
        )}
      </div>

      {/* Tree body */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {(localTree.children || []).length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            No categories yet. Add one above.
          </div>
        ) : (
          localTree.children.map(node => (
            <TreeNode
              key={node.id}
              node={node}
              selectedId={selectedId}
              onSelect={handleSelect}
              expandedIds={expandedIds}
              onToggle={toggle}
              onAddChild={addChildTo}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Footer count */}
      <div className="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-400 text-right">
        {total} item{total !== 1 ? 's' : ''}
      </div>
    </div>
  );
}