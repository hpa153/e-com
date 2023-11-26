import { useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ProductRequestForm from "../../components/admin/ProductRequestForm";
import uploadImagesToCloud from "../../utils/uploadImagesToCloud";

const AdminEditProduct = () => {
  const { productId } = useParams();
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
          await axios.put(`/api/products/admin/${productId}`, formInputs);

          if (formData) {
            // await axios.post(
            //   `/api/products/admin/file-upload?productId=${productId}`,
            //   formData
            // );
            const result = uploadImagesToCloud(formData, productId);

            if (result?.error) {
              return result.error;
            }
          }

          navigate("/admin/products");
        } catch (error) {
          console.log(error);
        }
      }
    },
    [navigate, productId]
  );

  return (
    <ProductRequestForm productId={productId} handleSubmit={handleSubmit} />
  );
};

export default AdminEditProduct;
