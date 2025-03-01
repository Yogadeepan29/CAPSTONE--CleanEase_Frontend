import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Accordion,
  Checkbox,
  Label,
  Radio,
  Spinner,
} from "flowbite-react";
import { HiTrash } from "react-icons/hi";
import { FaShoppingBag } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  setCartItems,
  setCheckoutData,
  updateSubscriptionStatus,
} from "../../Redux/Slice/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../apiConfig";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [token, setToken] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [selectedAddons, setSelectedAddons] = useState({});
  const [loading, setLoading] = useState(true); 
  const subscriptionItems = cartItems.filter((item) => item.subscription);
  const oneTimeServiceItems = cartItems.filter((item) => !item.subscription);
  const [checkoutCategory, setCheckoutCategory] = useState("oneTime");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("Token");
    if (storedToken) {
      setToken(storedToken);
      fetchCartItems(storedToken);
    }
  }, []);

  useEffect(() => {
    const allSubscription = cartItems.every((item) => item.subscription);
    const noneSubscription = cartItems.every((item) => !item.subscription);

    if (allSubscription) {
      setCheckoutCategory("subscription");
    } else if (noneSubscription) {
      setCheckoutCategory("oneTime");
    } else {
      setCheckoutCategory("oneTime");
    }
  }, [cartItems]);

  // Fetch cart items from the server
  const fetchCartItems = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: {
          token: `${token}`,
        },
      });
      const cartData = response.data.cart;
      dispatch(setCartItems(cartData));
      fetchAllProductDetails(cartData);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch product details for each item in the cart
  const fetchProductDetails = async (category, productId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/services/${category}/product/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Fetch all product details for items in the cart
  const fetchAllProductDetails = async (cartItems) => {
    const details = {};
    let total = 0;
    const addonsState = {};

    for (const item of cartItems) {
      const productDetail = await fetchProductDetails(
        item.category,
        item.productId
      );

      // Check if productDetail is valid
      if (productDetail) {
        details[item.productId] = productDetail;
        total += productDetail.price;

        if (item.addons && item.addons.length > 0) {
          addonsState[item.productId] = {};
          try {
            const addonDetailsResponse = await axios.get(
              `${API_BASE_URL}/services/${item.category}/${
                productDetail.name
              }/addons/${item.addons.join(",")}`
            );

            const addonDetails = addonDetailsResponse.data;
            addonDetails.forEach((addon) => {
              addonsState[item.productId][addon._id] = {
                name: addon.name,
                price: addon.price,
              };
            });
          } catch (error) {
            console.error("Error fetching addon details:", error);
          }
        } else {
          addonsState[item.productId] = {};
        }
      } else {
        console.warn(
          `Product with ID ${item.productId} not found. Skipping...`
        );
      }
    }
    setProductDetails(details);
    setSelectedAddons(addonsState);
  };

  // Handle item deletion from the cart
  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/remove`, {
        headers: {
          token: `${token}`,
        },
        data: { itemId },
      });
      dispatch(removeFromCart(itemId));
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  // Handle changes to selected addons
  const handleAddonChange = (productId, addonId, addonName, price, itemId) => {
    setSelectedAddons((previousSelectedAddons) => {
      const productAddons = { ...previousSelectedAddons[productId] };
      const uniqueKey = addonId;

      if (productAddons[uniqueKey]) {
        delete productAddons[uniqueKey];
      } else {
        productAddons[uniqueKey] = { name: addonName, price };
      }
      const updatedAddons = {
        ...previousSelectedAddons,
        [productId]: productAddons,
      };
      updateSelectedAddonsInCart(itemId, Object.keys(productAddons));

      return updatedAddons;
    });
  };

  // Update selected addons in the cart
  const updateSelectedAddonsInCart = async (itemId, addons) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/cart/update-addons`,
        {
          itemId,
          addons,
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      setSelectedAddons((previousSelectedAddons) => ({
        ...previousSelectedAddons,
        [itemId]: response.data.cart[itemId],
      }));
    } catch (error) {
      console.error("Error updating selected addons:", error);
    }
  };

  // Handle subscription status changes
  const handleSubscriptionChange = async (
    itemId,
    currentSubscriptionStatus
  ) => {
    const newSubscriptionStatus = !currentSubscriptionStatus; // Toggle the subscription status

    try {
      // Make the API call to update the subscription status in the backend
      await axios.put(
        `${API_BASE_URL}/cart/update-subscription`,
        {
          itemId,
          subscription: newSubscriptionStatus,
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );
      dispatch(
        updateSubscriptionStatus({
          itemId,
          subscription: newSubscriptionStatus,
        })
      );
      fetchCartItems(token);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  // Calculate total for additional services
  const additionalServicesTotal = () => {
    let total = 0;
    for (const item of cartItems) {
      const productAddons = selectedAddons[item.productId] || {};
      total += Object.values(productAddons).reduce(
        (acc, addon) => acc + addon.price,
        0
      );
    }
    return total;
  };

  // Calculate total for one-time services
  const oneTimeTotal = () => {
    return oneTimeServiceItems.reduce((acc, item) => {
      return acc + subTotal(item.productId);
    }, 0);
  };

  // Calculate total for subscription services
  const subscriptionTotal = () => {
    return subscriptionItems.reduce((acc, item) => {
      return acc + subTotal(item.productId);
    }, 0);
  };

  // Calculate subtotal for a specific product
  const subTotal = (productId) => {
    const productDetail = productDetails[productId]; // Get the product detail
    if (!productDetail) {
      return 0; // Return 0 if the product detail is not found
    }

    const basePrice = productDetail.price || 0; // Fallback to 0 if price is undefined
    const additionalServicesTotal = Object.values(
      selectedAddons[productId] || {}
    ).reduce((acc, addon) => acc + (addon.price || 0), 0);

    return basePrice + additionalServicesTotal;
  };

  // Handle checkout process
  const handleCheckout = () => {
    let itemsToCheckout = [];
    let totalPrice = 0;
    let subscription = "false";

    if (checkoutCategory === "oneTime") {
      itemsToCheckout = oneTimeServiceItems.map((item) => ({
        ...item,
        name: productDetails[item.productId].name,
        subtotal: subTotal(item.productId),
        addons: Object.keys(selectedAddons[item.productId] || {}).map(
          (addonId) => ({
            id: addonId,
            name: selectedAddons[item.productId][addonId].name,
            price: selectedAddons[item.productId][addonId].price,
          })
        ),
      }));
      (subscription = "false"), (totalPrice = oneTimeTotal());
    } else {
      itemsToCheckout = subscriptionItems.map((item) => ({
        ...item,
        name: productDetails[item.productId].name,
        subtotal: subTotal(item.productId),
        addons: Object.keys(selectedAddons[item.productId] || {}).map(
          (addonId) => ({
            id: addonId,
            name: selectedAddons[item.productId][addonId].name,
            price: selectedAddons[item.productId][addonId].price,
          })
        ),
      }));
      (subscription = "true"), (totalPrice = subscriptionTotal());
    }

    const checkoutData = {
      items: itemsToCheckout,
      totalPrice: totalPrice,
      productDetails: productDetails,
      subscription: subscription,
      source: "cart",
    };

    dispatch(setCheckoutData(checkoutData));
    navigate("/checkout");
  };

  // Calculate base price for one-time services
  const oneTimeBasePrice = () => {
    return oneTimeServiceItems.reduce((acc, item) => {
      const productDetail = productDetails[item.productId];
      return acc + (productDetail ? productDetail.price : 0);
    }, 0);
  };

  // Check if any addons are selected
  const hasSelectedAddons = () => {
    return Object.keys(selectedAddons).some(
      (productId) =>
        selectedAddons[productId] &&
        Object.keys(selectedAddons[productId]).length > 0
    );
  };

  // Count selected services
  const countSelectedServices = (items) => {
    return items.length;
  };

  // Count one-time services
  const oneTimeServiceCount = () => {
    return countSelectedServices(oneTimeServiceItems);
  };

  // Count subscription services
  const subscriptionServiceCount = () => {
    return countSelectedServices(subscriptionItems);
  };

  return (
    <>
      <section className="py-8 min-h-screen antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto top-20 max-w-screen-xl p-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-500  sm:text-2xl">
            Shopping Cart{" "}
            {cartItems.length > 0 ? `: (${cartItems.length})` : ""}
          </h2>
          {loading ? ( // Loading state
            <div className="flex justify-center items-center h-full">
           <div className="text-center">
                     <Spinner size="xl" aria-label="Center-aligned spinner example" />
                     <p className="mt-4 font-normal dark:text-slate-300 text-black">
                       Please wait
                     </p>
                   </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className=" flex-col mt-20 text-4xl justify-center items-center text-center text-gray-600 dark:text-gray-400">
              <img className="max-w-96 mx-auto" src="/Empty.svg" />
              Your cart is empty
              <div className="flex items-center justify-center mt-10 gap-2">
                <Link
                  to="/services"
                  className="inline-flex  items-center gap-2 text-xl font-medium text-primary-700  hover:underline dark:text-primary-500"
                >
                  <FaShoppingBag /> Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
              <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl">
                <div className="space-y-6">
                  {/* Monthly Subscription Section */}
                  {subscriptionItems.length > 0 && (
                    <>
                      <h3 className="text-3xl font-semibold text-center text-green-400 mb-5 border border-slate-500 rounded-lg  p-3">
                        Monthly Subscription
                      </h3>
                      {subscriptionItems.map((item) => (
                        <div key={item._id}>
                          {productDetails[item.productId] && (
                            <Card>
                              <div className="space-y-4 md:flex md:items-center justify-between md:gap-6 md:space-y-0">
                                <Link
                                  to={`/services/${item.category}/${
                                    productDetails[item.productId].name
                                  }`}
                                  className="w-48 md:order-1"
                                >
                                  <img
                                    className=" w-full h-48 object-cover transition-transform duration-300 ease-in-out transform rounded-xl "
                                    src={
                                      productDetails[item.productId].productImg
                                    }
                                    alt={productDetails[item.productId].name}
                                  />
                                </Link>

                                <div className="flex items-center  justify-end md:order-3 md:justify-end">
                                  <div className="text-end md:order-4 ">
                                    <p className="text-3xl text-end font-bold text-gray-900 dark:text-white">
                                      ₹&nbsp;
                                      {productDetails[item.productId].price}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
                                  <Link
                                    to={`/services/${item.category}/${
                                      productDetails[item.productId].name
                                    }`}
                                    className="text-2xl font-semibold text-gray-900  dark:text-white"
                                  >
                                    {productDetails[item.productId].name}
                                  </Link>
                                  <div className="flex items-center gap-4">
                                    <h2 className="font-semibold text-md ml-2">
                                      Service Type :
                                    </h2>
                                    <p className="text-md text-gray-600 dark:text-gray-400">
                                      {productDetails[item.productId].category}
                                    </p>
                                  </div>
                                  <div className="w-full">
                                    {Object.keys(
                                      selectedAddons[item.productId] || {}
                                    ).length > 0 && (
                                      <div className="mt-2">
                                        <h3 className=" ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                                          Selected Addons:
                                        </h3>
                                        {Object.keys(
                                          selectedAddons[item.productId]
                                        ).map((key) => {
                                          const addon =
                                            selectedAddons[item.productId][key];
                                          return (
                                            <div
                                              key={key}
                                              className="flex justify-between ml-3 mt-2"
                                            >
                                              <span className="text-gray-700 dark:text-gray-400">
                                                {addon.name}
                                              </span>
                                              <span className="text-gray-700 dark:text-gray-400">
                                                ₹&nbsp;{addon.price}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                    {!item.subscription ? (
                                      <Accordion
                                        collapseAll
                                        className="border-0 "
                                      >
                                        <Accordion.Panel className="bg-gray-800">
                                          <Accordion.Title>
                                            Additional Services
                                          </Accordion.Title>
                                          <Accordion.Content className="dark:bg-gray-800">
                                            {productDetails[
                                              item.productId
                                            ].addons.map((addon, index) => (
                                              <div
                                                key={index}
                                                className="flex flex-col mb-4"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-4">
                                                    <Checkbox
                                                      id={`addon-${item.productId}-${addon._id}`}
                                                      name="addons"
                                                      value={addon.name}
                                                      onChange={() =>
                                                        handleAddonChange(
                                                          item.productId,
                                                          addon._id,
                                                          addon.name,
                                                          addon.price,
                                                          item._id
                                                        )
                                                      }
                                                      className="cursor-pointer"
                                                      checked={
                                                        !!selectedAddons[
                                                          item.productId
                                                        ]?.[addon._id]
                                                      }
                                                    />
                                                    <Label
                                                      htmlFor={`addon-${item.productId}-${addon._id}`}
                                                      className="text-lg font-medium cursor-pointer text-gray-900 dark:text-white"
                                                    >
                                                      {addon.name}
                                                    </Label>
                                                  </div>
                                                  <span className="text-lg text-gray-700 dark:text-gray-400 whitespace-nowrap">
                                                    ₹&nbsp;{addon.price}
                                                  </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                  {addon.description}
                                                </p>
                                              </div>
                                            ))}
                                          </Accordion.Content>
                                        </Accordion.Panel>
                                      </Accordion>
                                    ) : (
                                      <div>
                                        <p className="text-md text-gray-600 dark:text-gray-400">
                                          <span className="font-semibold text-lg text-green-500">
                                            {" "}
                                            Benefits :{" "}
                                          </span>
                                          All the addons for this service are
                                          complementary for subscription.
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-end">
                                    <Button
                                      color=""
                                      type="button"
                                      onClick={() => handleDelete(item._id)}
                                      className="inline-flex gap-2 items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                    >
                                      <div className="flex items-center text-xl">
                                        <HiTrash />
                                      </div>
                                      <div className="ml-2 text-xl">Remove</div>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {productDetails[item.productId].subscription && (
                                <div className="flex items-center justify-end gap-2">
                                  <Checkbox
                                    id={`subscription-checkbox-${item._id}`}
                                    className="cursor-pointer"
                                    checked={
                                      cartItems.find(
                                        (cartItem) => cartItem._id === item._id
                                      )?.subscription || false
                                    }
                                    onChange={() =>
                                      handleSubscriptionChange(
                                        item._id,
                                        cartItems.find(
                                          (cartItem) =>
                                            cartItem._id === item._id
                                        )?.subscription || false
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`subscription-checkbox-${item._id}`}
                                    className="text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    Add to Monthly Subscription
                                  </Label>
                                </div>
                              )}

                              <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                                <div className="wrap text-center">
                                  <p className="text-xl font-bold  text-gray-900 dark:text-white">
                                    Subtotal
                                  </p>
                                  <span className="text-base font-normal text-gray-500 dark:text-gray-400 ">
                                    (Base price + Addition Services)
                                  </span>
                                </div>

                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                  ₹&nbsp;{subTotal(item.productId).toFixed(2)}
                                </p>
                              </div>
                            </Card>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {/* One-Time Services Section */}
                  {oneTimeServiceItems.length > 0 && (
                    <>
                      <h3 className="text-3xl font-semibold text-center text-green-400 mb-3 border border-slate-500 rounded-lg  p-3 mt-4">
                        One-Time Services
                      </h3>

                      {oneTimeServiceItems.map((item) => (
                        <div key={item._id}>
                          {productDetails[item.productId] && (
                            <Card>
                              <div className="space-y-4 md:flex md:items-center justify-between md:gap-6 md:space-y-0">
                                <Link
                                  to={`/services/${item.category}/${
                                    productDetails[item.productId].name
                                  }`}
                                  className="w-48 md:order-1"
                                >
                                  <img
                                    className=" w-full h-48 object-cover transition-transform duration-300 ease-in-out transform rounded-xl "
                                    src={
                                      productDetails[item.productId].productImg
                                    }
                                    alt={productDetails[item.productId].name}
                                  />
                                </Link>

                                <div className="flex items-center  justify-end md:order-3 md:justify-end">
                                  <div className="text-end md:order-4 ">
                                    <p className="text-3xl text-end font-bold text-gray-900 dark:text-white">
                                      ₹&nbsp;
                                      {productDetails[item.productId].price}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
                                  <Link
                                    to={`/services/${item.category}/${
                                      productDetails[item.productId].name
                                    }`}
                                    className="text-2xl font-semibold text-gray-900  dark:text-white"
                                  >
                                    {productDetails[item.productId].name}
                                  </Link>
                                  <div className="flex items-center gap-4">
                                    <h2 className="font-semibold text-md ml-2">
                                      Service Type :
                                    </h2>
                                    <p className="text-md text-gray-600 dark:text-gray-400">
                                      {productDetails[item.productId].category}
                                    </p>
                                  </div>
                                  <div className="w-full">
                                    {Object.keys(
                                      selectedAddons[item.productId] || {}
                                    ).length > 0 && (
                                      <div className="mt-2">
                                        <h3 className=" ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                                          Selected Addons:
                                        </h3>
                                        {Object.keys(
                                          selectedAddons[item.productId]
                                        ).map((key) => {
                                          const addon =
                                            selectedAddons[item.productId][key];
                                          return (
                                            <div
                                              key={key}
                                              className="flex justify-between ml-3 mt-2"
                                            >
                                              <span className="text-gray-700 dark:text-gray-400">
                                                {addon.name}
                                              </span>
                                              <span className="text-gray-700 dark:text-gray-400">
                                                ₹&nbsp;{addon.price}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                    {!item.subscription ? (
                                      <Accordion
                                        collapseAll
                                        className="border-0 "
                                      >
                                        <Accordion.Panel className="bg-gray-800">
                                          <Accordion.Title>
                                            Additional Services
                                          </Accordion.Title>
                                          <Accordion.Content className="dark:bg-gray-800">
                                            {productDetails[
                                              item.productId
                                            ].addons.map((addon, index) => (
                                              <div
                                                key={index}
                                                className="flex flex-col mb-4"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-4">
                                                    <Checkbox
                                                      id={`addon-${item.productId}-${addon._id}`}
                                                      name="addons"
                                                      value={addon.name}
                                                      onChange={() =>
                                                        handleAddonChange(
                                                          item.productId,
                                                          addon._id,
                                                          addon.name,
                                                          addon.price,
                                                          item._id
                                                        )
                                                      }
                                                      className="cursor-pointer"
                                                      checked={
                                                        !!selectedAddons[
                                                          item.productId
                                                        ]?.[addon._id]
                                                      }
                                                    />
                                                    <Label
                                                      htmlFor={`addon-${item.productId}-${addon._id}`}
                                                      className="text-lg font-medium cursor-pointer text-gray-900 dark:text-white"
                                                    >
                                                      {addon.name}
                                                    </Label>
                                                  </div>
                                                  <span className="text-lg text-gray-700 dark:text-gray-400 whitespace-nowrap">
                                                    ₹&nbsp;{addon.price}
                                                  </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                  {addon.description}
                                                </p>
                                              </div>
                                            ))}
                                          </Accordion.Content>
                                        </Accordion.Panel>
                                      </Accordion>
                                    ) : (
                                      <div>
                                        <p className="text-md text-gray-600 dark:text-gray-400">
                                          <span className="font-semibold text-lg text-green-500">
                                            {" "}
                                            Benefits :{" "}
                                          </span>
                                          All the addons for this service are
                                          complementary for subscription.
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-end">
                                    <Button
                                      color=""
                                      type="button"
                                      onClick={() => handleDelete(item._id)}
                                      className="inline-flex gap-2 items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                    >
                                      <div className="flex items-center text-xl">
                                        <HiTrash />
                                      </div>
                                      <div className="ml-2 text-xl">Remove</div>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {productDetails[item.productId].subscription && (
                                <div className="flex items-center justify-end gap-2">
                                  <Checkbox
                                    id={`subscription-checkbox-${item._id}`}
                                    className="cursor-pointer"
                                    checked={
                                      cartItems.find(
                                        (cartItem) => cartItem._id === item._id
                                      )?.subscription || false
                                    }
                                    onChange={() =>
                                      handleSubscriptionChange(
                                        item._id,
                                        cartItems.find(
                                          (cartItem) =>
                                            cartItem._id === item._id
                                        )?.subscription || false
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`subscription-checkbox-${item._id}`}
                                    className="text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    Add to Monthly Subscription
                                  </Label>
                                </div>
                              )}

                              <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                                <div className="wrap text-center">
                                  <p className="text-xl font-bold  text-gray-900 dark:text-white">
                                    Subtotal
                                  </p>
                                  <span className="text-base font-normal text-gray-500 dark:text-gray-400 ">
                                    (Base price + Addition Services)
                                  </span>
                                </div>

                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                  ₹&nbsp;{subTotal(item.productId).toFixed(2)}
                                </p>
                              </div>
                            </Card>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:pt-5 lg:w-full lg:sticky lg:top-20  lg:self-start">
                <Card className="space-y-4 rounded-xl border border-gray-700 bg-gray-50 p-4 shadow-sm dark:border-gray-400 dark:bg-gray-800 sm:p-0 ">
                  <p className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                    Order summary
                  </p>
                  {oneTimeServiceItems.length > 0 &&
                    subscriptionItems.length > 0 && (
                      <div className="flex  justify-center lg:justify-between lg:px-3 ">
                        <div className="flex items-center mr-4 lg:mr-1">
                          <Radio
                            id="one-time-service"
                            name="serviceType"
                            value="oneTime"
                            checked={checkoutCategory === "oneTime"}
                            onChange={() => setCheckoutCategory("oneTime")}
                            className="cursor-pointer"
                          />
                          <Label
                            htmlFor="one-time-service"
                            className="ml-2 cursor-pointer "
                          >
                            <span
                              className={`ml-2 text-base  cursor-pointer flex items-center justify-center  ${
                                checkoutCategory === "oneTime"
                                  ? "text-green-500"
                                  : ""
                              }`}
                            >
                              Single Service
                            </span>
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Radio
                            id="subscription"
                            name="serviceType"
                            value="subscription"
                            checked={checkoutCategory === "subscription"}
                            onChange={() => setCheckoutCategory("subscription")}
                            className="cursor-pointer"
                          />
                          <Label
                            htmlFor="subscription"
                            className="ml-2 cursor-pointer"
                          >
                            <span
                              className={`ml-2 text-base cursor-pointer flex items-center justify-center ${
                                checkoutCategory === "subscription"
                                  ? "text-green-500"
                                  : ""
                              }`}
                            >
                              Subscription
                            </span>
                          </Label>
                        </div>
                      </div>
                    )}
                  <div className="space-y-4">
                    {checkoutCategory === "oneTime" &&
                      oneTimeServiceItems.length > 0 && (
                        <>
                          <div className="flex justify-center gap-1">
                            <span className="text-md font-normal text-gray-500 dark:text-gray-400">
                              One-Time Services
                            </span>
                            {oneTimeServiceItems.length > 0 &&
                              subscriptionItems.length > 0 && (
                                <span className="text-md font-normal text-gray-500 dark:text-gray-400">
                                  ( {oneTimeServiceCount()} )
                                </span>
                              )}
                          </div>
                          <div className="flex justify-between">
                            <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                              Base Price
                            </p>
                            <p className="text-md font-medium text-gray-900 dark:text-white">
                              ₹&nbsp;{oneTimeBasePrice().toFixed(2)}
                            </p>
                          </div>
                          {hasSelectedAddons() && (
                            <div className="flex justify-between">
                              <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                                Additional Services
                              </p>
                              <p className="text-md font-medium text-gray-900 dark:text-white">
                                ₹&nbsp;{additionalServicesTotal().toFixed(2)}
                              </p>
                            </div>
                          )}
                          <div className="mt-4 text-sm font-normal text-red-600 flex items-center">
                            <span className="mr-2 text-xl">*</span>
                            <p>
                              Final pricing may vary based on room/area size,
                              etc.
                            </p>
                          </div>
                        </>
                      )}
                    {checkoutCategory === "subscription" &&
                      subscriptionItems.length > 0 && (
                        <>
                          <div className="flex justify-center gap-1">
                            <span className="text-md font-normal text-gray-500 dark:text-gray-400">
                              Monthly Subscription
                            </span>
                            {subscriptionItems.length > 0 &&
                              oneTimeServiceItems.length > 0 && (
                                <span className="text-md font-normal text-gray-500 dark:text-gray-400">
                                  ( {subscriptionServiceCount()} )
                                </span>
                              )}
                          </div>
                          <div className="flex justify-between border border-gray-400 pt-3 dark:border-gray-700 p-3">
                            <p className="text-md font-normal text-red-600 ">
                              * All the Additional Services for these services
                              are complementary.
                            </p>
                          </div>
                        </>
                      )}
                    <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        Total
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹&nbsp;
                        {checkoutCategory === "oneTime"
                          ? oneTimeTotal().toFixed(2)
                          : subscriptionTotal().toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Button
                      className="flex w-full items-center gap-2 justify-center align-center p-0.5"
                      outline
                      gradientDuoTone="cyanToBlue"
                      type="submit"
                      onClick={handleCheckout}
                    >
                      <div className="text-md flex text-center align-center items-center">
                        Proceed to Checkout
                      </div>
                      <div className="flex text-center align-center items-center">
                        <IoBagCheckOutline className="ml-3 text-2xl" />
                      </div>
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                    >
                      <FaShoppingBag /> Continue Shopping
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;
