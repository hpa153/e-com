import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const getAdminUserRequest = async (id) => {
  try {
    const fetchedUser = await axios.get(`/api/users/${id}`);

    return fetchedUser.data;
  } catch (error) {
    console.log(error);
  }
};

const AdminEditUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState({});
  const [userIsAdmin, setUserIsAdmin] = useState();

  useEffect(() => {
    const getUser = async () => {
      const fetchedUser = await getAdminUserRequest(userId);
      setUser(fetchedUser);
      setUserIsAdmin(fetchedUser.isAdmin);
    };

    getUser();
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget.elements;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const isAdmin = userIsAdmin;

    try {
      if (event.currentTarget.checkValidity() === true) {
        await axios.put(`/api/users/${userId}`, {
          firstName,
          lastName,
          email,
          isAdmin,
        });
      }

      navigate("/admin/users");
    } catch (error) {
      console.log(error);
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/users" className="btn btn-info my-3">
            Go Back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Edit user</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="firstName"
                required
                type="text"
                defaultValue={user.firstName}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                name="lastName"
                required
                type="text"
                defaultValue={user.lastName}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                defaultValue={user.email}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                name="isAdmin"
                type="checkbox"
                label="Is admin"
                checked={userIsAdmin}
                onChange={(e) => setUserIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              UPDATE
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminEditUser;
