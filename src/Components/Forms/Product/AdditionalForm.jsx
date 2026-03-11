"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { HiOutlineCalendar } from "react-icons/hi";
import { useFormState } from "../../Context/FormContext";
import DescriptionEditor from "./DescriptionEditor";

const AdditionalForm = ({ onNext }) => {
  const { formData, saveTabData } = useFormState();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData.additional || {
      shortDescription: "",
      newFrom: "",
      newTo: "",
    },
  });

  const onSubmit = (data) => {
    saveTabData("additional", data);
    onNext();
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="text-gray-700 font-medium">Additional</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Rich Text Editor Integration */}
        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            Short Description
          </label>
          <Controller
            name="shortDescription"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DescriptionEditor value={value} onChange={onChange} />
            )}
          />
        </div>

        {/* Date Ranges */}
        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            New From
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <HiOutlineCalendar />
            </span>
            <input
              type="date"
              {...register("newFrom")}
              className="input input-bordered rounded-l-none w-full h-10 focus:outline-teal-500"
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label-text mb-2 text-gray-600 font-medium">
            New To
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <HiOutlineCalendar />
            </span>
            <input
              type="date"
              {...register("newTo")}
              className="input input-bordered rounded-l-none w-full h-10 focus:outline-teal-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="btn bg-primary hover:bg-teal-700 text-white border-none px-8 capitalize"
          >
            Continue to next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdditionalForm;
