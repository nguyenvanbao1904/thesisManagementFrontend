import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Container className="text-center mt-5">
    <div className="py-5">
      <h1 className="display-1">404</h1>
      <h2>Trang không tìm thấy</h2>
      <p className="text-muted">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/">
        <Button variant="primary" size="lg">Về trang chủ</Button>
      </Link>
    </div>
  </Container>
);

export default NotFound;