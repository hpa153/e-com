import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

import AdminLinks from "../../components/admin/AdminLinks";
import AdminChatRoom from "../../components/admin/AdminChatRoom";

const AdminChatPanel = () => {
  const { chatRooms, socket } = useSelector((state) => state.chat);

  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinks />
      </Col>
      <Col md={10}>
        <Row>
          {Object.entries(chatRooms).map((chatRoom, idx) => (
            <AdminChatRoom
              key={idx}
              chatRoom={chatRoom}
              roomId={idx + 1}
              socket={socket}
            />
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default AdminChatPanel;
