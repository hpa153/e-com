import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

import UserChat from "./UserChat";
import Login from "../pages/Login";

const RouteProtector = ({ admin }) => {
  const [isAuth, setIsAuth] = useState();

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const accessToken = await axios.get("/api/get-token");

        if (accessToken.data.isAdmin) {
          setIsAuth(accessToken.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAccessToken();
  }, [isAuth]);

  if (!isAuth) {
    return <Login />;
  }

  return !(isAuth && admin) ? (
    <Navigate to="/login" />
  ) : isAuth && admin ? (
    <Outlet />
  ) : isAuth && !admin ? (
    <>
      <UserChat />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default RouteProtector;
