import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import LecturerAssignments from "./LecturerAssignments";

const Lecturer = () => {
  return (
    <Container className="mt-4 mb-5">
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/lecturer/dashboard" replace />} />
        
        {/* Lecturer dashboard */}
        <Route path="/dashboard" element={
          <Alert variant="success">
            <h4>Bảng điều khiển giảng viên</h4>
            <p>Chào mừng bạn đến với hệ thống quản lý khóa luận.</p>
            <hr />
            <p className="mb-0">
              <strong>Chức năng hiện có:</strong>
              <br />• Xem công việc được phân công (Hướng dẫn, Phản biện, Hội đồng)
              <br />• Chấm điểm khóa luận trực tiếp từ tab hội đồng
              <br />• Theo dõi tiến độ các khóa luận
            </p>
          </Alert>
        } />
        
        {/* Chỉ giữ lại route assignments */}
        <Route path="/assignments" element={<LecturerAssignments />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/lecturer/dashboard" replace />} />
      </Routes>
    </Container>
  );
};

export default Lecturer;