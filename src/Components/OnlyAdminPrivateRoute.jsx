import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Component to restrict access to admin users only
const OnlyAdminPrivateRoute = () => {
  const { currentuser } = useSelector((state) => state.user);
  // If the user is an admin, render the child routes; otherwise, redirect to sign-in
  return currentuser && currentuser.rest.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default OnlyAdminPrivateRoute;
