import "./UserChat.css";

const UserChat = () => {
  return (
    <>
      <input type="checkbox" id="chat" />
      <label className="chat-btn" htmlFor="chat">
        <i className="bi bi-chat-dots chat-btn__open"></i>
        <span className="position-absolute top-0 start-10 end-0 translate-middle-y p-2 bg-danger border border-light rounded-circle"></span>
        <i className="bi bi-x-circle chat-btn__close"></i>
      </label>
      <div className="chat-wrapper">
        <div className="chat-header">
          <h6>Let's Chat - Online</h6>
        </div>
        <div className="chat-form">
          <div className="chat-form__message">
            {Array.from({ length: 20 }).map((_, id) => (
              <div key={id}>
                <p>
                  <b>You:</b> Hello, world! This is a toast message.
                </p>
                <p className="bg-primary p-3 ms-4 text-light rounded-pill">
                  <b>Support:</b> Hello, world! This is a toast message.
                </p>
              </div>
            ))}
          </div>
          <textarea
            className="chat-form__textbox"
            id="client-chat-message"
            placeholder="Your message"
          ></textarea>
          <button className="btn btn-success btn-block">Send</button>
        </div>
      </div>
    </>
  );
};

export default UserChat;
