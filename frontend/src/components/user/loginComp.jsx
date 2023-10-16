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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setReduxUser } from "../../redux/actions/userActions";

const LoginComp = ({ loginRequest }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState({
    success: false,
    error: false,
    loading: false,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget.elements;
    const email = form.email.value;
    const password = form.password.value;
    const doNotLogout = form.doNotLogout.checked;

    if (event.currentTarget.checkValidity() === true && email && password) {
      setLoginState({ ...loginState, loading: true });

      try {
        const user = await loginRequest(email, password, doNotLogout);

        if (user) {
          setLoginState({ success: true, error: false, loading: false });

          dispatch(setReduxUser(user.userLoggedIn));

          if (!user.userLoggedIn.isAdmin) {
            navigate("/", { replace: true });
            // window.location.href = "/";
          } else {
            navigate("/admin/orders", { replace: true });
            // window.location.href = "/admin/orders";
          }
        } else {
          setLoginState({
            success: false,
            error: true,
            loading: false,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setLoginState({
        success: false,
        error: true,
        loading: false,
      });
    }
  };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Login</h1>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Email address"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationDoNotLogout">
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
              {loginState.loading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              Login
            </Button>
            {loginState.error && (
              <Alert show={true} variant="danger" className="mt-3">
                Please enter valid credentials!
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComp;
