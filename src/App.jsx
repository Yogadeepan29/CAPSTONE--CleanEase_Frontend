import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/User/Home";
import Cart from "./Pages/User/Cart";
import Services from "./Pages/User/Services";
import Signin from "./Pages/User/Signin";
import Signup from "./Pages/User/Signup";
import Header from "./Components/Header";
import FooterComp from "./Components/Footer";
import UserDashboard from "./Pages/User/UserDashboard";
import PrivateRoute from "./Components/PrivateRoute";
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute";
import PageNotFound from "./Pages/Common/PageNotFound";
import ServiceDetails from "./Pages/User/ServiceDetails";
import Order from "./Pages/User/Order";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "./Redux/Slice/cartSlice";
import CheckoutSlot from "./Pages/User/CheckoutSlot";
import CheckoutSummary from "./Pages/User/CheckoutSummary";
import CheckoutAddress from "./Pages/User/CheckoutAddress";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Success from "./Pages/User/Success";
import Cancel from "./Pages/User/Cancel";
import AdminLayout from "./Components/AdminLayout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = () => {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user); 
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    dispatch(setCartItems(cartItems));
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen top-20">
      <BrowserRouter>
        <Header />
        <main className="flex-1 ">
          <Routes>
            {/* Common Routes for All Users */}
            <Route path="/" element={currentuser && currentuser.rest.isAdmin ? <Navigate to="/admin/dashboard" /> : <Home />} />
            <Route path="/user/dashboard" element={!currentuser ? <Navigate to="/signin" /> : <UserDashboard />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            {/* Admin Routes */}
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="/admin/*" element={<AdminLayout />} />
            </Route>
            {/* Private Routes for Normal Users */}
            <Route element={<PrivateRoute />}>
              <Route path="/services" element={<Services />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutAddress />} />
              <Route path="/checkout/slot" element={<CheckoutSlot />} />
              <Route path="/order/success" element={<Success />} />
              <Route path="/order/cancel" element={<Cancel />} />
              <Route path="/orders" element={<Order />} />
              <Route
                path="/services/:category/:productName"
                element={<ServiceDetails />}
              />
              <Route
                path="/checkout/summary"
                element={
                  <Elements stripe={stripePromise}>
                    <CheckoutSummary />
                  </Elements>
                }
              />
            </Route>
            {/* Catch-all for non-existing routes */}
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </main>
        <FooterComp />
      </BrowserRouter>
    </div>
  );
};

export default App;
