import { Modal, Button } from "react-bootstrap";

/**
 * Modal xác nhận xóa dùng chung cho nhiều component
 * @param {Object} props - Props của component
 * @param {boolean} props.show - Trạng thái hiển thị của modal
 * @param {Function} props.onHide - Hàm xử lý khi đóng modal
 * @param {Function} props.onConfirm - Hàm xử lý khi xác nhận xóa
 * @param {string} props.title - Tiêu đề modal
 * @param {string} props.itemName - Tên của item được xóa
 * @param {string} props.itemType - Loại của item được xóa (ví dụ: "tiêu chí", "bộ tiêu chí")
 */
const ConfirmDeleteModal = ({
  show,
  onHide,
  onConfirm,
  title = "Xác nhận xóa",
  itemName,
  itemType = "mục này"
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa {itemType} "{itemName}" không?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal; 