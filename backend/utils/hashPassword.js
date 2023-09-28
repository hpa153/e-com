const brycpt = require("bcryptjs");

const salt = brycpt.genSaltSync(10);

const hashPassword = (password) => brycpt.hashSync(password, salt);

const comparePasswords = (inputPassword, hashedPassword) =>
  brycpt.compareSync(inputPassword, hashedPassword);

module.exports = { hashPassword, comparePasswords };
