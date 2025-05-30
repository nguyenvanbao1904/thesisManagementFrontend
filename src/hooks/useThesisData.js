import { useState, useCallback } from "react";
import { authApis, endpoints } from "../configs/Apis";

export const useThesisData = () => {
  const [data, setData] = useState({
    theses: [],
    lecturers: [],
    students: [],
    committees: [],
    evaluationCriteriaCollections: []
  });
  
  const [pagination, setPagination] = useState({
    thesesPage: 1,
    lecturersPage: 1,
    studentsPage: 1,
    committeesPage: 1,
    evaluationCriteriaCollectionsPage: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic function để load data
  const loadData = useCallback(async (endpoint, role, pageNumber, dataKey, pageKey) => {
    setLoading(true);
    setError(null);
    try {
      const url = role 
        ? `${endpoints.users}?role=${role}&page=${pageNumber}`
        : `${endpoints[endpoint]}?page=${pageNumber}`;
      
      const res = await authApis().get(url);
      
      if (res.data.length === 0) {
        setPagination(prev => ({ ...prev, [pageKey]: 0 }));
      } else {
        setData(prev => ({
          ...prev,
          [dataKey]: pageNumber === 1 ? res.data : [...prev[dataKey], ...res.data]
        }));
      }
    } catch (err) {
      setError(`Lỗi khi tải ${dataKey}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTheses = useCallback((page) => 
    loadData("theses", null, page, "theses", "thesesPage"), [loadData]);
  
  const loadLecturers = useCallback((page) => 
    loadData("users", "ROLE_LECTURER", page, "lecturers", "lecturersPage"), [loadData]);
  
  const loadStudents = useCallback((page) => 
    loadData("users", "ROLE_STUDENT", page, "students", "studentsPage"), [loadData]);
  
  const loadCommittees = useCallback((page) => 
    loadData("committees", null, page, "committees", "committeesPage"), [loadData]);
  
  const loadEvaluationCriteriaCollections = useCallback((page) => 
    loadData("evaluation_criteria_collections", null, page, "evaluationCriteriaCollections", "evaluationCriteriaCollectionsPage"), [loadData]);

  const loadThesisById = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await authApis().get(`${endpoints["theses"]}/${id}`);
        return response.data;
      } catch (err) {
        console.error("Error fetching thesis:", err);
        alert("Không thể tải thông tin khóa luận!");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return {
    data,
    pagination,
    loading,
    error,
    loadTheses,
    loadLecturers,
    loadStudents,
    loadCommittees,
    loadEvaluationCriteriaCollections,
    loadThesisById,
    setPagination,
    setLoading
  };
};