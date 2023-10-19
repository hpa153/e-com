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
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setReduxUser } from "../../redux/actions/userActions";
import { passwordMatchVerification } from "../../utils";

const RegisterComp = ({ registerUser }) => {
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerState, setRegisterState] = useState({
    error: false,
    loading: false,
  });
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget.elements;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const password = form.password.value;

    if (
      event.currentTarget.checkValidity() === true &&
      firstName &&
      lastName &&
      email &&
      password &&
      passwordMatchVerification()
    ) {
      setRegisterState({ ...registerState, loading: true });

      try {
        const user = await registerUser(firstName, lastName, email, password);

        if (user) {
          setRegisterState({ error: false, loading: false });

          dispatch(setReduxUser(user.userCreated));

          sessionStorage.setItem("userInfo", JSON.stringify(user.userCreated));

          if (!user.userCreated.isAdmin) {
            navigate("/", { replace: true });
            // window.location.href = "/";
          } else {
            navigate("/admin/orders", { replace: true });
            // window.location.href = "/admin/orders";
          }
        } else {
          setRegisterState({
            error: true,
            loading: false,
          });
        }
      } catch (error) {
        setRegisterState({
          error: true,
          loading: false,
        });
      }
    } else if (!passwordMatchVerification()) {
      setIsPasswordsMatch(true);
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Register</h1>
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
                isInvalid={isPasswordsMatch}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password!
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Your password must have at least six (6) characters
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationCustom05">
              <Form.Label>Confirm Password </Form.Label>
              <Form.Control
                name="confirmedPassword"
                required
                type="password"
                placeholder="Confirm Password"
                onChange={passwordMatchVerification}
                isInvalid={isPasswordsMatch}
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
              {registerState.loading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              Register
            </Button>
            {registerState.error && (
              <Alert show={true} variant="danger" className="mt-3">
                This email address has already been used!
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterComp;
