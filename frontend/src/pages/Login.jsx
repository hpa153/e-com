import axios from "axios";

import LoginComp from "../components/user/loginComp";

const loginRequest = async (email, password, doNotLogout) => {
  try {
    const user = await axios.post("/api/users/login", {
      email,
      password,
      doNotLogout,
    });

    if (user.data.userLoggedIn.doNotLogout) {
      localStorage.setItem("userInfo", JSON.stringify(user.data.userLoggedIn));
    } else {
      sessionStorage.setItem(
        "userInfo",
        JSON.stringify(user.data.userLoggedIn)
      );
    }

    return user.data;
  } catch (error) {
    console.log(error);
  }
};

const Login = () => {
  return <LoginComp loginRequest={loginRequest} />;
};

export default Login;
