import axios from "axios";

import { LOGIN_USER, LOGOUT_USER } from "../constants/userConstants";

export const setReduxUser = (loggedInUser) => (dispatch) => {
  dispatch({
    type: LOGIN_USER,
    payload: loggedInUser,
  });
};

export const logoutUser = (loggedInUser) => (dispatch) => {
  document.location.href = "/login";
  axios.get("/api/logout");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cart");
  sessionStorage.removeItem("userInfo");

  dispatch({ type: LOGOUT_USER });
};
