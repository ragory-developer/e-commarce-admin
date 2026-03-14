import React, { useRef, useState } from 'react';
import { Tree, TreeApi } from 'react-arborist';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  PlusCircle,
} from 'lucide-react';

// --- Generate unique IDs (simple for demo) ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Initial data exactly as in the image ---
const initialData = [
  {
    id: generateId(),
    name: 'Electronics',
    children: [
      {
        id: generateId(),
        name: 'Mobiles',
        children: [
          { id: generateId(), name: 'Smartphones' },
          { id: generateId(), name: 'Android' },
          { id: generateId(), name: 'iPhone' },
          { id: generateId(), name: 'Featured' },
          { id: generateId(), name: 'Refurbished' },
          { id: generateId(), name: 'Brands' },
        ],
      },
      {
        id: generateId(),
        name: 'Mobile Accessories',
        children: [
          { id: generateId(), name: 'Cases & Covers' },
          { id: generateId(), name: 'Cables' },
          { id: generateId(), name: 'Chargers' },
          { id: generateId(), name: 'Power Bank' },
          { id: generateId(), name: 'Headphones' },
          { id: generateId(), name: 'Screen Protectors' },
        ],
      },
      {
        id: generateId(),
        name: 'Hot Brands',
        children: [
          { id: generateId(), name: 'OnePlus' },
          { id: generateId(), name: 'Apple' },
          { id: generateId(), name: 'Samsung' },
          { id: generateId(), name: 'Huawei' },
          { id: generateId(), name: 'Sony' },
        ],
      },
      {
        id: generateId(),
        name: 'Laptops',
        children: [
          { id: generateId(), name: 'Macbook' },
          { id: generateId(), name: 'Gaming' },
          { id: generateId(), name: 'Ultrasmim' }, // as per image
          { id: generateId(), name: 'Tablets' },
          { id: generateId(), name: 'All Laptops' },
        ],
      },
      {
        id: generateId(),
        name: 'Computer Accessories',
        children: [
          { id: generateId(), name: 'Monitors' },
          { id: generateId(), name: 'Keyboard & Mouse' },
        ],
      },
    ],
  },
];

// --- Custom Node Renderer ---
const Node = ({ node, style, dragHandle }) => {
  const isSelected = node.isSelected;
  const hasChildren = node.children?.length > 0;
  const isOpen = node.isOpen;

  // Choose icon based on type and open state
  let Icon = File;
  if (hasChildren) {
    Icon = isOpen ? FolderOpen : Folder;
  }

  return (
    <div
      ref={dragHandle}
      style={style}
      className={`flex items-center py-1 px-2 rounded cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
        }`}
      onClick={() => node.select()}
    >
      {/* Expand/collapse arrow */}
      <span
        className="w-5 h-5 flex items-center justify-center mr-1"
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )
        ) : (
          <span className="w-4" /> // spacer for alignment
        )}
      </span>

      {/* Folder/file icon */}
      <Icon size={16} className="mr-2 text-gray-600" />

      {/* Node name (inline editing is built-in, we'll just display text) */}
      <span className="text-sm">{node.data.name}</span>
    </div>
  );
};

// --- Main Component ---
const TreeView = () => {
  const [data, setData] = useState(initialData);
  const [selectedId, setSelectedId] = useState(null);
  const treeRef = useRef(null); // to access tree methods like openAll/closeAll

  // --- Add Root Category ---
  const addRoot = () => {
    const newRoot = {
      id: generateId(),
      name: 'New Root',
      children: [],
    };
    setData([...data, newRoot]);
  };

  // --- Add Subcategory under selected node ---
  const addSubcategory = () => {
    if (!selectedId) {
      alert('Please select a category first');
      return;
    }
    // Helper to insert child recursively
    const insertChild = (nodes) => {
      return nodes.map((node) => {
        if (node.id === selectedId) {
          const newChild = {
            id: generateId(),
            name: 'New Subcategory',
          };
          return {
            ...node,
            children: [...(node.children || []), newChild],
          };
        }
        if (node.children) {
          return { ...node, children: insertChild(node.children) };
        }
        return node;
      });
    };
    setData(insertChild(data));
  };

  // --- Expand/Collapse all via tree ref ---
  const expandAll = () => {
    if (treeRef.current) {
      treeRef.current.openAll();
    }
  };

  const collapseAll = () => {
    if (treeRef.current) {
      treeRef.current.closeAll();
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Action Bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button
          onClick={addRoot}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium"
        >
          <PlusCircle size={16} />
          Add Root Category
        </button>
        <button
          onClick={addSubcategory}
          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium"
        >
          <PlusCircle size={16} />
          Add Subcategory
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
          <button
            onClick={collapseAll}
            className="hover:text-blue-600 hover:underline"
          >
            Collapse All
          </button>
          <span>|</span>
          <button
            onClick={expandAll}
            className="hover:text-blue-600 hover:underline"
          >
            Expand All
          </button>
        </div>
      </div>

      {/* Tree Container */}
      <div className="border rounded-md p-2 bg-gray-50" style={{ height: '500px' }}>
        <Tree
          ref={treeRef}
          data={data}
          onChange={setData}
          onSelect={(selected) => setSelectedId(selected?.[0] || null)}
          selection={selectedId ? [selectedId] : []}
          openByDefault={true}
          children={Node}
          width="100%"          // can be string for fluid width
          height={500}          // <-- must be number, matches container
          onMove={({ dragIds, parentId, index }) => {
            // optional drag logic
          }}
          onRename={({ id, name }) => {
            // optional rename logic
          }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Click to select. Double‑click a name to rename. Drag nodes to reorder.
      </p>
    </div>
  );
};

export default TreeView;