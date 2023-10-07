import { useCallback } from "react";
import axios from "axios";

import AdminOrderDetailsComp from "../../components/admin/AdminOrderDetailsComp";

const AdminOrderDetails = () => {
  const fetchOrderDetails = useCallback(async (id) => {
    try {
      const orderDetails = await axios.get(`/api/orders/user/${id}`);

      return orderDetails.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  return <AdminOrderDetailsComp fetchOrderDetails={fetchOrderDetails} />;
};

export default AdminOrderDetails;
