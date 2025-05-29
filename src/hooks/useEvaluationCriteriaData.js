import { useState, useCallback } from "react";
import { authApis, endpoints } from "../configs/Apis";

export const useEvaluationCriteriaData = () => {
  const [data, setData] = useState({
    evaluationCriterias: []
  });
  
  const [pagination, setPagination] = useState({
    evaluationCriteriasPage: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvaluationCriterias = useCallback(async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${endpoints["evaluation_criterias"]}?page=${pageNumber}`;
      const res = await authApis().get(url);
      
      if (res.data.length === 0) {
        setPagination(prev => ({ ...prev, evaluationCriteriasPage: 0 }));
      } else {
        setData(prev => ({
          ...prev,
          evaluationCriterias: pageNumber === 1 ? res.data : [...prev.evaluationCriterias, ...res.data]
        }));
      }
    } catch (err) {
      setError(`Lỗi khi tải tiêu chí: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    loadEvaluationCriterias,
    setPagination,
    setLoading
  };
};