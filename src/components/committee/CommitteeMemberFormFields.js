import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Card } from "react-bootstrap";
import { formatLecturerLabel } from "../../utils/formatters";

const CommitteeMemberFormFields = React.memo(({
  members,
  lecturers,
  onMemberChange
}) => {
  
  const roleColors = {
    "Chủ tịch": "primary",
    "Thư ký": "success", 
    "Phản biện": "warning",
    "Thành viên": "secondary"
  };

  return (
    <>
      {members.map((member, index) => (
        <Card 
          key={member.position} 
          className={`mb-3 border-${roleColors[member.role] || 'secondary'}`}
        >
          <Card.Header className={`bg-${roleColors[member.role] || 'secondary'} text-white`}>
            <h6 className="mb-0">
              Thành viên {member.position} - {member.role}
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Giảng viên</Form.Label>
                  <Form.Select
                    value={member.lecturerId || ""}
                    onChange={(e) => onMemberChange(member.position, e.target.value)}
                    required={member.position <= 3} // Bắt buộc cho Chủ tịch, Thư ký, Phản biện
                  >
                    <option value="">-- Chọn giảng viên --</option>
                    {lecturers?.length > 0 ? (
                      lecturers.map((lecturer) => (
                        <option key={lecturer.id} value={lecturer.id}>
                          {formatLecturerLabel(lecturer)}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Không có giảng viên
                      </option>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Control
                    type="text"
                    value={member.role}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </>
  );
});

// PropTypes cho type checking
CommitteeMemberFormFields.propTypes = {
  members: PropTypes.array.isRequired,
  lecturers: PropTypes.array,
  onMemberChange: PropTypes.func.isRequired
};

CommitteeMemberFormFields.defaultProps = {
  lecturers: []
};

CommitteeMemberFormFields.displayName = 'CommitteeMemberFormFields';

export default CommitteeMemberFormFields;