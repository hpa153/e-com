import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserOrders = () => {
  return (
    <Row className="m-5">
      <Col md={12}>
        <h1>My Orders</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Delivered</th>
              <th>Order Details</th>
            </tr>
          </thead>
          <tbody>
            {["bi bi-check-lg text-success", "bi bi-x-lg text-danger"].map(
              (icon, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>Name</td>
                  <td>Date</td>
                  <td>Price</td>
                  <td>
                    <i className={`${icon}`}></i>
                  </td>
                  <td>
                    <Link to="/user/order-details">View Details</Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default UserOrders;
