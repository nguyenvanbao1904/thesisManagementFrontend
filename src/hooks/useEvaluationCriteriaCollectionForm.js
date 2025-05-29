import { useState, useCallback } from "react";

export const useEvaluationCriteriaCollectionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedCriteriaIds: [],
    criteriaWeights: {},
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      selectedCriteriaIds: [],
      criteriaWeights: {},
    });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleCriteriaSelection = useCallback((criteriaId) => {
    setFormData(prev => {
      const isSelected = prev.selectedCriteriaIds.includes(criteriaId);

      if (isSelected) {
        const newWeights = { ...prev.criteriaWeights };
        delete newWeights[criteriaId];

        return {
          ...prev,
          selectedCriteriaIds: prev.selectedCriteriaIds.filter(id => id !== criteriaId),
          criteriaWeights: newWeights,
        };
      } else {
        const newSelectedIds = [...prev.selectedCriteriaIds, criteriaId];
        const defaultWeight = 1 / newSelectedIds.length;

        const newWeights = {};
        newSelectedIds.forEach(id => {
          newWeights[id] = defaultWeight;
        });

        return {
          ...prev,
          selectedCriteriaIds: newSelectedIds,
          criteriaWeights: newWeights,
        };
      }
    });
  }, []);

  const handleWeightChange = useCallback((criteriaId, value) => {
    const weightValue = parseFloat(value) / 100;
    setFormData(prev => ({
      ...prev,
      criteriaWeights: {
        ...prev.criteriaWeights,
        [criteriaId]: weightValue,
      },
    }));
  }, []);

  const validateWeights = useCallback(() => {
    const { criteriaWeights, selectedCriteriaIds } = formData;
    if (selectedCriteriaIds.length === 0) return true;

    const sum = selectedCriteriaIds.reduce(
      (acc, id) => acc + (criteriaWeights[id] || 0),
      0
    );
    return Math.abs(sum - 1) < 0.01;
  }, [formData]);

  const normalizeWeights = useCallback(() => {
    const { criteriaWeights, selectedCriteriaIds } = formData;
    if (selectedCriteriaIds.length === 0) return;

    const sum = selectedCriteriaIds.reduce(
      (acc, id) => acc + (criteriaWeights[id] || 0),
      0
    );
    if (sum === 0) return;

    const newWeights = {};
    selectedCriteriaIds.forEach(id => {
      newWeights[id] = (criteriaWeights[id] || 0) / sum;
    });

    setFormData(prev => ({
      ...prev,
      criteriaWeights: newWeights,
    }));
  }, [formData]);

  const getTotalWeight = useCallback(() => {
    const { criteriaWeights, selectedCriteriaIds } = formData;
    return selectedCriteriaIds.reduce(
      (acc, id) => acc + (criteriaWeights[id] || 0),
      0
    );
  }, [formData]);

  return {
    formData,
    resetForm,
    handleInputChange,
    handleCriteriaSelection,
    handleWeightChange,
    validateWeights,
    normalizeWeights,
    getTotalWeight,
    setFormData,
  };
};