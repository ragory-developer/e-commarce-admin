import GeneralForm from "@/Components/Forms/Variation/GeneralForm";
import TabbedLayout from "@/Components/Layout/TabbedLayout";
import React from "react";

const CreateVariation = () => {
  const variationTab = [
    { label: "General", component: <GeneralForm></GeneralForm> },
  ];
  return (
    <div>
      <h1 className="text-primary text-3xl font-bold mb-5">Create Variation</h1>
      <TabbedLayout tabs={variationTab}></TabbedLayout>
    </div>
  );
};

export default CreateVariation;
