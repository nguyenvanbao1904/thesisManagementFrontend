import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";

const StudentSelectionField = React.memo(({ 
  students, 
  selectedIds, 
  onSelection 
}) => (
  <>
    <h5>Chọn sinh viên tham gia khóa luận</h5>
    <div
      style={{ maxHeight: "300px", overflowY: "auto" }}
      className="border p-3 rounded mt-3"
    >
      {students.map((student) => {
        const isSelected = selectedIds.includes(student.id);
        return (
          <Card
            key={student.id}
            className={`mb-2 ${isSelected ? "border-primary" : ""}`}
          >
            <Card.Body className="py-2">
              <Row className="align-items-center">
                <Col xs={7}>
                  <Form.Check
                    type="checkbox"
                    id={`student-${student.id}`}
                    label={
                      <>
                        <strong>{`${student.firstName} ${student.lastName}`}</strong>
                        <small className="d-block text-muted">
                          {student.studentId}
                        </small>
                      </>
                    }
                    checked={isSelected}
                    onChange={() => onSelection(student.id)}
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

StudentSelectionField.displayName = 'StudentSelectionField';

export default StudentSelectionField;