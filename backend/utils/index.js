const capitalizeName = (name) => {
  return name
    .trim()
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
};

module.export = capitalizeName;
