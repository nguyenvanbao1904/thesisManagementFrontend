import { useState, useCallback } from "react";
import { authApis, endpoints } from "../configs/Apis";

export const useEvaluationCriteriaCollectionData = () => {
  const [data, setData] = useState({
    collections: [],
    allCriterias: [],
  });

  const [pagination, setPagination] = useState({
    collectionsPage: 1,
    criteriasPage: 1,
  });

  const [collectionDetails, setCollectionDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load collections
  const loadCollections = useCallback(async (page) => {
    setLoading(true);
    setError("");

    try {
      const url = `${endpoints["evaluation_criteria_collections"]}?page=${page}`;
      const response = await authApis().get(url);
      const collections = response.data || [];

      if (collections.length === 0) {
        setPagination(prev => ({ ...prev, collectionsPage: 0 }));
      } else {
        setData(prev => ({
          ...prev,
          collections: page === 1 ? collections : [...prev.collections, ...collections]
        }));
      }
    } catch (err) {
      console.error("Error loading collections:", err);
      setError("Không thể tải danh sách bộ tiêu chí");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load criterias for form
  const loadCriterias = useCallback(async (page) => {
    try {
      const url = `${endpoints["evaluation_criterias"]}?page=${page}`;
      const response = await authApis().get(url);
      const criterias = response.data || [];

      if (criterias.length === 0) {
        setPagination(prev => ({ ...prev, criteriasPage: 0 }));
      } else {
        setData(prev => ({
          ...prev,
          allCriterias: page === 1 ? criterias : [...prev.allCriterias, ...criterias]
        }));
      }
    } catch (err) {
      console.error("Error loading criterias:", err);
    }
  }, []); // Không có dependency

  // Load collection details for accordion
  const loadCollectionDetails = useCallback(async (collectionId) => {
    // Kiểm tra đã có data hay đang load
    if (collectionDetails[collectionId] || loadingDetails[collectionId]) {
      return;
    }

    setLoadingDetails(prev => ({ ...prev, [collectionId]: true }));

    try {
      const response = await authApis().get(
        `${endpoints["evaluation_criteria_collections"]}/${collectionId}`
      );
      
      setCollectionDetails(prev => ({
        ...prev,
        [collectionId]: response.data
      }));
    } catch (err) {
      console.error("Error loading collection details:", err);
      setError("Không thể tải thông tin chi tiết bộ tiêu chí");
    } finally {
      setLoadingDetails(prev => ({ ...prev, [collectionId]: false }));
    }
  }, [collectionDetails, loadingDetails]); // Thêm dependency

  // Load collection for editing
  const loadCollectionForEdit = useCallback(async (collectionId) => {
    setLoading(true);
    try {
      const response = await authApis().get(
        `${endpoints["evaluation_criteria_collections"]}/${collectionId}`
      );
      return response.data;
    } catch (err) {
      console.error("Error loading collection for edit:", err);
      setError("Không thể tải thông tin chi tiết bộ tiêu chí");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    pagination,
    collectionDetails,
    loadingDetails,
    loading,
    error,
    loadCollections,
    loadCriterias,
    loadCollectionDetails,
    loadCollectionForEdit,
    setPagination,
    setLoading,
    setError,
    setCollectionDetails,
    setData,
  };
};