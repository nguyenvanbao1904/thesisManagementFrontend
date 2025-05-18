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
 * @param {boolean} props.insideAccordion - Xác định component có nằm trong Accordion không
 */
const ActionButtons = ({
  onEdit,
  onDelete,
  hideEdit = false,
  hideDelete = false,
  editLabel = "Sửa",
  deleteLabel = "Xóa",
  insideAccordion = false
}) => {
  // Wrapper cho sự kiện click để ngăn chặn sự kiện lan truyền
  const handleEditClick = (e) => {
    if (e) e.stopPropagation();
    onEdit(e);
  };

  const handleDeleteClick = (e) => {
    if (e) e.stopPropagation();
    onDelete(e);
  };

  // Nếu component nằm trong Accordion, sử dụng span styled thay vì Button
  if (insideAccordion) {
    return (
      <>
        {!hideEdit && (
          <span
            className="btn btn-outline-primary btn-sm me-2"
            onClick={handleEditClick}
            style={{ cursor: 'pointer' }}
          >
            {editLabel}
          </span>
        )}
        {!hideDelete && (
          <span
            className="btn btn-outline-danger btn-sm"
            onClick={handleDeleteClick}
            style={{ cursor: 'pointer' }}
          >
            {deleteLabel}
          </span>
        )}
      </>
    );
  }

  // Sử dụng Button bình thường trong trường hợp khác
  return (
    <>
      {!hideEdit && (
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={handleEditClick}
        >
          {editLabel}
        </Button>
      )}
      {!hideDelete && (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleDeleteClick}
        >
          {deleteLabel}
        </Button>
      )}
    </>
  );
};

export default ActionButtons; 