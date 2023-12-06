import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

import { logoutUser } from "../redux/actions/userActions";
import { getCategories } from "../redux/actions/categoryActions";
import {
  setChatRooms,
  setSocket,
  receivedMessage,
  removeChatRoom,
} from "../redux/actions/chatActions";

const Header = () => {
  const [searchCategory, setSearchCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const { categories } = useSelector((state) => state.categories);
  const { messageReceived } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    let chatSocket;
    const ringtone = new Audio("/audio/chat-msg.mp3");

    if (user.userInfo.isAdmin) {
      chatSocket = socketIOClient();
      dispatch(setSocket(chatSocket));

      chatSocket.emit(
        "admin connected",
        "Admin" + Math.floor(Math.random() * 1000000)
      );

      chatSocket.on("client message to admin", ({ user, message }) => {
        ringtone.play();
        dispatch(setChatRooms(user, message));
        dispatch(receivedMessage(true));
      });

      chatSocket.on("disconnected", ({ reason, socketId }) => {
        dispatch(removeChatRoom(socketId));
      });
    }

    if (chatSocket) return () => chatSocket.disconnect();
  }, [user.userInfo.isAdmin, dispatch]);

  const submitHandler = (e) => {
    if (e.keyCode && e.keyCode !== 13) {
      return;
    }

    if (searchQuery.trim()) {
      if (searchCategory) {
        navigate(
          `/product-list/category/${searchCategory.replaceAll(
            "/",
            ","
          )}/search/${searchQuery}/1`
        );
      } else {
        navigate(`/product-list/search/${searchQuery}/1`);
      }
    } else {
      navigate(
        `/product-list${
          searchCategory ? "/category/" : ""
        }${searchCategory.replaceAll("/", ",")}/1`
      );
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>MY E-COM</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <InputGroup>
              <DropdownButton
                id="dropdown-basic-button"
                title={searchCategory ? searchCategory : "All"}
              >
                <Dropdown.Item key="All" onClick={() => setSearchCategory("")}>
                  All
                </Dropdown.Item>
                {categories &&
                  categories?.map((category) => (
                    <Dropdown.Item
                      key={category.name}
                      onClick={() => setSearchCategory(category.name)}
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
              </DropdownButton>
              <Form.Control
                type="text"
                onKeyUp={submitHandler}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in shop..."
              />
              <Button variant="warning" onClick={submitHandler}>
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Nav>
          <Nav>
            {user.userInfo.isAdmin ? (
              <LinkContainer to="/admin/orders">
                <Nav.Link>
                  Admin
                  {messageReceived && (
                    <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
                  )}
                </Nav.Link>
              </LinkContainer>
            ) : user.userInfo.isAdmin === false ? (
              <NavDropdown
                title={`${user.userInfo.firstName} ${user.userInfo.lastName}`}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item
                  eventKey="/user/my-orders"
                  as={Link}
                  to="/user/my-orders"
                >
                  My Orders
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey="/user/profile"
                  as={Link}
                  to="/user/profile"
                >
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => dispatch(logoutUser())}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
            {user.userInfo.isAdmin === false && (
              <LinkContainer to="/cart">
                <Nav.Link>
                  <Badge pill bg="danger">
                    {itemsCount > 0 ? itemsCount : ""}
                  </Badge>
                  <i className="bi bi-cart-dash"></i>&nbsp;CART
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
