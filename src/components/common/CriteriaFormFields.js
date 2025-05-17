import { Form } from "react-bootstrap";

/**
 * Component hiển thị các trường form cho tiêu chí (tên, mô tả, điểm tối đa)
 * @param {Object} props - Props của component
 * @param {Object} props.formData - Dữ liệu của form
 * @param {Function} props.onChange - Hàm xử lý khi thay đổi giá trị form
 * @param {boolean} props.hideMaxPoint - Ẩn trường điểm tối đa
 */
const CriteriaFormFields = ({
  formData,
  onChange,
  hideMaxPoint = false
}) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Tên tiêu chí</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Mô tả</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={onChange}
        />
      </Form.Group>
      {!hideMaxPoint && (
        <Form.Group className="mb-3">
          <Form.Label>Điểm tối đa</Form.Label>
          <Form.Control
            type="number"
            name="maxPoint"
            min="1"
            max="100"
            value={formData.maxPoint}
            onChange={onChange}
            required
          />
        </Form.Group>
      )}
    </>
  );
};

export default CriteriaFormFields; 