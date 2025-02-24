// Pages/Success.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { removeFromCart, setCartItems } from "../../Redux/Slice/cartSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { setNewOrder } from "../../Redux/Slice/orderSlice";
import { Button, Card, Spinner } from "flowbite-react";
import { format } from "date-fns";
import API_BASE_URL from "../../apiConfig";

const Success = () => {
  const location = useLocation();
  const checkoutId = new URLSearchParams(location.search).get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const dispatch = useDispatch();

  const pollWebhook = async (checkoutId, timeout = 30000, interval = 1000) => {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const response = await axios.get(
        `${API_BASE_URL}/checkout/${checkoutId}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
        }
      );

      if (response.data && response.data.receiptUrl) {
        return response.data;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error("Receipt URL not available within the timeout period.");
  };

  useEffect(() => {
    const processOrder = async () => {
      if (!checkoutId) {
        setError("Checkout ID is missing");
        setLoading(false);
        return;
      }

      try {
        // Wait for the receipt URL
        const checkoutData = await pollWebhook(checkoutId);

        console.log("Checkout Data with Receipt URL:", checkoutData);

        // Proceed with creating the order
        const orderResponse = await axios.post(
          `${API_BASE_URL}/checkout/create-from-checkout/${checkoutId}`,
          {
            userId: checkoutData.userId,
            items: checkoutData.checkoutData.items,
            totalAmount: checkoutData.checkoutData.totalPrice,
            source: checkoutData.source,
            serviceAddressId: checkoutData.serviceAddressId, // Add serviceAddressId
            serviceAddress: checkoutData.serviceAddress, // Add serviceAddress
          },
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("Token"),
            },
          }
        );

        dispatch(setNewOrder());
        console.log("Order Created:", orderResponse.data);
        toast.success("Order placed successfully!");
        setOrderDetails(orderResponse.data);

        if (orderResponse.data.source === "cart") {
          await removeItemsFromCart(orderResponse.data.items);
        }
      } catch (error) {
        console.error("Error processing order:", error);
        setError("Failed to process order");
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [checkoutId, dispatch]);

  const removeItemsFromCart = async (items) => {
    const productIds = items.map((item) => item.productId).filter((id) => id);

    if (productIds.length > 0) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/cart/remove-multiple`,
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("Token"),
            },
            data: { productIds },
          }
        );

        console.log("Removed items from cart:", response.data);
        dispatch(setCartItems(response.data.cart));
        productIds.forEach((productId) => {
          dispatch(removeFromCart(productId));
        });
      } catch (error) {
        console.error("Error removing items from cart:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-20 min-h-screen ">
        <Spinner aria-label="Loading..." size="xl" />
        <p className="mt-4 ml-2 dark:text-gray-400">Please wait...</p>
      </div>
    );
  }
  if (error) return <p className="text-center mt-20 min-h-screen">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-green-800 text-white px-4 py-8">
      <div className="text-center w-full max-w-3xl">
        <FaCheckCircle className="mx-auto text-6xl md:text-8xl text-white mb-6" />
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Your order has been processed successfully.
        </p>

        {orderDetails && (
          <Card className="mx-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
              <p className="flex gap-2 mb-2 text-xl sm:text-2xl font-semibold whitespace-normal items-center">
                <strong>Order No</strong>{" "}
                <span className=" flex items-center">:</span> #
                {orderDetails.orderNo}
              </p>
              <div>
                <div className="flex gap-1">
                  <strong>Date:</strong>
                  <span>
                    {format(new Date(orderDetails.createdAt), "dd-MM-yyyy")}
                  </span>
                </div>
                <div className="flex gap-1">
                  <strong>Time:</strong>
                  <span>
                    {new Date(orderDetails.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
              <p>
                <strong>Transaction ID:</strong>
              </p>
              <p className="break-words">{orderDetails.transactionId}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
              <p>
                <strong>Payment Mode:</strong>
              </p>
              <p>{orderDetails.paymentMode}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <p>
                <strong>Total Amount:</strong>
              </p>
              <p>₹ {orderDetails.totalAmount}</p>
            </div>
          </Card>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/orders">
            <Button gradientDuoTone="greenToBlue" className="text-lg">
              View Orders
            </Button>
          </Link>
          <Link to="/">
            <Button outline gradientDuoTone="greenToBlue" className=" text-lg">
              Back to Homepage
            </Button>
          </Link>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar
          closeOnClick
          rtl={false}
          theme="colored"
          className="top-20 mt-5"
        />
      </div>
    </div>
  );
};

export default Success;
