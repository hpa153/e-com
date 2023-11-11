import { useState, useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const fetchOrders = async () => {
  try {
    const orders = await axios.get("/api/orders");

    return orders.data;
  } catch (error) {
    console.log(error);
  }
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const fetchedOrders = await fetchOrders();
      console.log(fetchedOrders);
      setOrders(fetchedOrders);
    };

    getOrders();
  }, []);

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
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>Name</td>
                <td>{String(order.createdAt).substring(0, 10)}</td>
                <td>${order.orderTotal.cartSubtotal}</td>
                <td>
                  <i
                    className={`${
                      order.isDelivered
                        ? "bi bi-check-lg text-success"
                        : "bi bi-x-lg text-danger"
                    }`}
                  ></i>
                </td>
                <td>
                  <Link to={`/user/order-details/${order._id}`}>
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default UserOrders;
