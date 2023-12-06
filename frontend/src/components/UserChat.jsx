import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { useSelector } from "react-redux";

import "./UserChat.css";
import { scrollToChatBottom } from "./admin/AdminChatRoom";

const UserChat = () => {
  const [socket, setSocket] = useState();
  const [chat, setChat] = useState([]);
  const [newMsg, setNewMsg] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState({
    info: "",
    reconnect: false,
  });
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.isAdmin) {
      setConnectionInfo({ ...connectionInfo, reconnect: false });

      const ringtone = new Audio("/audio/chat-msg.mp3");
      const chatSocket = socketIOClient();
      setSocket(chatSocket);

      chatSocket.on("no admin", ({ message }) => {
        ringtone.play();
        setNewMsg(true);
        setChat((chat) => {
          return [
            ...chat,
            {
              admin:
                "Apologize! No admin available right now. Please try again later.",
            },
          ];
        });
      });

      chatSocket.on("admin message to client", ({ message }) => {
        ringtone.play();
        setNewMsg(true);
        setChat((chat) => {
          return [...chat, { admin: message.message }];
        });
      });

      chatSocket.on("admin closed chat", () => {
        setChat([]);
        setConnectionInfo({
          info: "Admin closed the conversation. To reconnect, send a new message",
          reconnect: true,
        });
      });

      return () => chatSocket.disconnect();
    }
  }, [user.isAdmin, connectionInfo.reconnect]);

  const onClientMsgSubmit = (e) => {
    if (e.keyCode && e.keyCode !== 13) {
      return;
    }

    setConnectionInfo({ ...connectionInfo, info: "" });
    const msg = document.getElementById("client-chat-message");
    const trimmedMsg = msg.value.trim();

    if (trimmedMsg) {
      socket.emit("client message", trimmedMsg);
      setChat((chat) => [...chat, { client: trimmedMsg }]);

      msg.value = "";
      msg.focus();
      scrollToChatBottom(".chat-form__message");
    }
  };

  return !user.firstName && !user.isAdmin ? (
    <>
      <input type="checkbox" id="chat" />
      <label className="chat-btn" htmlFor="chat">
        <i className="bi bi-chat-dots chat-btn__open"></i>
        {newMsg && (
          <span className="position-absolute top-0 start-10 end-0 translate-middle-y p-2 bg-danger border border-light rounded-circle"></span>
        )}
        <i className="bi bi-x-circle chat-btn__close"></i>
      </label>
      <div className="chat-wrapper">
        <div className="chat-header">
          <h6>Let's Chat - Online</h6>
        </div>
        <div
          className="chat-form"
          style={{ maxHeight: "500px", overflow: "scroll" }}
        >
          <div className="chat-form__message">
            <p>{connectionInfo.info}</p>
            {chat.map((msg, id) => (
              <div key={id}>
                {msg.client && (
                  <p className="bg-secondary p-3 me-4 text-light rounded-pill">
                    <b>You:</b> {msg.client}
                  </p>
                )}
                {msg.admin && (
                  <p className="bg-primary p-3 ms-4 text-light rounded-pill">
                    <b>Support:</b> {msg.admin}
                  </p>
                )}
              </div>
            ))}
          </div>
          <textarea
            className="chat-form__textbox"
            id="client-chat-message"
            placeholder="Your message"
            onKeyUp={(e) => onClientMsgSubmit(e)}
            onFocus={() => setNewMsg(false)}
          ></textarea>
          <button
            className="btn btn-success btn-block"
            onClick={(e) => onClientMsgSubmit(e)}
          >
            Send
          </button>
        </div>
      </div>
    </>
  ) : null;
};

export default UserChat;
