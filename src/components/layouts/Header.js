import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";

const Header = () =>{
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext)

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Open University</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Trang chủ</Link>
            {user!=null && user.role === "ROLE_ACADEMICSTAFF" && <Link to={"/academicStaff/theses"} className="nav-link">Quản lý thông tin khóa luận</Link>}
          </Nav>
          
          <Nav>
            {user === null ? 
              <Link to="/login" className="nav-link text-success">Đăng nhập</Link> 
              :
              <>
                <Link className="nav-link text-success">Chào {user.firstName}</Link>
                <Button variant="danger" onClick={()=>dispatch({"type": "logout"})}>Đăng xuất</Button>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;