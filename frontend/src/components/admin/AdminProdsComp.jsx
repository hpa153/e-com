import { useState, useEffect } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import AdminLinks from "./AdminLinks";

const AdminProdsComp = ({ fetchProducts, deleteProd }) => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const products = await fetchProducts();

    setProducts(products);
  };

  const deleteHandler = async (productId) => {
    if (window.confirm("Are you sure?")) {
      await deleteProd(productId);
      await getProducts();
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinks />
      </Col>
      <Col md={10}>
        <h1>
          Product List{" "}
          <LinkContainer to="/admin/create-product">
            <Button variant="primary" size="lg">
              Create new
            </Button>
          </LinkContainer>
        </h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {products
              ? products.map((product, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>
                      <LinkContainer to="/admin/edit-product">
                        <Button className="btn-sm">
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                      </LinkContainer>
                      {" / "}
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <i className="bi bi-x-circle"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              : "No products available"}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default AdminProdsComp;
