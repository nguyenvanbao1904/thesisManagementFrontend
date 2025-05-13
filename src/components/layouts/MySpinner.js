import { Spinner, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const MySpinner = () => {
  return (
    <Container 
      fluid 
      className="d-flex justify-content-center align-items-center bg-light opacity-75" 
      style={{ height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 1050 }}
    >
      <Spinner 
        animation="border" 
        variant="primary" 
        style={{ width: "5rem", height: "5rem" }} 
      />
    </Container>
  );
};

export default MySpinner;