import { useNavigate } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CartMessage = ({ displayMessage, setDisplayMessage }) => {
  const navigate = useNavigate();

  return (
    <Alert
      show={displayMessage}
      variant="success"
      onClose={() => setDisplayMessage(false)}
      dismissible
    >
      <Alert.Heading>The product was added to your cart!</Alert.Heading>
      <p>
        <Button variant="success" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        &nbsp;
        <Link to="/cart">
          <Button variant="danger">To Cart</Button>
        </Link>
      </p>
    </Alert>
  );
};

export default CartMessage;
