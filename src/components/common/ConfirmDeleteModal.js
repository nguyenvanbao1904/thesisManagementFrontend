import { Modal, Button } from "react-bootstrap";

/**
 * Modal xác nhận xóa dùng chung cho nhiều component
 * @param {Object} props - Props của component
 * @param {boolean} props.show - Trạng thái hiển thị của modal
 * @param {Function} props.onHide - Hàm xử lý khi đóng modal
 * @param {Function} props.onConfirm - Hàm xử lý khi xác nhận xóa
 * @param {string} props.title - Tiêu đề modal
 * @param {string} props.itemName - Tên của item được xóa
 * @param {string} props.itemType - Loại của item được xóa
 * @param {boolean} props.disabled - Vô hiệu hóa nút xác nhận
 */
const ConfirmDeleteModal = ({
  show,
  onHide,
  onConfirm,
  title = "Xác nhận xóa",
  itemName,
  itemType = "mục này",
  disabled = false // Thêm prop disabled
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
        <Button 
          variant="secondary" 
          onClick={onHide}
          disabled={disabled} // Disable cả nút Hủy
        >
          Hủy
        </Button>
        <Button 
          variant="danger" 
          onClick={onConfirm}
          disabled={disabled} // Disable nút Xóa khi đang loading
        >
          {disabled ? "Đang xóa..." : "Xóa"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;