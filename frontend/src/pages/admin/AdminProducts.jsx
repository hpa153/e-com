import axios from "axios";

import AdminProdsComp from "../../components/admin/AdminProdsComp";

const fetchProducts = async () => {
  try {
    const products = await axios.get("/api/products/admin");

    return products.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteProd = async (productId) => {
  try {
    const products = await axios.delete(`/api/products/admin/${productId}`);
    return products.data;
  } catch (error) {
    console.log(error);
  }
};

const AdminProducts = () => {
  return (
    <AdminProdsComp fetchProducts={fetchProducts} deleteProd={deleteProd} />
  );
};

export default AdminProducts;
