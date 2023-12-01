import axios from "axios";

import ProductListComp from "../components/products/ProductListComp";

const createFilterQuery = (filters) => {
  let filterUrl = "";
  Object.keys(filters).forEach((filter, idx) => {
    if (filter === "price" && filters[filter] !== 0) {
      filterUrl += `&price=${filters[filter]}`;
    } else if (
      filter === "rating" &&
      Object.entries(filters[filter]).length > 0
    ) {
      let tempRating = "";

      Object.keys(filters[filter]).forEach((key) => {
        if (filters[filter][key]) {
          tempRating += `${key},`;
        }
      });

      filterUrl += `&rating=${tempRating}`;
    } else if (filter === "attrs" && filters[filter].length > 0) {
      const tempAttrs = filters[filter].reduce((acc, item) => {
        const key = item.key;
        const val = item.value.join("-");
        return acc + key + "-" + val + ",";
      }, "");

      filterUrl += `&attrs=${tempAttrs}`;
    } else if (filter === "searchQuery" && filters[filter]) {
      filterUrl += `&searchQuery=${filters[filter]}`;
    }

    return "";
  });

  return filterUrl;
};

const fetchProducts = async (categoryName, sortOption = "", filters = {}) => {
  let filterUrl = "";
  const search = filters.searchQuery ? `search/${filters.searchQuery}/` : "";
  const category = categoryName
    ? `categories/${categoryName}/`
    : filters.categories
    ? `categories/${filters.categories}/`
    : "";

  const sort = sortOption ? `&sort=${sortOption}` : "";

  if (Object.entries(filters).length > 1) {
    filterUrl = createFilterQuery(filters);
  }

  const specifiedUrl = `${category}${search}?pageNum=${filters.page}${filterUrl}${sort}`;
  console.log(specifiedUrl);
  const products = await axios.get("/api/products/" + specifiedUrl);
  // console.log(specifiedUrl);
  return products.data;
};

const ProductList = () => {
  return <ProductListComp fetchProducts={fetchProducts} />;
};

export default ProductList;
