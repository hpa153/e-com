import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col className="text-light bg-dark text-center py-3">
          Copyright &copy; My E-Com
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
