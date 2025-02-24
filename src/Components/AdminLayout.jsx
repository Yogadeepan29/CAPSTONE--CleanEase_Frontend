import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminOrders from "../Pages/Admin/AdminOrders";
import AdminReviews from "../Pages/Admin/AdminReviews";
import AdminServices from "../Pages/Admin/AdminServices";
import AdminTransaction from "../Pages/Admin/AdminTransaction";
import AdminUsers from "../Pages/Admin/AdminUsers";
import AdminSidebar from "./AdminSidebar";
import PageNotFound from "../Pages/Common/PageNotFound";

const AdminLayout = () => {
  const location = useLocation(); // Get the current location

  // Valid admin routes
  const validAdminRoutes = [
    "/admin/dashboard",
    "/admin/orders",
    "/admin/reviews",
    "/admin/services",
    "/admin/transactions",
    "/admin/users",
  ];

  // Check if the current route is a valid admin route
  const isValidAdminRoute = validAdminRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      <div className="md:flex justify-center">
        <div className=" md:min-h-screen ">
          {/* Render AdminSidebar only for valid admin routes */}
          {isValidAdminRoute && (
            <aside className="hidden md:min-h-screen md:inline justify-end bg-gray-50 dark:bg-gray-800">
              <AdminSidebar />
            </aside>
          )}
        </div>
        <div className=" container p-4 relative ">
          <div className="flex-1 p-6 text-black dark:text-white">
            <Routes>
              {/* Define routes for admin pages */}
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="transactions" element={<AdminTransaction />} />
              <Route path="users" element={<AdminUsers />} />
              {/* Catch-all route for undefined paths */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
