"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  HiOutlineTrash,
  HiOutlinePhotograph,
  HiOutlineInformationCircle,
  HiX,
} from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useFormState } from "../../Context/FormContext";

const LabelSection = ({ nestIndex, control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variations.${nestIndex}.labels`,
  });

  return (
    <div className="mt-4 px-4 pb-4">
      <label className="label-text mb-2 text-gray-600 font-medium block">
        Label <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white"
          >
            <input
              {...register(`variations.${nestIndex}.labels.${index}.value`)}
              className="flex-1 px-3 py-2 outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border-l border-gray-200"
            >
              <HiOutlineTrash size={18} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ value: "" })}
        className="btn btn-sm bg-gray-100 border-none text-gray-700 hover:bg-gray-200 capitalize mt-4"
      >
        Add Row
      </button>
    </div>
  );
};

const VariationsForm = ({ onNext }) => {
  const { formData, saveTabData } = useFormState();
  const fileInputRefs = useRef({});
  const [openVariants, setOpenVariants] = useState({});
  const [previews, setPreviews] = useState({});

  const { register, control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      default_variant: formData.default_variant || "",
      variations:
        formData.variations?.length > 0
          ? formData.variations
          : [{ name: "", type: "", labels: [] }],
      variant_details: formData.variant_details || {},
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const watchedVariations = useWatch({ control, name: "variations" });
  const watchedDefaultVariant = useWatch({ control, name: "default_variant" });

  const activeLabels = useMemo(() => {
    return (
      watchedVariations
        ?.flatMap((v, vIdx) =>
          (v.labels || []).map((l, lIdx) => ({ ...l, vIdx, lIdx })),
        )
        .filter((l) => l.value?.trim() !== "") || []
    );
  }, [watchedVariations]);

  useEffect(() => {
    if (activeLabels.length > 0 && !watchedDefaultVariant) {
      setValue("default_variant", activeLabels[0].value);
    }
  }, [activeLabels, watchedDefaultVariant, setValue]);

  useEffect(() => {
    watchedVariations?.forEach((v, i) => {
      if (v.type && (!v.labels || v.labels.length === 0)) {
        setValue(`variations.${i}.labels`, [{ value: "" }]);
      }
    });
  }, [watchedVariations, setValue]);

  const toggleVariant = (id) => {
    setOpenVariants((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImageChange = (e, uniqueId) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => ({
        ...prev,
        [uniqueId]: [...(prev[uniqueId] || []), ...newPreviews],
      }));

      const currentFiles =
        getValues(`variant_details.${uniqueId}.images`) || [];
      setValue(`variant_details.${uniqueId}.images`, [
        ...currentFiles,
        ...files,
      ]);
    }
  };

  const removePreview = (uniqueId, index) => {
    setPreviews((prev) => {
      const updated = [...prev[uniqueId]];
      updated.splice(index, 1);
      return { ...prev, [uniqueId]: updated };
    });

    // Remove File object from form state
    const currentFiles = getValues(`variant_details.${uniqueId}.images`);
    if (currentFiles) {
      const updatedFiles = [...currentFiles];
      updatedFiles.splice(index, 1);
      setValue(`variant_details.${uniqueId}.images`, updatedFiles);
    }
  };

  const onSubmit = (data) => {
    saveTabData("variations", data);
    onNext();
  };

  const handleImageClick = (id) => {
    fileInputRefs.current[id]?.click();
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-gray-700 font-medium">Variations</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-100 rounded-md">
              <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span>New Variation</span>
                </div>
                <HiOutlineTrash
                  className="cursor-pointer hover:text-red-500 text-gray-400"
                  onClick={() => remove(index)}
                />
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label-text mb-2 text-gray-600 font-medium">
                    Name *
                  </label>
                  <input
                    type="text"
                    {...register(`variations.${index}.name`)}
                    className="input input-bordered h-10 w-full focus:outline-teal-500"
                  />
                </div>
                <div className="form-control">
                  <label className="label-text mb-2 text-gray-600 font-medium">
                    Type *
                  </label>
                  <select
                    {...register(`variations.${index}.type`)}
                    className="select select-bordered h-10 min-h-0 w-full focus:outline-teal-500 font-normal"
                  >
                    <option value="">Please Select</option>
                    <option value="Text">Text</option>
                  </select>
                </div>
              </div>
              {watchedVariations[index]?.type && (
                <LabelSection
                  nestIndex={index}
                  control={control}
                  register={register}
                />
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ name: "", type: "", labels: [] })}
            className="btn btn-sm bg-gray-100 border-none text-gray-700 hover:bg-gray-200 capitalize"
          >
            Add Variation
          </button>

          {/* Variants Section */}
          <div className="mt-8 border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b flex justify-between items-center font-medium text-gray-700">
              Variants
            </div>

            <div className="p-4">
              {activeLabels.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-md text-blue-600 text-sm">
                  <HiOutlineInformationCircle size={20} />
                  <span>Please add some variations to generate variants</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="max-w-xs mb-4">
                    <label className="label-text mb-2 text-gray-600 font-medium block">
                      Default Variant
                    </label>
                    <select
                      {...register("default_variant")}
                      className="select select-bordered w-full h-10 min-h-0"
                    >
                      <option value="">Please Select</option>
                      {activeLabels.map((l, i) => (
                        <option key={i} value={l.value}>
                          {l.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeLabels.map((label, idx) => {
                    const uniqueId = `${label.vIdx}-${label.lIdx}`;
                    const isOpen = openVariants[uniqueId] !== false;
                    const isDefault = watchedDefaultVariant === label.value;

                    return (
                      <div
                        key={uniqueId}
                        className="border border-gray-200 rounded-lg overflow-hidden mb-4"
                      >
                        <div
                          className="bg-gray-50 px-4 py-2 flex justify-between border-b items-center cursor-pointer"
                          onClick={() => toggleVariant(uniqueId)}
                        >
                          <span className="font-bold text-gray-700">
                            {label.value}{" "}
                            {isDefault && (
                              <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">
                                Default
                              </span>
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            {isOpen ? (
                              <IoIosArrowUp className="text-gray-400" />
                            ) : (
                              <IoIosArrowDown className="text-gray-400" />
                            )}
                          </div>
                        </div>

                        {isOpen && (
                          <div className="p-4 flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col gap-2">
                              <div
                                onClick={() => handleImageClick(uniqueId)}
                                className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                              >
                                <HiOutlinePhotograph size={40} />
                                <span className="text-xl font-bold">+</span>
                                <input
                                  type="file"
                                  multiple
                                  className="hidden"
                                  ref={(el) =>
                                    (fileInputRefs.current[uniqueId] = el)
                                  }
                                  onChange={(e) =>
                                    handleImageChange(e, uniqueId)
                                  }
                                />
                              </div>
                              {/* Preview Gallery */}
                              <div className="flex flex-wrap gap-2 w-32">
                                {previews[uniqueId]?.map((url, i) => (
                                  <div
                                    key={i}
                                    className="relative w-9 h-9 border rounded-md overflow-hidden"
                                  >
                                    <img
                                      src={url}
                                      alt="prev"
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removePreview(uniqueId, i);
                                      }}
                                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                                    >
                                      <HiX size={8} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="form-control">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  SKU
                                </label>
                                <input
                                  {...register(
                                    `variant_details.${uniqueId}.sku`,
                                  )}
                                  className="input input-bordered h-10 w-full"
                                />
                              </div>
                              <div className="form-control">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Price *
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2 text-gray-400">
                                    $
                                  </span>
                                  <input
                                    {...register(
                                      `variant_details.${uniqueId}.price`,
                                    )}
                                    className="input input-bordered h-10 w-full pl-7"
                                  />
                                </div>
                              </div>
                              <div className="form-control">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Special Price
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2 text-gray-400">
                                    $
                                  </span>
                                  <input
                                    {...register(
                                      `variant_details.${uniqueId}.special_price`,
                                    )}
                                    className="input input-bordered h-10 w-full pl-7"
                                  />
                                </div>
                              </div>
                              <div className="form-control">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Special Price Type
                                </label>
                                <select
                                  {...register(
                                    `variant_details.${uniqueId}.special_price_type`,
                                  )}
                                  className="select select-bordered h-10 min-h-0 w-full font-normal"
                                >
                                  <option value="fixed">Fixed</option>
                                  <option value="percent">Percent</option>
                                </select>
                              </div>
                              <div className="form-control">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Special Price Start
                                </label>
                                <input
                                  type="date"
                                  {...register(
                                    `variant_details.${uniqueId}.special_price_start`,
                                  )}
                                  className="input input-bordered h-10 w-full"
                                />
                              </div>
                              <div className="form-control">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Special Price End
                                </label>
                                <input
                                  type="date"
                                  {...register(
                                    `variant_details.${uniqueId}.special_price_end`,
                                  )}
                                  className="input input-bordered h-10 w-full"
                                />
                              </div>
                              <div className="form-control">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Quantity
                                </label>
                                <input
                                  type="number"
                                  {...register(
                                    `variant_details.${uniqueId}.quantity`,
                                  )}
                                  className="input input-bordered h-10 w-full"
                                  placeholder="0"
                                />
                              </div>
                              <div className="form-control">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Stock Availability
                                </label>
                                <select
                                  {...register(
                                    `variant_details.${uniqueId}.stock_status`,
                                  )}
                                  className="select select-bordered h-10 min-h-0 w-full font-normal"
                                >
                                  <option value="in_stock">In Stock</option>
                                  <option value="out_of_stock">
                                    Out of Stock
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
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
    </div>
  );
};

export default VariationsForm;
