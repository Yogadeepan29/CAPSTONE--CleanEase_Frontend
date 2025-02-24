import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Component to restrict access to non-admin users
const PrivateRoute = () => {
  const { currentuser } = useSelector((state) => state.user);
  // If the user is not an admin, render the child routes; otherwise, redirect to admin dashboard
  return currentuser && !currentuser.rest.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/dashboard" />
  );
};

export default PrivateRoute;
