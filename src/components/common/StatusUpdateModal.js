import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const StatusUpdateModal = ({ 
  show, 
  onHide, 
  title, 
  currentStatus, 
  statusOptions, 
  onSubmit,
  loading 
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedStatus(currentStatus);
    setError(null);
  }, [currentStatus, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedStatus === currentStatus) {
      onHide();
      return;
    }

    setError(null);
    
    try {
      await onSubmit(selectedStatus);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật trạng thái hội đồng</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <h6 className="mb-3">{title}</h6>
          
          {error && (
            <Alert variant="danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Trạng thái hiện tại</Form.Label>
            <Form.Control 
              type="text" 
              value={statusOptions.find(opt => opt.value === currentStatus)?.label || currentStatus}
              disabled 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trạng thái mới</Form.Label>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || selectedStatus === currentStatus}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang cập nhật...
              </>
            ) : (
              <>
                <i className="fas fa-save me-1"></i>
                Cập nhật
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StatusUpdateModal;