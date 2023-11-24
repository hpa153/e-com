import validateImages from "./validateImages";

const uploadImagesToCloud = (images, productId) => {
  const validationResult = validateImages(images);

  if (validationResult) {
    console.log(validationResult.error);
    return validationResult;
  } else {
    const url = process.env.REACT_APP_CLOUDINARY_URL;
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      formData.append("file", file);
      formData.append("upload_preset", "sojda3t4");
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          fetch(`/api/products/admin/file-upload?productId=${productId}`, {
            method: "POST",
            body: data.url,
          });
        });
    }
  }
};

export default uploadImagesToCloud;
