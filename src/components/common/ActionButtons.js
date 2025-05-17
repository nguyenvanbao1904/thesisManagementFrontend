import { Button } from "react-bootstrap";

/**
 * Component hiển thị các nút hành động (Sửa, Xóa)
 * @param {Object} props - Props của component
 * @param {Function} props.onEdit - Hàm xử lý khi nhấn nút Sửa
 * @param {Function} props.onDelete - Hàm xử lý khi nhấn nút Xóa
 * @param {boolean} props.hideEdit - Ẩn nút Sửa
 * @param {boolean} props.hideDelete - Ẩn nút Xóa
 * @param {string} props.editLabel - Nhãn cho nút Sửa
 * @param {string} props.deleteLabel - Nhãn cho nút Xóa
 */
const ActionButtons = ({
  onEdit,
  onDelete,
  hideEdit = false,
  hideDelete = false,
  editLabel = "Sửa",
  deleteLabel = "Xóa"
}) => {
  return (
    <>
      {!hideEdit && (
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={onEdit}
        >
          {editLabel}
        </Button>
      )}
      {!hideDelete && (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={onDelete}
        >
          {deleteLabel}
        </Button>
      )}
    </>
  );
};

export default ActionButtons; 