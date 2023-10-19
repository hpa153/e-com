import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { passwordMatchVerification } from "../../utils";
import { setReduxUser } from "../../redux/actions/userActions";

const UserProfileComp = ({ updateUserRequest, fetchUserData }) => {
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    isAdmin: false,
    doNotLogout: true,
  });
  const [updateState, setUpdateState] = useState({
    success: false,
    error: false,
  });
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id);

  useEffect(() => {
    const getUserData = async (userId) => {
      try {
        const userData = await fetchUserData(userId);

        setUser(userData);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData(userId);
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget.elements;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const phoneNumber = form.phoneNumber.value;
    const address = form.address.value;
    const country = form.country.value;
    const zipCode = form.zipCode.value;
    const city = form.city.value;
    const state = form.state.value;
    const password = form.password.value;

    if (event.currentTarget.checkValidity() === true) {
      if (!passwordMatchVerification()) {
        setIsPasswordsMatch(true);
        return;
      }
      setIsPasswordsMatch(false);

      try {
        const updatedUser = await updateUserRequest(
          firstName,
          lastName,
          phoneNumber,
          address,
          country,
          zipCode,
          city,
          state,
          password
        );

        if (updatedUser) {
          dispatch(
            setReduxUser({
              doNotLogout: user.doNotLogout,
              ...updatedUser.userUpdated,
            })
          );

          user.doNotLogout
            ? localStorage.setItem(
                "userInfo",
                JSON.stringify({
                  doNotLogout: user.doNotLogout,
                  ...updatedUser.userUpdated,
                })
              )
            : sessionStorage.setItem(
                "userInfo",
                JSON.stringify({
                  doNotLogout: user.doNotLogout,
                  ...updatedUser.userUpdated,
                })
              );
        }

        setUpdateState({
          success: true,
          error: false,
        });
      } catch (error) {
        setUpdateState({
          success: false,
          error: true,
        });
      }
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Change your profile</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>First name</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue={user.firstName}
                name="firstName"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your first name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue={user.lastName}
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control disabled value={user.email} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your phone number"
                defaultValue={user.phoneNumber}
                name="phoneNumber"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your street name and house number"
                defaultValue={user.address}
                name="address"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your country"
                defaultValue={user.country}
                name="country"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicZip">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Zip code"
                defaultValue={user.zipCode}
                name="zipCode"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your city"
                defaultValue={user.city}
                name="city"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your state"
                defaultValue={user.state}
                name="state"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Your password"
                minLength={6}
                onChange={passwordMatchVerification}
                isInvalid={isPasswordsMatch}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid password!
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Your password must have at least six (6) characters
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmedPassword"
                required
                type="password"
                placeholder="Confirm Password"
                minLength={6}
                onChange={passwordMatchVerification}
                isInvalid={isPasswordsMatch}
              />
              <Form.Control.Feedback type="invalid">
                Please make sure both passwords match!
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update
            </Button>
            {updateState.error && (
              <Alert className="mt-3" show={true} variant="danger">
                User with that email already exists!
              </Alert>
            )}
            {updateState.success && (
              <Alert className="mt-3" show={true} variant="info">
                User updated
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfileComp;
