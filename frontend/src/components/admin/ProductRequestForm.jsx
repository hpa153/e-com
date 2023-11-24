import { useState, useEffect, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Container,
  Form,
  Button,
  CloseButton,
  Table,
  Alert,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { fetchProduct } from "../../pages/ProductDetails";
import { saveAttrToDB } from "../../redux/actions/categoryActions";
import {
  addNewCategory,
  deleteCategory,
} from "../../redux/actions/categoryActions";

const onHover = {
  cursor: "pointer",
  position: "absolute",
  right: "5px",
  top: "-10px",
  transform: "scale(2.7)",
};

const ProductRequestForm = ({ productId = null, handleSubmit }) => {
  const [validated, setValidated] = useState(false);
  const [product, setProduct] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [imagesToUpload, setImagesToUpload] = useState(null);
  const [uploadingMessage, setUploadingMessage] = useState("");
  const attrKey = useRef(null);
  const attrVal = useRef(null);
  const newAttrKey = useRef(null);
  const newAttrVal = useRef(null);
  const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      const fetchedProduct = await fetchProduct(productId);

      setProduct(fetchedProduct);
    };

    if (productId) {
      getProduct();
    }
  }, [productId]);

  // Edit category and attributes
  useEffect(() => {
    if (productId) {
      const productCategory = categories?.find(
        (category) => category.name === product.category
      );

      if (productCategory) {
        const mainCategory = productCategory.name.split("/")[0];
        const mainCategoryData = categories.find(
          (category) => category.name === mainCategory
        );

        if (mainCategoryData && mainCategoryData.attrs.length > 0) {
          setAttributes(mainCategoryData.attrs);
        }
      }
    }
  }, [product.category, categories, productId]);

  const addCategoryHandler = (e) => {
    if (e.keyCode && e.keyCode === 13 && e.target.value) {
      dispatch(addNewCategory(e.target.value));
      setProduct({ ...product, category: e.target.value });
      e.target.value = "";
    }
  };

  const resetAttrList = useCallback(() => {
    const attrValues = attrVal.current;

    if (attrValues !== null) {
      while (attrValues.options.length) {
        attrValues.remove(0);
      }

      attrValues.add(new Option("Choose attribute value", ""));
    }
  }, []);

  const setAttrSelectValues = (e) => {
    if (e.target.value) {
      const selectedAttr = attributes.find(
        (attr) => attr.key === e.target.value
      );
      const attrValues = attrVal.current;

      if (selectedAttr && selectedAttr.value.length > 0) {
        resetAttrList();

        selectedAttr.value.forEach((attr) => {
          attrValues.add(new Option(attr));
        });
      }
    }
  };

  const onChangeCategory = (e) => {
    const mainCategory = e.target.value.split("/")[0];
    const mainCategoryData = categories.find(
      (category) => category.name === mainCategory
    );

    if (mainCategoryData && mainCategoryData.attrs.length > 0) {
      setAttributes(mainCategoryData.attrs);
    }

    setProduct({ ...product, category: mainCategory });
  };

  const deleteCategoryHandler = () => {
    if (window.confirm("Permanently delete this category?")) {
      dispatch(deleteCategory(product.category));
      setProduct({ ...product, category: "" });
    }
  };

  const addAttr = (key, value) => {
    let isAttrUpdated = false;
    const tempAttrs = product.attrs || [];

    if (tempAttrs.length > 0) {
      tempAttrs.map((attr) => {
        if (attr.key === key) {
          isAttrUpdated = true;
          attr.value = value;
        }
        return attr;
      });
    }

    if (!isAttrUpdated) {
      tempAttrs.push({
        key,
        value,
      });
    }

    setProduct({ ...product, attrs: tempAttrs });
  };

  const onSelectAttr = (e) => {
    if (e.target.value) {
      addAttr(attrKey.current.value, e.target.value);

      attrKey.current.value = "";
      resetAttrList();
    }
  };

  const deleteAttr = (attrKey) => {
    const newAttrList = product.attrs.filter((attr) => attr.key !== attrKey);

    setProduct({ ...product, attrs: newAttrList });
  };

  const checkKeyDown = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
    }
  };

  const addNewAttr = (e) => {
    e.preventDefault();

    if (e.keyCode && e.keyCode === 13) {
      if (newAttrKey.current.value && newAttrVal.current.value) {
        addAttr(newAttrKey.current.value, newAttrVal.current.value);
        dispatch(
          saveAttrToDB(
            newAttrKey.current.value,
            newAttrVal.current.value,
            product.category
          )
        );

        newAttrKey.current.value = "";
        newAttrVal.current.value = "";

        if (attrKey.current !== null) {
          attrKey.current.value = "";
        }

        resetAttrList();
        newAttrKey.current.focus();
      }
    }
  };

  const deleteImage = async (imagePath) => {
    try {
      const encodedPath = encodeURIComponent(imagePath);
      await axios.delete(
        `/api/products/admin/image/${encodedPath}/${productId}`
      );

      const updatedImages = product.images.filter(
        (image) => image.path !== imagePath
      );
      setProduct({ ...product, images: updatedImages });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (e) => {
    const uploadResponse = await handleSubmit(e, product.attrs, imagesToUpload);

    if (uploadResponse) {
      setUploadingMessage(uploadResponse);
    }
    setValidated(true);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Return
          </Link>
        </Col>
        <Col md={6}>
          <h1>{productId ? "Edit product" : "Create a new product"}</h1>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleFormSubmit}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                required
                type="text"
                defaultValue={productId ? product.name : ""}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                required
                as="textarea"
                rows={3}
                defaultValue={productId ? product.description : ""}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>In stock</Form.Label>
              <Form.Control
                name="count"
                required
                type="number"
                defaultValue={productId ? product.count : ""}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price (in US$)</Form.Label>
              <Form.Control
                name="price"
                required
                type="text"
                defaultValue={productId ? product.price : ""}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>
                Category
                <CloseButton onClick={deleteCategoryHandler} />
                &nbsp; (<small>Remove selected category</small>)
              </Form.Label>
              <Form.Select
                required
                value={product.category ? product.category : ""}
                name="category"
                aria-label="Default select example"
                onChange={onChangeCategory}
              >
                <option value="">Choose category</option>
                {categories?.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicNewCategory">
              <Form.Label>
                Or create a new category (E.g. Computer/Laptops)
              </Form.Label>
              <Form.Control
                name="newCategory"
                type="text"
                disabled={product.category !== ""}
                onKeyUp={addCategoryHandler}
                placeholder="Reset selected category to create"
              />
            </Form.Group>

            {attributes.length > 0 && (
              <Row className="mt-5">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicAttributes">
                    <Form.Label>Choose atrribute and set value</Form.Label>
                    <Form.Select
                      name="atrrKey"
                      aria-label="Default select example"
                      ref={attrKey}
                      onChange={setAttrSelectValues}
                    >
                      <option value="">Choose attribute</option>
                      {attributes?.map((attr) => (
                        <option key={attr.key} value={attr.key}>
                          {attr.key}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicAttributeValue"
                  >
                    <Form.Label>Attribute value</Form.Label>
                    <Form.Select
                      name="atrrVal"
                      aria-label="Default select example"
                      ref={attrVal}
                      onChange={onSelectAttr}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {product && product.attrs?.length > 0 && (
              <Row>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.attrs.map((attr) => (
                      <tr key={attr.key}>
                        <td>{attr.key}</td>
                        <td>{attr.value}</td>
                        <td>
                          <CloseButton onClick={() => deleteAttr(attr.key)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Row>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    disabled={product.category === ""}
                    placeholder="first choose or create category"
                    name="newAttrKey"
                    type="text"
                    ref={newAttrKey}
                    onKeyUp={addNewAttr}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicNewAttributeValue"
                >
                  <Form.Label>Attribute value</Form.Label>
                  <Form.Control
                    disabled={product.category === ""}
                    placeholder="first choose or create category"
                    name="newAttrValue"
                    type="text"
                    ref={newAttrVal}
                    onKeyUp={addNewAttr}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="primary">
              After typing attribute key and value press enter on one of the
              field
            </Alert>

            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
              <Form.Label>Images</Form.Label>
              <Row className="mb-3">
                {product?.images &&
                  product.images?.map((image) => (
                    <Col
                      key={image._id}
                      style={{ position: "relative" }}
                      xs={3}
                    >
                      <Image crossOrigin="anonymous" src={image.path} fluid />
                      <i
                        style={onHover}
                        className="bi bi-x text-danger"
                        onClick={() => deleteImage(image.path)}
                      ></i>
                    </Col>
                  ))}
              </Row>
              <Form.Control
                required={!product.images || product.images?.length === 0}
                type="file"
                multiple
                onChange={(e) => {
                  setImagesToUpload(e.target.files);
                }}
                onSubmit={(e) => e.preventDefault()}
              />
              {uploadingMessage && (
                <Alert className="mt-3" variant="danger">
                  {uploadingMessage}
                </Alert>
              )}
            </Form.Group>
            <Button variant="primary" type="submit">
              {productId ? "UPDATE" : "CREATE"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductRequestForm;
