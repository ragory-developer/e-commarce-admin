"use client";
import React from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { HiOutlineTrash } from "react-icons/hi";
import { useFormState } from "../../Context/FormContext";

const ATTRIBUTE_OPTIONS = {
  size: [
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "lg", label: "LG" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
  ],
  color: [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
  ],
};

const AttributesForm = ({ onNext }) => {
  const { formData, saveTabData } = useFormState();

  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      attributes:
        formData.attributes?.length > 0
          ? formData.attributes
          : [{ name: "", values: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const watchAttributes = useWatch({
    control,
    name: "attributes",
  });

  const onSubmit = (data) => {
    const formattedData = data.attributes.map((attr) => ({
      ...attr,
      values: attr.values.map((v) => v.value),
    }));
    saveTabData("attributes", formattedData);
    onNext();
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-visible shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-gray-700 font-medium">Attributes</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="text-gray-400 text-sm font-normal border-b border-gray-100">
              <th className="pb-3 font-normal">Attribute</th>
              <th className="pb-3 font-normal">Values</th>
              <th className="pb-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {fields.map((field, index) => {
              const selectedAttrName = watchAttributes[index]?.name;
              const availableOptions =
                ATTRIBUTE_OPTIONS[selectedAttrName] || [];

              return (
                <tr key={field.id} className="group">
                  <td className="py-3 pr-4 align-top">
                    <select
                      {...register(`attributes.${index}.name`, {
                        onChange: (e) => {
                          setValue(`attributes.${index}.values`, []);
                        },
                      })}
                      className="select select-bordered w-full h-10 min-h-0 font-normal focus:outline-teal-500 bg-white"
                    >
                      <option value="">Please Select</option>
                      <option value="color">Color</option>
                      <option value="size">Size</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <Controller
                      control={control}
                      name={`attributes.${index}.values`}
                      render={({ field: { onChange, value, ref } }) => (
                        <Select
                          ref={ref}
                          isMulti
                          options={availableOptions}
                          value={value}
                          onChange={onChange}
                          placeholder={
                            selectedAttrName
                              ? `Select ${selectedAttrName}...`
                              : "Select attribute first"
                          }
                          isDisabled={!selectedAttrName}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                  </td>
                  <td className="py-3 text-right align-top">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          type="button"
          onClick={() => append({ name: "", values: [] })}
          className="btn btn-sm mt-4 bg-gray-100 border-none text-gray-700 hover:bg-gray-200 capitalize"
        >
          Add Attribute
        </button>

        <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="btn bg-teal-600 hover:bg-teal-700 text-white border-none px-8 capitalize"
          >
            Continue to next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttributesForm;
