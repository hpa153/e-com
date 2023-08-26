import { Row, Col } from "react-bootstrap";

import AdminLinks from "../../components/admin/AdminLinks";
import AdminChatRoom from "../../components/admin/AdminChatRoom";

const AdminChatPanel = () => {
  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinks />
      </Col>
      <Col md={10}>
        <Row>
          <AdminChatRoom />
        </Row>
      </Col>
    </Row>
  );
};

export default AdminChatPanel;
