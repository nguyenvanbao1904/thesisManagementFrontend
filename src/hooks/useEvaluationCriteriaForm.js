import { useState, useCallback } from "react";

const initialFormState = {
  name: "",
  description: "",
  maxPoint: 10,
};

export const useEvaluationCriteriaForm = () => {
  const [formData, setFormData] = useState(initialFormState);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "maxPoint" ? parseInt(value, 10) : value 
    }));
  }, []);

  return {
    formData,
    resetForm,
    handleInputChange,
    setFormData
  };
};