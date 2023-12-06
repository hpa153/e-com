import { useState, useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import AdminLinks from "./AdminLinks";

const AdminOrdersComp = ({ fetchOrders }) => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const orders = await fetchOrders();

      setOrders(orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinks />
      </Col>
      <Col md={10}>
        <h1>Orders</h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Delivered</th>
              <th>Payment Method</th>
              <th>Order details</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {
                      <>
                        {order.user.firstName} {order.user.lastName}
                      </>
                    }
                  </td>
                  <td>{order?.createdAt?.substring(0, 10)}</td>
                  <td>${order.orderTotal.cartSubtotal}</td>
                  <td>
                    <i
                      className={
                        order.isDelivered
                          ? "bi bi-check-lg text-success"
                          : "bi bi-x-lg text-danger"
                      }
                    ></i>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <Link to={`/admin/order-details/${order._id}`}>
                      View order
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

export default AdminOrdersComp;
