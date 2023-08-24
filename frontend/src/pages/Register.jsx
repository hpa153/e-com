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

const Register = () => {
  const [validated, setValidated] = useState(false);

  const passwordMatchVerification = () => {
    const password = document.querySelector("input[name=password");
    const passwordRetype = document.querySelector("input[name=passwordRetype");

    if (passwordRetype.value === password.value) {
      passwordRetype.setCustomValidity("");
    } else {
      passwordRetype.setCustomValidity("Passwords do not match!");
    }
  };

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
          <h2>Register</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="firstName"
                required
                type="text"
                placeholder="First name"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your first name!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationCustom02">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                name="lastName"
                required
                type="text"
                placeholder="Last name"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name!
              </Form.Control.Feedback>
            </Form.Group>
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
                minLength={6}
                onChange={passwordMatchVerification}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password!
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Your password must have at least six (6) characters
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationCustom05">
              <Form.Label>Retype Password </Form.Label>
              <Form.Control
                name="passwordRetype"
                required
                type="password"
                placeholder="Retype Password"
                onChange={passwordMatchVerification}
              />
              <Form.Control.Feedback type="invalid">
                Please make sure both passwords match!
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="pb-2">
              <Col>
                Do you already have an account?&nbsp;
                <Link to="/login">Login here</Link>
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
              Register
            </Button>
            <Alert show={true} variant="danger" className="mt-3">
              This email address has already been used!
            </Alert>
            <Alert show={true} variant="info" className="mt-3">
              You have successfully registered!
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
