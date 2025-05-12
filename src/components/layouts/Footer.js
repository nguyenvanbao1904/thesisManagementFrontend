import { Container, Navbar } from "react-bootstrap";

const Footer = () =>{
    return (
    <Navbar bg="dark" data-bs-theme="dark" className="mt-auto py-3">
        <Container className="justify-content-center">
            <Navbar.Text className="text-muted">
                © {new Date().getFullYear()} React-Bootstrap App. All rights reserved.
            </Navbar.Text>
        </Container>
    </Navbar>
    )
}

export default Footer;