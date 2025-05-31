import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";

const Header = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  const getRoleBasedNavigation = () => {
    if (!user) return null;

    switch (user.role) {
      case "ROLE_ACADEMICSTAFF":
        return (
          <>
            <Link to="/academic-staff/theses" className="nav-link">
              Khóa luận
            </Link>
            <Link to="/academic-staff/criteria" className="nav-link">
              Tiêu chí
            </Link>
            <Link to="/academic-staff/criteria-collections" className="nav-link">
              Bộ tiêu chí
            </Link>
            <Link to="/academic-staff/committees" className="nav-link">
              Hội đồng
            </Link>
          </>
        );
      case "ROLE_LECTURER":
        return (
          <>
            <Link to="/lecturer/dashboard" className="nav-link">
              Bảng điều khiển
            </Link>
            <Link to="/lecturer/assignments" className="nav-link">
              Công việc
            </Link>
          </>
        );
      case "ROLE_STUDENT":
        return (
          <Link to="/student/dashboard" className="nav-link">
            Sinh viên
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <Link to="/" className="navbar-brand">Open University</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Trang chủ</Link>
            {getRoleBasedNavigation()}
          </Nav>
          
          <Nav>
            {user === null ? 
              <Link to="/login" className="nav-link text-success">Đăng nhập</Link> 
              :
              <>
                <Link className="nav-link text-success">Chào {user.firstName}</Link>
                <Button variant="danger" onClick={() => dispatch({"type": "logout"})}>
                  Đăng xuất
                </Button>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;