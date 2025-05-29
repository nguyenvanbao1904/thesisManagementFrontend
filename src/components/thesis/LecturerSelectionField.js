import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";

const LecturerSelectionField = React.memo(({ 
  lecturers, 
  selectedIds, 
  onSelection 
}) => (
  <>
    <h5>Chọn giảng viên hướng dẫn</h5>
    <div
      style={{ maxHeight: "300px", overflowY: "auto" }}
      className="border p-3 rounded mt-3"
    >
      {lecturers.map((lecturer) => {
        const isSelected = selectedIds.includes(lecturer.id);
        return (
          <Card
            key={lecturer.id}
            className={`mb-2 ${isSelected ? "border-primary" : ""}`}
          >
            <Card.Body className="py-2">
              <Row className="align-items-center">
                <Col xs={7}>
                  <Form.Check
                    type="checkbox"
                    id={`lecturer-${lecturer.id}`}
                    label={
                      <>
                        <strong>{`${lecturer.firstName} ${lecturer.lastName}`}</strong>
                        <small className="d-block text-muted">
                          {lecturer.academicDegree}
                        </small>
                      </>
                    }
                    checked={isSelected}
                    onChange={() => onSelection(lecturer.id)}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  </>
));

LecturerSelectionField.displayName = 'LecturerSelectionField';

export default LecturerSelectionField;