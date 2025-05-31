import React from 'react';
import { Modal, Button, Card, Row, Col, Badge, Table, ListGroup } from 'react-bootstrap';
import { getStatusBadge } from '../../utils/assignmentHelpers';

const ThesisDetailModal = ({ show, onHide, thesis, type }) => {
  if (!thesis) return null;
  console.log(thesis);
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết khóa luận</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Thông tin cơ bản */}
        <Card className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Thông tin cơ bản</h5>
            {thesis.status && getStatusBadge(thesis.status)}
          </Card.Header>
          <Card.Body>
            <h4>{thesis.title}</h4>
            <p className="text-muted">{thesis.description}</p>
            
            <Row className="mt-3">
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Mã khóa luận:</strong> {thesis.id}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Hội đồng:</strong> {thesis.committeeName || `#${thesis.committeeId || 'Chưa có'}`}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Bộ tiêu chí:</strong> {thesis.evaluationCriteriaCollectionName || 'Chưa có'}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Trạng thái:</strong> {thesis.status}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Điểm trung bình:</strong> {thesis.averageScore ? thesis.averageScore.toFixed(2) : 'Chưa có'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Tài liệu:</strong> {thesis.fileUrl ? (
                      <a href={thesis.fileUrl} target="_blank" rel="noopener noreferrer">Xem tài liệu</a>
                    ) : 'Chưa có'}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Thông tin sinh viên */}
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Thông tin sinh viên</h5>
          </Card.Header>
          <Card.Body>
            {thesis.students && thesis.students.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Mã sinh viên</th>
                    <th>Tên sinh viên</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {thesis.students.map(student => (
                    <tr key={student.id}>
                      <td>{student.studentId}</td>
                      <td>{`${student.firstName} ${student.lastName}`}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted">Chưa có sinh viên</p>
            )}
          </Card.Body>
        </Card>

        {/* Thông tin giảng viên */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">Giảng viên & Phản biện</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6>Giảng viên hướng dẫn</h6>
                {thesis.lecturers && thesis.lecturers.length > 0 ? (
                  <ul className="list-unstyled">
                    {thesis.lecturers.map(lecturer => (
                      <li key={lecturer.id}>
                        <Badge bg="primary" className="me-2">GVHD</Badge>
                        {`${lecturer.firstName} ${lecturer.lastName}`}
                        {lecturer.academicDegree && ` (${lecturer.academicDegree})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Chưa có GVHD</p>
                )}
              </Col>
              <Col md={6}>
                <h6>Giảng viên phản biện</h6>
                {thesis.reviewerId ? (
                  <ul className="list-unstyled">
                    <li>
                      <Badge bg="info" className="me-2">Phản biện</Badge>
                      {thesis.reviewerName || `Giảng viên #${thesis.reviewerId}`}
                    </li>
                  </ul>
                ) : (
                  <p className="text-muted">Chưa có giảng viên phản biện</p>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ThesisDetailModal;