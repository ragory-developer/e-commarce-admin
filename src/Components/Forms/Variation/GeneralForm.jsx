import React from "react";

const GeneralForm = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <form>
        {/* Header */}
        <h2 className="text-lg font-semibold mb-6">General</h2>

        {/* Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              className="select select-bordered w-full focus:outline-none focus:border-primary"
              required
            >
              <option value="">Please Select</option>
              <option value="Text">Text</option>
              <option value="Color">Color</option>
              <option value="Image">Image</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button type="submit" className="btn btn-primary px-6">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralForm;
