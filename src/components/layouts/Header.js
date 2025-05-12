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
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Trang chủ</Link>
            {user === null ? 
            <Link to="/login" className="nav-link text-success">Đăng nhập</Link> 
            :<>
            <Link className="nav-link text-success">Chào {user.firstName}</Link>
            <Button variant="danger" onClick={()=>dispatch({"type": "logout"})}>Đăng xuất</Button>
            </>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;