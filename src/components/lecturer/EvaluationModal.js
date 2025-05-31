import React from 'react';
import { Modal, Button, Alert, Row, Col, Table, Form, Badge } from 'react-bootstrap';
import { getRoleBadge, getStudentInfo, formatStudentsInfo } from '../../utils/assignmentHelpers';

/**
 * Modal chấm điểm khóa luận
 */
const EvaluationModal = ({
  show,                 // Hiển thị modal
  onHide,               // Hàm đóng modal
  selectedThesis,       // Khóa luận được chấm điểm
  selectedCommittee,    // Hội đồng chấm điểm
  evaluationCriteria,   // Tiêu chí đánh giá
  scores,               // Điểm số theo tiêu chí
  comments,             // Nhận xét theo tiêu chí
  loading,              // Trạng thái loading
  onScoreChange,        // Hàm xử lý thay đổi điểm
  onCommentChange,      // Hàm xử lý thay đổi nhận xét
  calculateTotalScore,  // Hàm tính điểm tổng
  onSubmitScores        // Hàm lưu điểm
}) => {
  // Không hiển thị nếu không có khóa luận
  if (!selectedThesis) return null;
  
  // Lấy thông tin sinh viên (ưu tiên đối tượng nếu có)
  const studentInfo = selectedThesis.students 
    ? formatStudentsInfo(selectedThesis.students)
    : getStudentInfo(selectedThesis.studentIds);
  
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-star text-warning me-2"></i>
          Chấm điểm: {selectedThesis.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedThesis && (
          <>
            {/* Thông tin cơ bản */}
            <Alert variant="primary" className="mb-3">
              <Row>
                <Col md={6}>
                  <strong><i className="fas fa-user-graduate me-1"></i>Sinh viên:</strong> {studentInfo}
                </Col>
                <Col md={6}>
                  <strong><i className="fas fa-users me-1"></i>Hội đồng:</strong> #{selectedCommittee?.id} - {getRoleBadge(selectedCommittee?.memberRole)}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <strong><i className="fas fa-clipboard-list me-1"></i>Bộ tiêu chí:</strong> {selectedThesis.evaluationCriteriaCollectionName}
                </Col>
              </Row>
            </Alert>

            {/* Bảng tiêu chí đánh giá */}
            {evaluationCriteria.length > 0 ? (
              <div>
                <h6 className="mb-3">
                  <i className="fas fa-list-ol me-2"></i>
                  Tiêu chí đánh giá ({evaluationCriteria.length} tiêu chí)
                </h6>
                
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th style={{width: '25%'}}>Tiêu chí</th>
                      <th className="text-center" style={{width: '10%'}}>Điểm tối đa</th>
                      <th className="text-center" style={{width: '10%'}}>Trọng số</th>
                      <th className="text-center" style={{width: '15%'}}>Điểm chấm</th>
                      <th style={{width: '40%'}}>Nhận xét</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationCriteria.map((criteria, index) => (
                      <tr key={criteria.id}>
                        <td>
                          <div className="d-flex align-items-start">
                            <Badge bg="secondary" className="me-2 mt-1">{index + 1}</Badge>
                            <div>
                              <strong>{criteria.name}</strong>
                              <br />
                              <small className="text-muted">{criteria.description}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <Badge bg="info">{criteria.maxPoint}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg="warning">{(criteria.weight * 100).toFixed(1)}%</Badge>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            min="0"
                            max={criteria.maxPoint}
                            step="0.1"
                            value={scores[criteria.id] || ''}
                            onChange={(e) => onScoreChange(criteria.id, e.target.value)}
                            placeholder={`0 - ${criteria.maxPoint}`}
                            className="text-center"
                            style={{fontSize: '1.1em', fontWeight: 'bold'}}
                          />
                        </td>
                        <td>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={comments[criteria.id] || ''}
                            onChange={(e) => onCommentChange(criteria.id, e.target.value)}
                            placeholder="Nhận xét về tiêu chí này..."
                            style={{fontSize: '0.9em'}}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Tổng điểm */}
                <Alert variant="success" className="mt-3">
                  <Row className="align-items-center">
                    <Col>
                      <strong>
                        <i className="fas fa-calculator me-2"></i>
                        Tổng điểm (có trọng số):
                      </strong>
                    </Col>
                    <Col xs="auto">
                      <h4 className="mb-0">
                        <Badge bg="success" style={{fontSize: '1.2em'}}>
                          {calculateTotalScore().toFixed(2)}/10
                        </Badge>
                      </h4>
                    </Col>
                  </Row>
                </Alert>
              </div>
            ) : (
              <Alert variant="warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Không thể tải tiêu chí chấm điểm. Vui lòng thử lại.
              </Alert>
            )}

            {/* Cảnh báo nếu hội đồng đã khóa */}
            {selectedCommittee?.status !== 'ACTIVE' && (
              <Alert variant="danger">
                <i className="fas fa-lock me-2"></i>
                Hội đồng đã được khóa. Bạn không thể chỉnh sửa điểm.
              </Alert>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <i className="fas fa-times me-1"></i>
          Đóng
        </Button>
        <Button 
          variant="success" 
          onClick={onSubmitScores}
          disabled={loading || selectedCommittee?.status !== 'ACTIVE' || evaluationCriteria.length === 0}
          size="lg"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin me-1"></i>
              Đang lưu...
            </>
          ) : (
            <>
              <i className="fas fa-save me-1"></i>
              Lưu điểm
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(EvaluationModal);