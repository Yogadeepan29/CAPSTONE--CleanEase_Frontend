import { Breadcrumb, Button, Card, HR, Checkbox, Label } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineArrowRight } from "react-icons/hi";
import { loadStripe } from "@stripe/stripe-js";
import {
  updateSubscriptionStatus,
  setCheckoutData,
} from "../../Redux/Slice/cartSlice";
import API_BASE_URL from "../../apiConfig";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutSummary = () => {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);
  const checkoutData = useSelector((state) => state.cart.checkoutData);
  const isFromServiceDetails = checkoutData.source === "serviceDetails";
  const [isSubscribed, setIsSubscribed] = useState(
    checkoutData.items[0].subscription
  );


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubscriptionChange = (event) => {
    const checked = event.target.checked;
    setIsSubscribed(checked);
    const updatedCheckoutData = JSON.parse(JSON.stringify(checkoutData));

    updatedCheckoutData.subscription = checked ? "true" : "false";

    updatedCheckoutData.items.forEach((item) => {
      if (checked) {
        item.prevaddons = item.addons;
        item.addons = [];
        item.subscription = true;
        item.subtotal = item.price;
      } else {
        item.addons = item.prevaddons;
        item.subscription = false;
        item.subtotal =
          item.price + item.addons.reduce((acc, addon) => acc + addon.price, 0);
      }
    });

    // Recalculate total price
    updatedCheckoutData.totalPrice = updatedCheckoutData.items.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );

    dispatch(setCheckoutData(updatedCheckoutData));
    dispatch(
      updateSubscriptionStatus({ serviceIndex: 0, subscription: checked })
    );
  };



  const handlePayment = async () => {
    try {
      const hasSubscription = checkoutData.items.some(
        (item) => item.subscription
      );
  
      // Prepare the items with the selected address
      const itemsWithAddress = checkoutData.items.map((item) => {
        const selectedAddress = currentuser.rest.addresses.find(
          (address) => address._id === item.selectedAddressId
        );
  
        return {
          productDetail: checkoutData.productDetails[item.productId],
          subtotal: item.subtotal,
          subscription: item.subscription,
          addons: item.addons,
          date: item.date,
          time: item.time,
          selectedAddressId: item.selectedAddressId,
          selectedAddress: selectedAddress, // Add the full address object
        };
      });
  
      let response;
  
      // Determine the endpoint based on subscription status
      const endpoint = hasSubscription
        ? `${API_BASE_URL}/payment/create-checkout-session-for-subscription`
        : `${API_BASE_URL}/payment/create-checkout-session`;
  
      // Use Axios to send the POST request
      response = await axios.post(endpoint, {
        items: itemsWithAddress,
        source: checkoutData.source,
        totalPrice: checkoutData.totalPrice,
      }, {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("Token"),
        },
      });
  
      // Check if the response contains a session ID
      if (response.data.id) {
        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({ sessionId: response.data.id });
  
        if (result.error) {
          alert(result.error.message);
        }
      } else {
        alert("Payment failed: " + response.data.error);
      }
    } catch (error) {
      console.error("Error during payment processing:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert("An error occurred: " + errorMessage);
    }
  };

  return (
    <>
      <section className=" mx-auto container min-h-screen antialiased dark:bg-gray-900 ">
        <div className="mx-auto top-20 max-w-screen-xl p-4 2xl:px-0 mt-10 sm:mt-5">
          <h2 className="text-3xl md:text-5xl text-center font-semibold text-blue-600 dark:text-blue-500  ">
            Checkout{" "}
          </h2>
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <Breadcrumb
                aria-label="Default breadcrumb example "
                className="my-5 "
              >
                <Breadcrumb.Item className="truncate">
                  {checkoutData.source === "cart" ? (
                    <Link
                      to="/cart"
                      className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      Cart
                    </Link>
                  ) : (
                    <span className="hidden sm:inline">Checkout</span>
                  )}
                </Breadcrumb.Item>

                <Breadcrumb.Item>
                  <Link
                    to="/checkout"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Service Address
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link
                    to="/checkout/slot"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Slot Selection
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {" "}
                  <span className="font-bold text-gray-800  dark:text-gray-200 cursor-default">
                    {" "}
                    Payment
                  </span>
                </Breadcrumb.Item>
              </Breadcrumb>

              <Card className="mt-4 border border-gray-700 bg-gray-50 dark:border-gray-400 dark:bg-gray-800 rounded-3xl">
                <div className="text-center font-semibold text-2xl md:text-3xl text-yellow-500 dark:text-yellow-400 tracking-wider">
                  <h1>Review Services and Details</h1>
                </div>
                {checkoutData.items.map((item) => {
                  const productDetail =
                    checkoutData.productDetails[item.productId];
                  const selectedAddress = currentuser.rest.addresses.find(
                    (address) => address._id === item.selectedAddressId
                  );

                  return (
                    <div
                      key={item.productId}
                      className="flex justify-between items-start p-4 border border-slate-200 dark:border-slate-700 rounded-3xl"
                    >
                      <Link
                        to="#"
                        className="h-32 w-32 shrink-0 hidden sm:flex"
                      >
                        <img
                          className="w-full object-cover transition-transform duration-300 ease-in-out transform rounded-xl"
                          src={productDetail.productImg}
                          alt={productDetail.name}
                        />
                      </Link>

                      <div className="flex-1 ml-4">
                        <Link
                          href="#"
                          className="font-medium text-green-500 dark:text-green-400  text-xl  "
                        >
                          {productDetail.name}
                        </Link>
                        {item.addons.length > 0 && (
                          <div className="my-2">
                            <h2 className="font-semibold text-gray-900 text-sm dark:text-white inline">
                              Addons :{" "}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 inline ml-1">
                              {item.addons
                                .map((addon) => addon.name)
                                .join(", ")}
                            </p>
                          </div>
                        )}
                        {item.subscription && (
                          <div className="my-2">
                            <p className="text-md text-gray-600 dark:text-gray-400">
                              <span className="font-semibold text-lg text-green-500">
                                Benefits:{" "}
                              </span>
                              All the addons for this service are complementary
                              for subscription.
                            </p>
                          </div>
                        )}

                        <div className="mt-2">
                          <h2 className="font-semibold text-gray-900 text-sm dark:text-white inline">
                            Service Address :
                          </h2>
                          {selectedAddress && (
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400 inline ml-1">
                              {selectedAddress.doorNumber},{" "}
                              {selectedAddress.streetName},{" "}
                              {selectedAddress.area}, {selectedAddress.city},{" "}
                              {selectedAddress.state} -{" "}
                              {selectedAddress.pinCode}
                            </p>
                          )}
                        </div>

                        <div className="mt-2">
                          <h2 className="font-semibold text-gray-900 text-sm dark:text-white inline">
                            Service Slot :
                          </h2>
                          <p className="text-sm font-normal text-gray-500 dark:text-gray-400 inline ml-1">
                            {formatDate(item.date)} - {item.time}
                          </p>
                        </div>
                        {isFromServiceDetails &&
                          productDetail.stripePriceId && (
                            <div className="flex items-center mt-4 justify-end gap-1">
                              <Checkbox
                                id="subscription-checkbox"
                                className="mr-2 cursor-pointer"
                                checked={isSubscribed}
                                onChange={handleSubscriptionChange}
                              />
                              <Label
                                htmlFor="subscription-checkbox"
                                className="text-gray-900 dark:text-white cursor-pointer"
                              >
                                Add to Monthly Subscription
                              </Label>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </Card>

              <Card className="mt-4 border border-gray-700 bg-gray-50 dark:border-gray-400 dark:bg-gray-800">
                <div className="text-center font-bold text-2xl md:text-3xl text-yellow-500 dark:text-yellow-400 tracking-wider ">
                  <h1>Checkout Summary</h1>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
                    No. of Services : {checkoutData.items.length}
                  </h2>
                  <div className="mt-2 space-y-2">
                    {checkoutData.items.map((item) => {
                      const productDetail =
                        checkoutData.productDetails[item.productId];
                      return (
                        <div
                          key={item.productId}
                          className="flex justify-between"
                        >
                          <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                            {productDetail
                              ? productDetail.name
                              : "Product details not available"}
                          </p>
                          <p className="text-md font-medium text-gray-900 dark:text-white">
                            ₹&nbsp;
                            {item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {checkoutData.items.some(
                    (item) => item.addons.length > 0
                  ) && (
                    <div className="text-sm font-normal text-red-600 flex items-center mt-4">
                      <span className="mr-2 text-xl">*</span>
                      <p>Prices including Additional services</p>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700 mt-4">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      Total
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹&nbsp;
                      {checkoutData.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:pt-5 lg:w-full lg:sticky lg:top-20  lg:self-start">
              <Card className="space-y-4 rounded-lg border border-gray-700 bg-gray-50 p-4 shadow-sm dark:border-gray-400 dark:bg-gray-800 sm:p-6 ">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white text-center whitespace-nowrap">
                  Payment
                </p>
                <div className="flex items-center">
                  <Checkbox
                    id="online-payment"
                    checked
                    disabled
                    className="mr-2"
                  />
                  <Label
                    htmlFor="online-payment"
                    className="text-gray-900 dark:text-white"
                  >
                    Online Payment
                  </Label>
                </div>

                <div className="flex items-center opacity-50">
                  <Checkbox id="cod" disabled className="mr-2" />
                  <Label
                    htmlFor="cod"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    Pay on Service (COD)
                  </Label>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-600 ml-2 font-bold text-xl">*</span>
                  <span className="text-red-600 text-sm font-semibold">
                    Currently Pay on Service (COD) is unavailable
                  </span>
                </div>
                <div className="flex justify-between mt-4 font-bold text-gray-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span>
                    ₹&nbsp;
                    {checkoutData.totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex  items-center justify-center gap-2 mt-2">
                  <Button
                    className="flex w-full items-center gap-2 justify-center align-center p-0.5 "
                    outline
                    gradientDuoTone="cyanToBlue"
                    type="submit"
                    onClick={handlePayment}
                  >
                    <div className="text-base flex text-center align-center items-center gap-2">
                      Proceed to Payment{" "}
                      <HiOutlineArrowRight className="text-xl mt-1" />
                    </div>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutSummary;
