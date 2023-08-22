import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CartMessage = () => {
  const [show, setShow] = useState(true);

  return (
    <Alert
      show={show}
      variant="success"
      onClose={() => setShow(false)}
      dismissible
    >
      <Alert.Heading>The product was added to your cart!</Alert.Heading>
      <p>
        <Button variant="success">Go Back</Button>&nbsp;
        <Link to="/cart">
          <Button variant="danger">To Cart</Button>
        </Link>
      </p>
    </Alert>
  );
};

export default CartMessage;
