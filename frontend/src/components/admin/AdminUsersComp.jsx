import { useState, useEffect } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import AdminLinks from "./AdminLinks";

const AdminUsersComp = ({ fetchUsers, deleteUser }) => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const abortCtrl = new AbortController();

    const users = await fetchUsers(abortCtrl);

    setUsers(users);
  };

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure?")) {
      await deleteUser(userId);
      await getUsers();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinks />
      </Col>
      <Col md={10}>
        <h1>User List</h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Is Admin</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {users
              ? users.map((user, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <i
                        className={
                          user.isAdmin
                            ? "bi bi-check-lg text-success"
                            : "bi bi-x-lg text-danger"
                        }
                      ></i>
                    </td>
                    <td>
                      <LinkContainer to={`/admin/edit-user/${user._id}`}>
                        <Button className="btn-sm">
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                      </LinkContainer>
                      {" / "}
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <i className="bi bi-x-circle"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              : "No Users available"}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default AdminUsersComp;
