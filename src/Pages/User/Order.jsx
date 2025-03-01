// src/Pages/Order.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Dropdown,
  Label,
  Modal,
  Textarea,
  Badge,
  Spinner,
} from "flowbite-react";
import { clearNewOrder } from "../../Redux/Slice/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { TiStar } from "react-icons/ti";
import { FaBell } from "react-icons/fa";
import API_BASE_URL from "../../apiConfig";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearNewOrder());
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/order/orders`, {
          headers: {
            token: localStorage.getItem("Token"),
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Set up polling to fetch orders every 45 seconds
    const intervalId = setInterval(fetchOrders, 45000); 

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleRateClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleSubmitRating = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/review`,
        {
          category: selectedItem.category,
          productId: selectedItem.productId,
          itemId: selectedItem._id,
          rating,
          feedback,
        },
        {
          headers: {
            token: localStorage.getItem("Token"),
          },
        }
      );
      console.log("Rating submitted:", response.data);

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          return {
            ...order,
            items: order.items.map((item) => {
              if (item._id === selectedItem._id) {
                return { ...item, reviewed: true }; // Mark the item as reviewed
              }
              return item;
            }),
          };
        })
      );

      setRating(0);
      setFeedback("");
      setModalOpen(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const getFullAddress = (addressId) => {
    const address = currentuser.rest.addresses.find(
      (addr) => addr._id === addressId
    );
    if (address) {
      return (
        <>
          <div className="font-semibold text-gray-800 dark:text-gray-300">
            {address.fullName}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {address.doorNumber}, {address.streetName},
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {address.area}, {address.city}, {address.state} - {address.pinCode}.
          </div>
        </>
      );
    }
    return <span className="text-red-500">Address not found</span>;
  };

  const convertTime = (time) => {
    const [hourMin, period] = time.split(" ");
    let [hour, minute] = hourMin.split(":");

    if (period === "AM" && hour === "12") {
      hour = "00";
    } else if (period === "PM" && hour !== "12") {
      hour = (parseInt(hour) + 12).toString();
    }

    return `${hour}:${minute}`;
  };

  const convertDate = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const combineDateAndTime = (serviceDate, serviceTime) => {
    if (!serviceDate || !serviceTime) return new Date(NaN);

    const isoDate = serviceDate.trim();
    const isoTime = convertTime(serviceTime.trim());

    const dateTimeString = `${isoDate}T${isoTime}`;
    const dateTime = new Date(dateTimeString);

    // Log the dateTime for debugging

    return dateTime;
  };

  const filteredOrders = () => {
    const currentDate = new Date();

    return orders
      .map((order) => {
        const completedItems = order.items.filter(
          (item) => item.status === "Completed"
        );

        const upcomingItems = order.items.filter(
          (item) => item.status === "upcoming"
        );

        const onProcessItems = order.items.filter(
          (item) => item.status === "On process"
        );

        const subscriptionItems = order.items.filter(
          (item) => item.subscription === true
        );
        const oneTimeItems = order.items.filter(
          (item) => item.subscription === false
        );

        // Return the order based on the active tab
        if (activeTab === "All") return order;
        if (activeTab === "Completed services" && completedItems.length > 0)
          return { ...order, items: completedItems };
        if (activeTab === "Upcoming services" && upcomingItems.length > 0)
          return { ...order, items: upcomingItems };
        if (activeTab === "On process" && onProcessItems.length > 0)
          return { ...order, items: onProcessItems };
        if (activeTab === "Subscription" && subscriptionItems.length > 0)
          return { ...order, items: subscriptionItems };
        if (activeTab === "One-time" && oneTimeItems.length > 0)
          return { ...order, items: oneTimeItems };

        return null;
      })
      .filter(Boolean); // Filter out null orders
  };

  const handleReminderClick = async (item, orderId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/order/toggle-reminder`,
        {
          orderId: orderId, // Pass the order ID
          itemId: item._id, // Pass the item ID
        },
        {
          headers: {
            token: localStorage.getItem("Token"),
          },
        }
      );

      console.log("Reminder updated:", response.data);
      // Update the orders state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          return {
            ...order,
            items: order.items.map((orderItem) => {
              if (orderItem._id === item._id) {
                return { ...orderItem, reminder: !orderItem.reminder }; // Toggle the reminder
              }
              return orderItem;
            }),
          };
        })
      );
    } catch (error) {
      console.error("Error toggling reminder:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-500 ">
        Your Orders
      </h1>
      {loading ? ( // Loading state
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <Spinner size="xl" aria-label="Center-aligned spinner example" />
            <p className="mt-4 font-normal dark:text-slate-300 text-black">
              Please wait while we fetch your orders...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end mr-5 mb-5 md:hidden">
            <Dropdown label={activeTab} inline>
              {[
                "All",
                "Subscription",
                "One-time",
                "Upcoming services",
                "On process",
                "Completed services",
              ].map((tab) => (
                <Dropdown.Item key={tab} onClick={() => setActiveTab(tab)}>
                  {tab}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
          <div className="hidden md:flex justify-center mb-4 items-center">
            {[
              "All",
              "Subscription",
              "One-time",
              "Upcoming services",
              "On process",
              "Completed services",
            ].map((tab) => (
              <Button
                key={tab}
                color={activeTab === tab ? "success" : "gray"}
                onClick={() => setActiveTab(tab)}
                className="mx-2"
                pill
                size="xs"
              >
                {tab}
              </Button>
            ))}
          </div>
          <div className="grid gap-6">
            {filteredOrders().length > 0 ? ( // Check if there are filtered orders
              filteredOrders().map((order) => (
                <Card
                  key={order.sessionId}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-black dark:text-white">
                          Placed on:
                        </span>{" "}
                        <span className="inline-block">
                          {format(new Date(order.createdAt), "dd-MM-yyyy")}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-xs sm:text-sm font-semibold text-black dark:text-white">
                          Service Type:
                        </span>{" "}
                        <span className="inline-block text-xs sm:text-sm">
                          {order.subscription
                            ? "Monthly Subscription"
                            : "Single Service"}
                        </span>
                      </p>
                      {order.subscription && (
                        <Badge
                          className="mt-2 text-xs sm:text-sm text-center flex justify-center items-center rounded-lg"
                          color="info"
                        >
                          Subscription
                        </Badge>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Order No: #{order.orderNo}
                      </p>
                      <a
                        href={order.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400 text-xs sm:text-sm whitespace-nowrap"
                      >
                        View Receipt
                      </a>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-md font-medium mt-2 text-gray-800 dark:text-gray-200">
                      Ordered Services:{" "}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items.length}
                      </span>
                    </h4>
                    {order.items.map((item, index) => {
                      const serviceDateTime =
                        item.subscription && item.lastServiceDate
                          ? combineDateAndTime(
                              item.lastServiceDate,
                              item.serviceTime
                            )
                          : combineDateAndTime(
                              item.serviceDate,
                              item.serviceTime
                            );
                      const currentTime = new Date();
                      const twoHoursLater = new Date(
                        serviceDateTime.getTime() + 2 * 60 * 60 * 1000
                      );
                      let slotLabel = "Slot: ";
                      if (item.subscription) {
                        slotLabel =
                          currentTime >= serviceDateTime &&
                          currentTime <= twoHoursLater
                            ? "Current Slot: "
                            : "Next Slot: ";
                      }
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 py-2"
                        >
                          <div className="flex items-center">
                            <Link
                              to={`/services/${item.category}/${item.name}`}
                            >
                              <img
                                src={item.productImg}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg shadow hidden sm:inline"
                              />
                            </Link>
                            <div className="ml-4">
                              <Link
                                to={`/services/${item.category}/${item.name}`}
                              >
                                <h2 className="font-semibold text-green-500 dark:text-green-400">
                                  {item.name}
                                </h2>
                              </Link>
                              {item.addons.length > 0 && (
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  <span className="font-semibold text-black dark:text-white">
                                    {" "}
                                    Addons:{" "}
                                  </span>
                                  {item.addons
                                    .map((addon) => addon.name)
                                    .join(", ")}
                                </p>
                              )}
                              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 items-center mt-2">
                                <span className="font-semibold text-black dark:text-white mr-1">
                                  Service Address:
                                </span>
                                <span className="p-1">
                                  {getFullAddress(item.serviceAddressId)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">
                              ₹{item.price}
                            </p>
                            <p className="text-xs sm:text-sm dark:text-gray-400">
                              <span className="font-semibold text-black whitespace-nowrap dark:text-white mr-1">
                                Status:
                              </span>
                              <span
                                className={`inline-block font-medium ${
                                  item.status === "Completed"
                                    ? "text-green-500"
                                    : item.status === "On process"
                                    ? "text-orange-400"
                                    : item.status === "upcoming"
                                    ? "text-yellow-500 dark:text-yellow-300"
                                    : "text-gray-500"
                                }`}
                              >
                                {item.status}
                              </span>
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <span className="font-semibold text-black dark:text-white">
                                {slotLabel}
                              </span>
                              <span className="inline-block font-medium">
                                {convertDate(item.serviceDate)}
                              </span>{" "}
                              at{" "}
                              <span className="block font-medium">
                                {item.serviceTime}
                              </span>
                            </p>

                            {new Date() >
                              new Date(
                                serviceDateTime.getTime() + 2 * 60 * 60 * 1000
                              ) &&
                              !item.reviewed && (
                                <Button
                                  color="gray"
                                  pill
                                  className="mt-2 w-full mb-2 hidden sm:flex"
                                  size="sm"
                                  onClick={() => handleRateClick(item)}
                                >
                                  <span className="text-yellow-500 dark:text-yellow-300">
                                    {item.subscription && item.lastServiceDate
                                      ? "Rate last service"
                                      : "Rate this service"}
                                  </span>
                                </Button>
                              )}
                            {new Date() >
                              new Date(
                                serviceDateTime.getTime() + 2 * 60 * 60 * 1000
                              ) &&
                              !item.reviewed && (
                                <Button
                                  color="gray"
                                  pill
                                  className="mt-2 w-full mb-2 sm:hidden"
                                  size="xs"
                                  onClick={() => handleRateClick(item)}
                                >
                                  <span className="text-yellow-500 dark:text-yellow-300">
                                    {item.subscription && item.lastServiceDate
                                      ? "Rate last service"
                                      : "Rate this service"}
                                  </span>
                                </Button>
                              )}

                            {item.reviewed && (
                              <p className="text-green-500 text-xs sm:text-sm font-semibold mt-2">
                                Thank you for your feedback!
                              </p>
                            )}
                            {item.status === "upcoming" &&
                              (() => {
                                const serviceDateTime = combineDateAndTime(
                                  item.serviceDate,
                                  item.serviceTime
                                );
                                const currentTime = new Date();
                                const twoHoursBeforeService = new Date(
                                  serviceDateTime.getTime() - 2 * 60 * 60 * 1000
                                );

                                if (currentTime < twoHoursBeforeService) {
                                  return (
                                    <span
                                      className="cursor-pointer flex items-center mt-10 text-center justify-center text-sm font-semibold"
                                      onClick={() =>
                                        handleReminderClick(item, order._id)
                                      }
                                    >
                                      <FaBell
                                        className={`mr-1 ${
                                          item.reminder
                                            ? "text-yellow-400"
                                            : "text-gray-500"
                                        }`}
                                      />
                                      <span
                                        className={`text-xs sm:text-sm ${
                                          item.reminder
                                            ? "text-yellow-500"
                                            : "text-red-400"
                                        }`}
                                      >
                                        {item.reminder
                                          ? "Turn off Reminder"
                                          : "Remind me"}
                                      </span>
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-4 text-end">
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Amount Paid: ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <>
                <img
                  className="max-w-96 mx-auto"
                  src="/clean.svg"
                  alt="No orders"
                />
                <p className="text-gray-500 text-center mt-10">
                  No orders found.
                </p>
              </>
            )}
          </div>
        </>
      )}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Rate Your Service:</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col">
            <div className="mb-4">
              <span className="font-semibold dark:text-white">
                Rating: ({selectedItem?.name})
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Label
                    key={star}
                    className="cursor-pointer flex items-center p-2"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      onChange={() => setRating(star)}
                      className="hidden"
                    />
                    <span
                      onMouseEnter={() => setHoveredRating(star)} 
                      onMouseLeave={() => setHoveredRating(0)} 
                      className={`text-3xl transition-colors duration-200 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      <TiStar />
                    </span>
                  </Label>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold dark:text-white">Feedback:</span>
              <Textarea
                placeholder="Write your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                {feedback.length}/200 characters
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex ml-auto gap-2">
            <Button onClick={handleSubmitRating}>Submit</Button>
            <Button color="gray" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
