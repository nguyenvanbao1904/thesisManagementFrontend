import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Badge, Alert } from 'react-bootstrap';
import SupervisorThesesTab from './SupervisorThesesTab';
import ReviewerThesesTab from './ReviewerThesesTab';
import CommitteeTab from './CommitteeTab';
import EvaluationModal from './EvaluationModal';
import ThesisDetailModal from './ThesisDetailModal';
import MySpinner from '../layouts/MySpinner';
import { useLecturerAssignments } from '../../hooks/useLecturerAssignments';
import { useEvaluation } from '../../hooks/useEvaluation';

/**
 * Trang quản lý công việc của giảng viên
 */
const LecturerAssignments = () => {
  // Hook quản lý dữ liệu công việc
  const { 
    assignments, 
    committees, 
    thesesDetails,
    loading, 
    error, 
    loadThesisDetails 
  } = useLecturerAssignments();
  
  // Hook quản lý chấm điểm
  const {
    evaluationCriteria,
    scores,
    comments,
    loading: evalLoading,
    loadEvaluationCriteria,
    loadExistingScores,
    handleScoreChange,
    handleCommentChange,
    calculateTotalScore,
    submitScores
  } = useEvaluation();

  // State quản lý modal và thesis đang được xử lý
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [detailType, setDetailType] = useState(null);

  /**
   * Xử lý xem chi tiết khóa luận
   * @param {Object} thesis - Khóa luận
   * @param {string} type - Loại xem (supervisor/reviewer/committee)
   */
  const handleViewDetail = async (thesis, type) => {
    let thesisData = thesis;
    
    // Nếu thesis chưa có đầy đủ thông tin, tải thêm
    if (thesis.needsLoadDetails) {
      try {
        const loadedThesis = await loadThesisDetails(thesis.id);
        if (loadedThesis) {
          thesisData = {...loadedThesis, committeeId: thesis.committeeId};
        } else {
          alert("Không thể tải thông tin khóa luận. Vui lòng thử lại sau.");
          return;
        }
      } catch (err) {
        alert("Không thể tải thông tin khóa luận. Vui lòng thử lại sau.");
        return;
      }
    }
    
    // Hiển thị modal chi tiết
    setSelectedThesis(thesisData);
    setDetailType(type);
    setShowDetailModal(true);
  };

  /**
   * Xử lý chấm điểm khóa luận
   * @param {Object} committee - Hội đồng
   * @param {Object} thesis - Khóa luận
   */
  const handleEvaluateThesis = async (committee, thesis) => {
    let thesisData = thesis;
    
    // Tải thông tin chi tiết nếu cần
    if (thesis.needsLoadDetails) {
      try {
        const loadedThesis = await loadThesisDetails(thesis.id);
        if (loadedThesis) {
          thesisData = {...loadedThesis, committeeId: committee.id};
        } else {
          alert("Không thể tải thông tin khóa luận. Vui lòng thử lại sau.");
          return;
        }
      } catch (err) {
        alert("Không thể tải thông tin khóa luận. Vui lòng thử lại sau.");
        return;
      }
    }
    
    setSelectedCommittee(committee);
    setSelectedThesis(thesisData);
    
    try {
      // Kiểm tra bộ tiêu chí đánh giá
      if (!thesisData.evaluationCriteriaCollectionId) {
        alert("Khóa luận này chưa được gán bộ tiêu chí đánh giá!");
        return;
      }
      
      // Tải bộ tiêu chí đánh giá
      const criteriaSuccess = await loadEvaluationCriteria(thesisData.id);
      
      if (!criteriaSuccess) {
        alert("Không thể tải bộ tiêu chí đánh giá. Vui lòng thử lại sau.");
        return;
      }
      
      // Tải điểm hiện có (nếu có)
      await loadExistingScores(thesisData.id, committee.lecturerId);
      
      // Hiển thị modal chấm điểm
      setShowEvaluationModal(true);
    } catch (error) {
      alert("Có lỗi khi chuẩn bị bộ tiêu chí chấm điểm!");
    }
  };

  /**
   * Xử lý lưu điểm đánh giá
   */
  const handleSubmitScores = async () => {
    const success = await submitScores(selectedThesis, selectedCommittee);
    if (success) {
      setShowEvaluationModal(false);
    }
  };

  // Hiển thị spinner khi đang tải
  if (loading && assignments.supervisorTheses.length === 0) {
    return <MySpinner />;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Công việc được phân công</h2>
          
          <Tabs defaultActiveKey="supervisor" className="mb-3">
            {/* Tab hướng dẫn khóa luận */}
            <Tab eventKey="supervisor" title={
              <span>
                Hướng dẫn khóa luận 
                <Badge bg="primary" className="ms-2">
                  {assignments.supervisorTheses.length}
                </Badge>
              </span>
            }>
              <SupervisorThesesTab
                assignments={assignments}
                loading={loading}
                onViewDetail={handleViewDetail}
              />
            </Tab>

            {/* Tab phản biện khóa luận */}
            <Tab eventKey="reviewer" title={
              <span>
                Phản biện khóa luận 
                <Badge bg="warning" className="ms-2">
                  {assignments.reviewerTheses.length}
                </Badge>
              </span>
            }>
              <ReviewerThesesTab
                assignments={assignments}
                loading={loading}
                onViewDetail={handleViewDetail}
              />
            </Tab>

            {/* Tab hội đồng chấm điểm */}
            <Tab eventKey="committee" title={
              <span>
                Hội đồng chấm điểm 
                <Badge bg="success" className="ms-2">
                  {committees.length}
                </Badge>
              </span>
            }>
              <CommitteeTab
                assignments={assignments}
                committees={committees}
                thesesDetails={thesesDetails}
                loading={loading}
                onViewDetail={handleViewDetail}
                onEvaluateThesis={handleEvaluateThesis}
                loadThesisDetails={loadThesisDetails}
              />
            </Tab>
          </Tabs>

          {/* Modal đánh giá khóa luận */}
          <EvaluationModal
            show={showEvaluationModal}
            onHide={() => setShowEvaluationModal(false)}
            selectedThesis={selectedThesis}
            selectedCommittee={selectedCommittee}
            evaluationCriteria={evaluationCriteria}
            scores={scores}
            comments={comments}
            loading={evalLoading}
            onScoreChange={handleScoreChange}
            onCommentChange={handleCommentChange}
            calculateTotalScore={calculateTotalScore}
            onSubmitScores={handleSubmitScores}
          />
          
          {/* Modal xem chi tiết khóa luận */}
          <ThesisDetailModal
            show={showDetailModal}
            onHide={() => setShowDetailModal(false)}
            thesis={selectedThesis}
            type={detailType}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default LecturerAssignments;