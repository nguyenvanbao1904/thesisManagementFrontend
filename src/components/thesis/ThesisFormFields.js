import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import LecturerSelectionField from "./LecturerSelectionField";
import StudentSelectionField from "./StudentSelectionField";
import { formatCommitteeLabel, formatLecturerLabel } from "../../utils/formatters";

const ThesisFormFields = React.memo(({
  formData,
  onInputChange,
  onLecturerSelection,
  onStudentSelection,
  onFileChange,
  lecturers,
  students,
  committees,
  evaluationCriteriaCollections
}) => {
  
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert("File không được vượt quá 10MB");
      e.target.value = null;
      return;
    }
    
    onFileChange(file);
  }, [onFileChange]);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Tiêu đề khóa luận</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Mô tả khóa luận</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={onInputChange}
        />
      </Form.Group>

      <hr className="my-4" />
      <LecturerSelectionField
        lecturers={lecturers}
        selectedIds={formData.lecturerIds}
        onSelection={onLecturerSelection}
      />
      
      <hr className="my-4" />
      <StudentSelectionField
        students={students}
        selectedIds={formData.studentIds}
        onSelection={onStudentSelection}
      />
      
      <hr className="my-4" />
      <Form.Group className="mb-3">
        <Form.Label htmlFor="committeeId">Hội đồng bảo vệ</Form.Label>
        <Form.Select
          id="committeeId"
          name="committeeId"
          value={formData.committeeId || ""}
          onChange={onInputChange}
        >
          <option value="">-- Chọn hội đồng --</option>
          {committees?.length > 0 ? (
            committees.map((committee) => (
              <option key={committee.id} value={committee.id}>
                {formatCommitteeLabel(committee)}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Không có hội đồng
            </option>
          )}
        </Form.Select>
      </Form.Group>

      <hr className="my-4" />
      <Form.Group className="mb-3">
        <Form.Label htmlFor="evaluationCriteriaCollectionId">Bộ tiêu chí đánh giá</Form.Label>
        <Form.Select
          id="evaluationCriteriaCollectionId"
          name="evaluationCriteriaCollectionId"
          value={formData.evaluationCriteriaCollectionId || ""}
          onChange={onInputChange}
        >
          <option value="">-- Chọn bộ tiêu chí --</option>
          {evaluationCriteriaCollections?.length > 0 ? (
            evaluationCriteriaCollections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Không có bộ tiêu chí
            </option>
          )}
        </Form.Select>
      </Form.Group>

      <hr className="my-4" />
      <Form.Group className="mb-3">
        <Form.Label htmlFor="reviewerId">Giảng viên phản biện</Form.Label>
        <Form.Select
          id="reviewerId"
          name="reviewerId"
          value={formData.reviewerId || ""}
          onChange={onInputChange}
        >
          <option value="">-- Chọn giảng viên phản biện --</option>
          {lecturers?.length > 0 ? (
            lecturers.map((lecturer) => (
              <option key={lecturer.id} value={lecturer.id}>
                {formatLecturerLabel(lecturer)}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Không có giảng viên phản biện
            </option>
          )}
        </Form.Select>
      </Form.Group>

      <hr className="my-4" />
      <Form.Group className="mb-3">
        <Form.Label>File báo cáo khóa luận (Tối đa 10MB)</Form.Label>
        <Form.Control
          type="file"
          name="file"
          onChange={handleFileChange}
        />
        {formData.fileUrl && (
          <div className="mt-2">
            <a
              href={formData.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Xem file hiện tại
            </a>
          </div>
        )}
      </Form.Group>
    </>
  );
});

// PropTypes cho type checking
ThesisFormFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onLecturerSelection: PropTypes.func.isRequired,
  onStudentSelection: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  lecturers: PropTypes.array,
  students: PropTypes.array,
  committees: PropTypes.array,
  evaluationCriteriaCollections: PropTypes.array
};

ThesisFormFields.defaultProps = {
  lecturers: [],
  students: [],
  committees: [],
  evaluationCriteriaCollections: []
};

ThesisFormFields.displayName = 'ThesisFormFields';

export default ThesisFormFields;