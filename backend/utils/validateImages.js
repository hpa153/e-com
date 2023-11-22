// const capitalizeName = (name) => {
//   return name
//     .trim()
//     .split(" ")
//     .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
// };

const validateImages = (images) => {
  let arrImages = [];

  if (Array.isArray(images)) {
    arrImages = images;
  } else {
    arrImages.push(images);
  }

  if (arrImages.length > 3) {
    return { error: "The limit of images is 3!" };
  }

  for (let image of arrImages) {
    if (image.size > 2097152) {
      return { error: "Exceeded image size limit (2 MB)!" };
    }

    if (!/jpg|jpeg|png/.test(image.mimetype)) {
      return {
        error:
          "Please upload image file (Allowed types are jpg, jpeg and png)!",
      };
    }
  }

  return { error: false };
};

module.exports = validateImages;
