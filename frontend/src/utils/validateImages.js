const validateImages = (images) => {
  let arrImages = [];

  if (Array.isArray(images)) {
    arrImages = Array.from(images);
  } else {
    arrImages.push(images);
  }

  if (images.length > 3) {
    return { error: "The limit of images is 3!" };
  }

  for (let image of arrImages) {
    for (let i = 0; i < image.length; i++) {
      if (image[i].size > 2097152) {
        return { error: "Exceeded image size limit (2 MB)!" };
      }

      if (!/jpg|jpeg|png/.test(image[i].type.split("/")[1])) {
        return {
          error:
            "Please upload image file (Allowed types are jpg, jpeg and png)!",
        };
      }
    }
  }

  return {
    error: null,
  };
};

export default validateImages;
