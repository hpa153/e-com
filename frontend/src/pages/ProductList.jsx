import axios from "axios";

import ProductListComp from "../components/products/ProductListComp";

const fetchProducts = async () => {
  const products = await axios.get("/api/products");

  return products.data;
};
const ProductList = () => {
  return <ProductListComp fetchProducts={fetchProducts} />;
};

export default ProductList;
