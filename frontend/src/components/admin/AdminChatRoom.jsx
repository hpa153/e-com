import { Fragment, useEffect, useState } from "react";
import { Toast, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { receivedMessage } from "../../redux/actions/chatActions";

export const scrollToChatBottom = (elem) => {
  const chatBox = document.querySelector(elem);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const AdminChatRoom = ({ chatRoom, roomId, socket }) => {
  const [adminMsg, setAdminMsg] = useState("");
  [window["toast" + roomId], window["closeToast" + roomId]] = useState(true);
  const dispatch = useDispatch();

  const closeChat = (socketId) => {
    window["closeToast" + roomId](false);
    socket.emit("admin closed chat", socketId);
  };

  const onAdminMsgSubmit = (e, elem) => {
    e.preventDefault();

    if (e.keyCode && e.keyCode !== 13) {
      return;
    }

    const msg = document.getElementById(elem);
    const trimmedMsg = adminMsg.trim();

    if (trimmedMsg) {
      chatRoom[1].push({ admin: trimmedMsg });

      socket.emit("admin message", { user: chatRoom[0], message: trimmedMsg });
      setAdminMsg("");
      msg.focus();
      scrollToChatBottom(`.chat-room${chatRoom[0]}`);
    }
  };

  useEffect(() => {
    scrollToChatBottom(`.chat-room${chatRoom[0]}`);
  });

  return (
    <Toast
      show={"toast" + roomId}
      onClose={() => closeChat(chatRoom[0])}
      className="ms-4 mb-5"
    >
      <Toast.Header>
        <strong className="me-auto">Chat with {chatRoom[0]}</strong>
      </Toast.Header>
      <Toast.Body>
        <div
          className={`chat-room${chatRoom[0]}`}
          style={{ maxHeight: "500px", overflow: "auto" }}
        >
          {chatRoom[1].map((msg, idx) => (
            <Fragment key={idx}>
              {msg.client && (
                <p className="bg-secondary p-3 me-4 text-light rounded-pill">
                  <b>{chatRoom[0]}:</b> {msg.client}
                </p>
              )}
              {msg.admin && (
                <p className="bg-primary p-3 ms-4 text-light rounded-pill">
                  <b>You:</b> {msg.admin}
                </p>
              )}
            </Fragment>
          ))}
        </div>

        <Form>
          <Form.Group className="mb-3" controlId={`adminChatRoom${roomId}`}>
            <Form.Label>Write a message</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={adminMsg}
              onChange={(e) => setAdminMsg(e.target.value)}
              onKeyUp={(e) => onAdminMsgSubmit(e, `adminChatRoom${roomId}`)}
              onFocus={() => dispatch(receivedMessage(false))}
            />
          </Form.Group>
          <Button
            variant="success"
            type="submit"
            onClick={(e) => onAdminMsgSubmit(e, `adminChatRoom${roomId}`)}
          >
            Submit
          </Button>
        </Form>
      </Toast.Body>
    </Toast>
  );
};

export default AdminChatRoom;
