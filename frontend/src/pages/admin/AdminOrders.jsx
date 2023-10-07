import axios from "axios";

import AdminOrdersComp from "../../components/admin/AdminOrdersComp";

const fetchOrders = async () => {
  try {
    const orders = await axios.get("/api/orders/admin");

    return orders.data;
  } catch (error) {
    console.log(error);
  }
};

const AdminOrders = () => {
  return <AdminOrdersComp fetchOrders={fetchOrders} />;
};

export default AdminOrders;
