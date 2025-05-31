import { useState, useEffect, useCallback } from 'react';
import { authApis, endpoints } from '../configs/Apis';

/**
 * Hook quản lý dữ liệu công việc của giảng viên
 * Bao gồm khóa luận hướng dẫn, phản biện, và các hội đồng
 */
export const useLecturerAssignments = () => {
  // State quản lý dữ liệu
  const [assignments, setAssignments] = useState({
    supervisorTheses: [],   // Khóa luận hướng dẫn
    reviewerTheses: [],     // Khóa luận phản biện
    committeeMembers: []    // Thành viên hội đồng
  });
  const [committees, setCommittees] = useState([]);         // Danh sách hội đồng
  const [thesesDetails, setThesesDetails] = useState({});   // Chi tiết khóa luận (cache)
  const [loading, setLoading] = useState(true);             // Trạng thái loading
  const [error, setError] = useState(null);                 // Lỗi (nếu có)

  /**
   * Tải thông tin chi tiết của một khóa luận
   * @param {number} thesisId - ID của khóa luận
   * @returns {Object|null} Thông tin chi tiết hoặc null nếu có lỗi
   */
  const loadThesisDetails = useCallback(async (thesisId) => {
    try {
      // Kiểm tra nếu đã có trong cache
      if (thesesDetails[thesisId]) {
        return thesesDetails[thesisId];
      }
      
      // Tải từ API
      const res = await authApis().get(`${endpoints["theses"]}/${thesisId}`);
      
      // Cập nhật cache
      setThesesDetails(prev => ({
        ...prev,
        [thesisId]: res.data
      }));
      
      return res.data;
    } catch (error) {
      console.error(`Error loading thesis ${thesisId} details:`, error);
      return null;
    }
  }, [thesesDetails]);

  /**
   * Tải nhiều khóa luận cùng lúc (hiệu quả hơn)
   * @param {number[]} thesisIds - Danh sách ID khóa luận cần tải
   */
  const loadAllThesesDetails = useCallback(async (thesisIds) => {
    try {
      // Chỉ tải những thesis chưa có trong cache
      const idsToLoad = thesisIds.filter(id => !thesesDetails[id]);
      
      if (idsToLoad.length === 0) return;
      
      // Tạo nhiều promise để tải song song
      const promises = idsToLoad.map(async (id) => {
        try {
          const res = await authApis().get(`${endpoints["theses"]}/${id}`);
          return { id, data: res.data };
        } catch (error) {
          console.error(`Error loading thesis ${id}:`, error);
          return { id, data: null };
        }
      });
      
      const results = await Promise.all(promises);
      
      // Cập nhật cache
      const newDetails = {};
      results.forEach(result => {
        if (result.data) {
          newDetails[result.id] = result.data;
        }
      });
      
      setThesesDetails(prev => ({
        ...prev,
        ...newDetails
      }));
    } catch (error) {
      console.error("Error loading multiple thesis details:", error);
    }
  }, [thesesDetails]);

  /**
   * Tải thông tin chi tiết của các hội đồng
   * @param {Object[]} committeeMembers - Danh sách thành viên hội đồng
   */
  const loadCommitteesDetails = useCallback(async (committeeMembers) => {
    try {
      // Tải thông tin chi tiết của từng hội đồng
      const committeePromises = committeeMembers.map(async (committee) => {
        try {
          const res = await authApis().get(`${endpoints["committees"]}/${committee.id}`);
          return {
            ...committee,
            ...res.data,
            memberRole: committee.memberRole // Giữ lại vai trò
          };
        } catch (error) {
          // Fallback nếu lỗi
          return {
            ...committee,
            defenseDate: new Date(),
            location: 'N/A',
            status: 'UNKNOWN',
            theses: []
          };
        }
      });
      
      const committeesData = await Promise.all(committeePromises);
      
      // Tìm tất cả thesisIds để tải chi tiết
      const allThesisIds = new Set();
      committeesData.forEach(committee => {
        if (committee.thesesIds && Array.isArray(committee.thesesIds)) {
          committee.thesesIds.forEach(id => allThesisIds.add(id));
        }
      });
      
      // Tải chi tiết khóa luận
      if (allThesisIds.size > 0) {
        await loadAllThesesDetails(Array.from(allThesisIds));
      }
      
      setCommittees(committeesData);
    } catch (error) {
      console.error("Error loading committees details:", error);
    }
  }, [loadAllThesesDetails]);

  /**
   * Lấy tất cả khóa luận của một hội đồng
   * @param {number} committeeId - ID của hội đồng
   * @returns {Object[]} Danh sách khóa luận
   */
  const loadCommitteeTheses = useCallback(async (committeeId) => {
    try {
      const res = await authApis().get(`${endpoints["committees"]}/${committeeId}/theses`);
      
      // Cập nhật cache luôn
      const newThesesDetails = {...thesesDetails};
      res.data.forEach(thesis => {
        newThesesDetails[thesis.id] = thesis;
      });
      setThesesDetails(newThesesDetails);
      
      return res.data;
    } catch (error) {
      console.error(`Error loading theses for committee ${committeeId}:`, error);
      return [];
    }
  }, [thesesDetails]);

  /**
   * Tải tất cả công việc của giảng viên
   */
  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Tải danh sách công việc
      const res = await authApis().get(endpoints["lecturer_assignments"]);
      setAssignments(res.data);

      // Chuyển đổi committeeMembers thành dạng hội đồng
      const committeesFromMembers = res.data.committeeMembers.map(member => ({
        id: member.committeeId,
        memberRole: member.role,
        lecturerId: member.lecturerId,
        lecturerName: member.lecturerName,
        academicDegree: member.academicDegree,
        academicTitle: member.academicTitle
      }));
      
      // Tải chi tiết hội đồng
      await loadCommitteesDetails(committeesFromMembers);
    } catch (error) {
      console.error("Error loading assignments:", error);
      setError("Lỗi khi tải danh sách công việc!");
    } finally {
      setLoading(false);
    }
  }, [loadCommitteesDetails]);

  // Tải dữ liệu khi component mount
  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Export các giá trị và hàm cần thiết
  return {
    assignments,
    committees,
    thesesDetails,
    loading,
    error,
    loadAssignments,
    loadThesisDetails,
    loadAllThesesDetails,
    loadCommitteeTheses
  };
};