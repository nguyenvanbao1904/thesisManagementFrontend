import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";

const Student = () => {
  return (
    <Container className="mt-4 mb-5">
      <Routes>
        <Route path="/dashboard" element={
          <Alert variant="info">
            <h4>Trang sinh viên</h4>
            <p>Chức năng dành cho sinh viên đang được phát triển.</p>
          </Alert>
        } />
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    </Container>
  );
};

export default Student;