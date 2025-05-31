import { useState, useCallback } from 'react';
import { authApis, endpoints } from '../configs/Apis';

/**
 * Hook quản lý chấm điểm khóa luận
 */
export const useEvaluation = () => {
  const [evaluationCriteria, setEvaluationCriteria] = useState([]);  // Tiêu chí đánh giá
  const [scores, setScores] = useState({});                          // Điểm số theo tiêu chí
  const [comments, setComments] = useState({});                      // Nhận xét theo tiêu chí
  const [loading, setLoading] = useState(false);                     // Trạng thái loading

  /**
   * Tải bộ tiêu chí đánh giá của khóa luận
   * @param {number} thesisId - ID của khóa luận
   * @returns {boolean} Kết quả tải tiêu chí
   */
  const loadEvaluationCriteria = useCallback(async (thesisId) => {
    setLoading(true);
    try {
      // Tải thông tin khóa luận để lấy evaluationCriteriaCollectionId
      const thesisRes = await authApis().get(`${endpoints["theses"]}/${thesisId}`);
      const thesis = thesisRes.data;
      
      if (thesis.evaluationCriteriaCollectionId) {
        // Tải bộ tiêu chí
        const criteriaRes = await authApis().get(
          `${endpoints["evaluation_criteria_collections"]}/${thesis.evaluationCriteriaCollectionId}`
        );
        
        // Lọc các tiêu chí có trọng số > 0
        const criteriaList = criteriaRes.data.evaluationCriterias || [];
        const validCriteria = criteriaList.filter(criteria => 
          criteria.weight != null && criteria.weight > 0
        );
        
        setEvaluationCriteria(validCriteria);
        
        if (validCriteria.length === 0) {
          console.warn("No criteria with weight found");
          return false;
        }
        return true;
      } else {
        setEvaluationCriteria([]);
        return false;
      }
    } catch (error) {
      console.error("Error loading criteria:", error);
      setEvaluationCriteria([]);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Tải điểm đánh giá hiện có (nếu có)
   * @param {number} thesisId - ID của khóa luận
   * @param {number} lecturerId - ID của giảng viên (tùy chọn)
   * @returns {boolean} Kết quả tải điểm
   */
  const loadExistingScores = useCallback(async (thesisId, lecturerId = null) => {
    setLoading(true);
    try {
      // Tạo URL theo RESTful: /evaluations/{thesisId}
      const url = `${endpoints["evaluations"]}/${thesisId}`;
      
      // Tạo params (chỉ có lecturerId nếu được cung cấp)
      const params = lecturerId ? { lecturerId } : {};

      // Gọi API với URL và params mới
      const res = await authApis().get(url, { params });
      
      if (res.data?.length > 0) {
        // Chuyển đổi mảng thành object với key là criteriaId
        const scoresMap = {};
        const commentsMap = {};
        
        res.data.forEach(evaluation => {
          scoresMap[evaluation.criteriaId] = evaluation.score;
          commentsMap[evaluation.criteriaId] = evaluation.comment || '';
        });
        
        setScores(scoresMap);
        setComments(commentsMap);
      } else {
        setScores({});
        setComments({});
      }
      return true;
    } catch (error) {
      // 404 là bình thường khi chưa có điểm
      if (error.response?.status === 404) {
        setScores({});
        setComments({});
        return true;
      }
      
      console.error("Error loading scores:", error);
      setScores({});
      setComments({});
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Xử lý thay đổi điểm
   * @param {number} criteriaId - ID của tiêu chí
   * @param {number} score - Điểm số
   */
  const handleScoreChange = useCallback((criteriaId, score) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: parseFloat(score) || 0
    }));
  }, []);

  /**
   * Xử lý thay đổi nhận xét
   * @param {number} criteriaId - ID của tiêu chí
   * @param {string} comment - Nội dung nhận xét
   */
  const handleCommentChange = useCallback((criteriaId, comment) => {
    setComments(prev => ({
      ...prev,
      [criteriaId]: comment
    }));
  }, []);

  /**
   * Tính điểm tổng có tính trọng số
   * @returns {number} Điểm tổng (thang 10)
   */
  const calculateTotalScore = useCallback(() => {
    return evaluationCriteria.reduce((total, criteria) => {
      const score = scores[criteria.id] || 0;
      const weight = criteria.weight || 0;
      const maxScore = criteria.maxPoint || 0;
      // Quy đổi về thang 10 và nhân với trọng số
      return total + (score/maxScore*10 * weight);
    }, 0);
  }, [evaluationCriteria, scores]);

  /**
   * Gửi điểm đánh giá lên server
   * @param {Object} thesis - Thông tin khóa luận
   * @param {Object} committee - Thông tin hội đồng
   * @returns {boolean} Kết quả lưu điểm
   */
  const submitScores = useCallback(async (thesis, committee) => {
    if (!thesis || !committee) return false;
    
    setLoading(true);
    try {
      // Kiểm tra xem có điểm chưa
      if (Object.keys(scores).length === 0) {
        alert("Bạn chưa chấm điểm cho bất kỳ tiêu chí nào!");
        return false;
      }

      // Chuẩn bị dữ liệu gửi lên server
      const evaluations = Object.entries(scores)
        .filter(([_, score]) => score !== undefined && score !== null)
        .map(([criteriaId, score]) => ({
          thesisId: thesis.id,
          criteriaId: parseInt(criteriaId),
          score: parseFloat(score),
          lecturerId: committee.lecturerId,
          comment: comments[criteriaId] || ""
        }));

      // Gửi lên server
      const res = await authApis().post(endpoints["evaluations"], evaluations);
      
      if (res.status === 201 || res.status === 200) {
        alert("Chấm điểm thành công!");
        return true;
      }
      
      alert("Có lỗi khi lưu điểm đánh giá. Vui lòng thử lại!");
      return false;
    } catch (error) {
      alert("Có lỗi khi lưu điểm đánh giá: " + 
            (error.response?.data?.message || "Vui lòng thử lại!"));
      return false;
    } finally {
      setLoading(false);
    }
  }, [scores, comments]);

  // Export các giá trị và hàm cần thiết
  return {
    evaluationCriteria,
    scores,
    comments,
    loading,
    loadEvaluationCriteria,
    loadExistingScores,
    handleScoreChange,
    handleCommentChange,
    calculateTotalScore,
    submitScores
  };
};