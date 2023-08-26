import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Login</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationCustom03">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Email address"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your email address!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationCustom04">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationCustom04">
              <Form.Check
                name="doNotLogout"
                type="checkbox"
                label="Don't log me out"
              />
            </Form.Group>
            <Row className="pb-2">
              <Col>
                Don't have an account?&nbsp;
                <Link to="/register">Register here</Link>
              </Col>
            </Row>
            <Button type="submit">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Login
            </Button>
            <Alert show={true} variant="danger" className="mt-3">
              Please enter valid credentials!
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
