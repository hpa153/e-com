import { useState } from "react";
import axios from "axios";

import RegisterComp from "../components/user/RegisterComp";

const registerUser = async (firstName, lastName, email, password) => {
  const user = await axios.post("/api/users/register", {
    firstName,
    lastName,
    email,
    password,
  });

  sessionStorage.setItem("userInfo", JSON.stringify(user.data));

  return user.data;
};

const Register = () => {
  return <RegisterComp registerUser={registerUser} />;
};

export default Register;
