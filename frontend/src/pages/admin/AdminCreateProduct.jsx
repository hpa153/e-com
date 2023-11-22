import { useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ProductRequestForm from "../../components/admin/ProductRequestForm";
import uploadImagesToCloud from "../../utils/uploadImagesToCloud";

const AdminCreateProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (event, attrs, formData) => {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget.elements;
      const formInputs = {
        name: form.name.value,
        description: form.description.value,
        count: form.count.value,
        price: form.price.value,
        category: form.category.value,
        attributesTable: attrs,
      };

      if (event.currentTarget.checkValidity() === true) {
        try {
          const createdProduct = await axios.post(
            "/api/products/admin",
            formInputs
          );

          if (formData) {
            const result = uploadImagesToCloud(
              formData,
              createdProduct.data.productId
            );

            if (result.error) {
              return result.error;
            }
          }

          navigate("/admin/products");
        } catch (error) {
          console.log(error);
        }
      }
    },
    [navigate]
  );

  return <ProductRequestForm handleSubmit={handleSubmit} />;
};

export default AdminCreateProduct;
