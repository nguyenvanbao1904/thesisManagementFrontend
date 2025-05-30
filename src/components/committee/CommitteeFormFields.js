import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Form, Card, Alert } from "react-bootstrap";
import CommitteeMemberFormFields from "./CommitteeMemberFormFields";
import ThesesSelectionField from "./ThesesSelectionField";

const CommitteeFormFields = React.memo(({
  formData,
  onInputChange,
  onDateChange,
  onMemberChange,
  onThesesSelection,
  lecturers,
  theses,
  locations
}) => {
  
  const handleDateChange = useCallback((e) => {
    const dateValue = e.target.value; // Đây sẽ là string với format "yyyy-MM-ddTHH:mm"
    onDateChange(dateValue); // Truyền trực tiếp string, không convert sang Date
  }, [onDateChange]);

  const formatDateForInput = useCallback((date) => {
    if (!date) return "";
    
    // Nếu đã là string với đúng format, return luôn
    if (typeof date === 'string' && date.includes('T')) {
      return date;
    }
    
    // Nếu là Date object hoặc string khác, convert
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="defenseDate">Ngày và giờ bảo vệ</Form.Label>
        <Form.Control
          type="datetime-local"
          id="defenseDate"
          name="defenseDate"
          value={formatDateForInput(formData.defenseDate)}
          onChange={handleDateChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="location">Địa điểm</Form.Label>
        <Form.Select
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={onInputChange}
          required
        >
          <option value="">-- Chọn địa điểm --</option>
          {locations?.length > 0 ? (
            locations.map((location) => (
              <option key={location} value={location}>
                {location.replace(/_/g, ' ')}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Không có địa điểm
            </option>
          )}
        </Form.Select>
      </Form.Group>

      <hr className="my-4" />
      
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Thành viên hội đồng</h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info" className="mb-3">
            Vui lòng chọn từ 3-5 thành viên cho hội đồng, bao gồm 1 chủ tịch, 1 thư ký và các thành viên khác.
          </Alert>
          
          <CommitteeMemberFormFields
            members={formData.members}
            lecturers={lecturers}
            onMemberChange={onMemberChange}
          />
        </Card.Body>
      </Card>

      <hr className="my-4" />
      
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Khóa luận trong hội đồng</h5>
        </Card.Header>
        <Card.Body>
          <ThesesSelectionField
            theses={theses}
            selectedIds={formData.thesesIds}
            onSelection={onThesesSelection}
          />
        </Card.Body>
      </Card>
    </>
  );
});

// PropTypes cho type checking
CommitteeFormFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onMemberChange: PropTypes.func.isRequired,
  onThesesSelection: PropTypes.func.isRequired,
  lecturers: PropTypes.array,
  theses: PropTypes.array,
  locations: PropTypes.array
};

CommitteeFormFields.defaultProps = {
  lecturers: [],
  theses: [],
  locations: []
};

CommitteeFormFields.displayName = 'CommitteeFormFields';

export default CommitteeFormFields;