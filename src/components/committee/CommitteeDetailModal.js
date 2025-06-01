import React, { useState, useCallback } from 'react';
import { Modal, Button, Card, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import StatusUpdateModal from '../common/StatusUpdateModal';
import { authApis, endpoints } from '../../configs/Apis';

const CommitteeDetailModal = ({ show, onHide, committee, isAcademicStaff }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  if (!committee) return null;
  
  // Status options for committee
  const committeeStatusOptions = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'LOCKED', label: 'Đã khóa' }
  ];
  
  // Handle committee status update
  const handleUpdateCommitteeStatus = useCallback(async (newStatus) => {
    try {
      await authApis().patch(
        `${endpoints["committees"]}/${committee.id}`,
        { status: newStatus }
      );
      
      // Update local state
      committee.status = newStatus;
      
      alert("Cập nhật trạng thái hội đồng thành công!");
      return true;
    } catch (err) {
      console.error("Error updating committee status:", err);
      throw new Error("Không thể cập nhật trạng thái!");
    }
  }, [committee]);
  
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
        <Modal.Title>Chi tiết hội đồng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Thông tin cơ bản</h5>
            <Badge bg={committee.status === 'ACTIVE' ? 'success' : 'secondary'}>
              {committee.status}
            </Badge>
          </Card.Header>
          <Card.Body>
            <Row className="mt-3">
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Mã hội đồng:</strong> {committee.id}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Ngày bảo vệ:</strong> {committee.defenseDate ? new Date(committee.defenseDate).toLocaleString('vi-VN') : 'Chưa có'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Địa điểm:</strong> {committee.location || 'Chưa có'}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Trạng thái:</strong> {committee.status}
                    {isAcademicStaff && (
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => setShowStatusModal(true)}
                      >
                        Cập nhật
                      </Button>
                    )}
                  </ListGroup.Item>
                </ListGroup>
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

      {/* Status Update Modal */}
      <StatusUpdateModal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        title={`Hội đồng #${committee.id}`}
        currentStatus={committee.status}
        statusOptions={committeeStatusOptions}
        onSubmit={handleUpdateCommitteeStatus}
      />
    </Modal>
  );
};

export default CommitteeDetailModal;