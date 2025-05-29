import { useState, useCallback } from "react";

const initialFormState = {
  title: "",
  description: "",
  lecturerIds: [],
  studentIds: [],
  committeeId: "",
  evaluationCriteriaCollectionId: "",
  reviewerId: "",
  file: null,
  fileUrl: "",
};

export const useThesisForm = () => {
  const [formData, setFormData] = useState(initialFormState);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleLecturerSelection = useCallback((lecturerId) => {
    setFormData(prev => ({
      ...prev,
      lecturerIds: prev.lecturerIds.includes(lecturerId)
        ? prev.lecturerIds.filter(id => id !== lecturerId)
        : [...prev.lecturerIds, lecturerId]
    }));
  }, []);

  const handleStudentSelection = useCallback((studentId) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  }, []);

  const handleCommitteeSelection = useCallback((event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, committeeId: value }));
  }, []);

  const handleEvaluationCriteriaCollectionSelection = useCallback((event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, evaluationCriteriaCollectionId: value }));
  }, []);

  const handleReviewerSelection = useCallback((event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, reviewerId: value }));
  }, []);

  const handleFileChange = useCallback((file) => {
    setFormData(prev => ({ ...prev, file }));
  }, []);

  const handleCommitteeChange = useCallback((committeeId) => {
    setFormData(prev => ({ ...prev, committeeId }));
  }, []);

  const handleEvaluationCriteriaCollectionChange = useCallback((evaluationCriteriaCollectionId) => {
    setFormData(prev => ({ ...prev, evaluationCriteriaCollectionId }));
  }, []);

  const handleReviewerChange = useCallback((reviewerId) => {
    setFormData(prev => ({ ...prev, reviewerId }));
  }, []);

  return {
    formData,
    resetForm,
    handleInputChange,
    handleLecturerSelection,
    handleStudentSelection,
    handleCommitteeSelection,
    handleEvaluationCriteriaCollectionSelection,
    handleReviewerSelection,
    handleFileChange,
    setFormData,
    handleCommitteeChange,
    handleEvaluationCriteriaCollectionChange,
    handleReviewerChange
  };
};