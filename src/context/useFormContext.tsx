"use client"; 

import { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";


interface FormValuesType {
  formValues: {};
  updateFormValues: (x: any) => void;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}


interface Props {
  children: React.ReactNode;
}


const FormContext = createContext<FormValuesType | null>(null);

export const FormProvider = ({ children }: Props) => {
  const [formValues, setFormValues] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormValues = (updatedData: any) => {
    setFormValues((prevData) => ({ ...prevData, ...updatedData }));
  };
  const values = {
    formValues,
    updateFormValues,
    currentStep,
    setCurrentStep,
  };
  return <FormContext.Provider value={values}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === null) {
    throw new Error("context must be used within the context provider");
  }
  return context;
};
