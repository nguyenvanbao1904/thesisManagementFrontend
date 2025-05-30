import React from "react";
import PropTypes from "prop-types";
import { Card, Row, Col, Form, Alert } from "react-bootstrap";

const ThesesSelectionField = React.memo(({
  theses,
  selectedIds,
  onSelection
}) => {
  // Đảm bảo selectedIds luôn là array
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];

  return (
    <>
      <h6>Chọn khóa luận cho hội đồng</h6>
      
      {/* Hiển thị thông tin các khóa luận đã chọn */}
      {safeSelectedIds.length > 0 && (
        <Alert variant="info" className="mb-3">
          <strong>Đã chọn {safeSelectedIds.length} khóa luận:</strong>
          <ul className="mb-0 mt-2">
            {safeSelectedIds.map(id => (
              <li key={id}>ID: {id}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      <div
        style={{ maxHeight: "300px", overflowY: "auto" }}
        className="border p-3 rounded mt-3"
      >
        <p className="text-muted mb-3">
          <strong>Khóa luận có thể thêm vào hội đồng:</strong> (chưa thuộc hội đồng nào)
        </p>
        
        {theses?.length > 0 ? (
          theses.map((thesis) => {
            const isSelected = safeSelectedIds.includes(thesis.id);
            return (
              <Card
                key={thesis.id}
                className={`mb-2 ${isSelected ? "border-primary bg-light" : ""}`}
              >
                <Card.Body className="py-2">
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <Form.Check
                        type="checkbox"
                        id={`thesis-${thesis.id}`}
                        label={
                          <>
                            <strong>{thesis.title}</strong>
                            <small className="d-block text-muted">
                              {thesis.description}
                            </small>
                            {thesis.status && (
                              <span className={`badge bg-${thesis.status === 'APPROVED' ? 'success' : 'warning'} ms-2`}>
                                {thesis.status}
                              </span>
                            )}
                          </>
                        }
                        checked={isSelected}
                        onChange={() => onSelection(thesis.id)}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <div className="text-center text-muted py-3">
            Không có khóa luận nào có thể thêm vào hội đồng
          </div>
        )}
      </div>
    </>
  );
});

// PropTypes cho type checking
ThesesSelectionField.propTypes = {
  theses: PropTypes.array,
  selectedIds: PropTypes.array.isRequired,
  onSelection: PropTypes.func.isRequired
};

ThesesSelectionField.defaultProps = {
  theses: [],
  selectedIds: []
};

ThesesSelectionField.displayName = 'ThesesSelectionField';

export default ThesesSelectionField;