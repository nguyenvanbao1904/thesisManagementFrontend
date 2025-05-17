import { Modal, Button, Form } from "react-bootstrap";

/**
 * Component Modal chứa form dùng chung cho nhiều components
 * @param {Object} props - Props của component
 * @param {boolean} props.show - Trạng thái hiển thị của modal
 * @param {Function} props.onHide - Hàm xử lý khi đóng modal
 * @param {Function} props.onSubmit - Hàm xử lý khi submit form
 * @param {string} props.title - Tiêu đề modal
 * @param {React.ReactNode} props.children - Nội dung form
 * @param {string} props.submitLabel - Nhãn cho nút submit
 * @param {string} props.size - Kích thước modal: 'sm', 'lg', 'xl'
 * @param {boolean} props.staticBackdrop - Cố định backdrop (không đóng khi click bên ngoài)
 * @param {boolean} props.disableSubmit - Vô hiệu hóa nút submit
 */
const FormModal = ({
  show,
  onHide,
  onSubmit,
  title,
  children,
  submitLabel = "Lưu thay đổi",
  size = null,
  staticBackdrop = false,
  disableSubmit = false
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      backdrop={staticBackdrop ? "static" : true}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          {children}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button 
          variant="primary" 
          onClick={onSubmit}
          disabled={disableSubmit}
        >
          {submitLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormModal; 