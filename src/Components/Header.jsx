import {
  Avatar,
  Button,
  Drawer,
  Sidebar,
  Dropdown,
  DropdownDivider,
  Navbar,
  Badge,
  Tooltip,
  Banner,
  Modal,
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaUser,
  FaHome,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toggleTheme } from "../Redux/Slice/themeSlice";
import { signOutSucess } from "../Redux/Slice/userSlice";
import { HiMenu } from "react-icons/hi";
import {
  MdCleaningServices,
  MdNotificationsActive,
  MdShoppingCart,
} from "react-icons/md";
import { clearCart, setCartItems } from "../Redux/Slice/cartSlice";
import axios from "axios";
import { HiMiniBellAlert } from "react-icons/hi2";
import { HiChartPie, HiUser } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { MdReviews, MdBusiness } from "react-icons/md";
import { FaQuestion } from "react-icons/fa6";
import API_BASE_URL from "../apiConfig";

const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentuser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const cartItems = useSelector((state) => state.cart.items);
  const { hasNewOrder } = useSelector((state) => state.order);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessages, setModalMessages] = useState([]);
  const [reminderData, setReminderData] = useState([]);

  // Handle user sign out
  const handleSignOut = () => {
    dispatch(signOutSucess());
    dispatch(clearCart());
    localStorage.removeItem("Token");
    navigate("/signin");
  };
  // Close handlers for various UI elements
  const handleClose = () => setIsOpen(false);
  const handleNotificationClose = () => setIsNotificationOpen(false);

  // Fetch cart items from the server
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("Token");
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/cart`, {
            headers: { token },
          });
          const cartData = response.data.cart;
          dispatch(setCartItems(cartData));
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };

    if (currentuser) {
      fetchCartItems();
    }
  }, [currentuser, dispatch]);

  // Convert 12-hour format to 24-hour format
  const convertTimeTo24Hour = (time) => {
    const [hourMin, period] = time.split(" ");
    let [hour, minute] = hourMin.split(":");

    if (period === "AM" && hour === "12") {
      hour = "00"; // Convert 12 AM to 00
    } else if (period === "PM" && hour !== "12") {
      hour = (parseInt(hour) + 12).toString(); // Convert PM hours to 24-hour format
    }

    return `${hour}:${minute}`;
  };

  // Fetch orders and notifications
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("Token");
      if (token) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/order/orders`,
            {
              headers: { token },
            }
          );
          const orders = response.data;
          const currentDate = new Date();
          const newNotifications = [];
          const newModalMessages = [];
          const newReminderData = [];

          orders.forEach((order) => {
            order.items.forEach((item) => {
              // Convert service time to 24-hour format
              const serviceTime24 = convertTimeTo24Hour(item.serviceTime);
              // Combine service date and time
              const serviceDateTime = new Date(
                `${item.serviceDate}T${serviceTime24}`
              );
              const notificationTime = new Date(
                serviceDateTime.getTime() - 2 * 60 * 60 * 1000
              ); // 2 hours before

              // Check if the current date is the same as the service date
              const serviceDate = new Date(item.serviceDate);
              const isSameDate =
                currentDate.getFullYear() === serviceDate.getFullYear() &&
                currentDate.getMonth() === serviceDate.getMonth() &&
                currentDate.getDate() === serviceDate.getDate();

              // Notification logic
              if (isSameDate) {
                if (
                  currentDate >= notificationTime &&
                  currentDate < serviceDateTime
                ) {
                  newNotifications.push({
                    itemId: item._id,
                    orderId: order._id,
                    message: (
                      <span>
                        Your service for{" "}
                        <span className="text-green-500 font-semibold">
                          {item.name}
                        </span>{" "}
                        is scheduled at{" "}
                        <span className="text-blue-500 font-semibold">
                          {item.serviceTime}
                        </span>{" "}
                        Today.
                      </span>
                    ),
                    time: notificationTime,
                    status: "upcoming", // Track status
                  });
                  console.log(newNotifications);

                  if (item.reminder) {
                    // Push message to the array
                    newModalMessages.push(
                      <span>
                        Your service for{" "}
                        <span className="text-green-500 font-semibold">
                          {item.name}
                        </span>{" "}
                        is scheduled at{" "}
                        <span className="text-blue-500 font-semibold">
                          {item.serviceTime}{" "}
                        </span>
                        Today.
                      </span>
                    );
                    newReminderData.push({
                      orderId: order._id,
                      itemId: item._id,
                    });
                  }
                } else if (
                  currentDate >= serviceDateTime &&
                  currentDate <
                    new Date(serviceDateTime.getTime() + 2 * 60 * 60 * 1000)
                ) {
                  // Service is in process
                  newNotifications.push({
                    itemId: item._id,
                    orderId: order._id,
                    message: (
                      <span>
                        Your service for{" "}
                        <span className="text-green-500 font-semibold">
                          {item.name}
                        </span>{" "}
                        has started.
                      </span>
                    ),
                    time: serviceDateTime,
                    status: "in process", // Track status
                  });
                }
              }
            });
          });

          setNotifications(newNotifications);
          if (newModalMessages.length > 0) {
            setModalMessages(newModalMessages);
            setIsModalOpen(true); // Open the modal
          }
          setReminderData(newReminderData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    };

    if (currentuser) {
      fetchOrders();
    }

    // Set an interval to check notifications every minute
    const interval = setInterval(() => {
      fetchOrders(); // Re-fetch orders to update notifications
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentuser]);

  // Toggle reminder for a service
  const toggleReminder = async (orderId, itemId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}order/toggle-reminder`,
        {
          orderId,
          itemId,
        },
        {
          headers: {
            token: localStorage.getItem("Token"),
          },
        }
      );
      console.log("Reminder updated:", response.data);
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  // Close modal and handle reminders
  const handleCloseModal = () => {
    if (reminderData.length > 0) {
      reminderData.forEach(({ orderId, itemId }) => {
        toggleReminder(orderId, itemId);
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="pt-16 sm:pt-20">
      <Navbar className="fixed top-0 left-0 right-0 z-30 md:border-b-2 flex flex-wrap md:flex-nowrap min-w-[290px] bg-slate-200">
        <div className="flex flex-shrink-0">
          <Button
            className="w-10 h-10 md:hidden inline-flex justify-center items-center"
            gradientDuoTone="none"
            onClick={() => setIsOpen(true)}
          >
            <HiMenu className="text-3xl" />
          </Button>

          <Navbar.Brand
            href="/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <img
              src="/dust.png"
              className="h-10 sm:h-14"
              alt="CleanEase Logo"
            />
            <span className="self-center sm:text-2xl font-semibold whitespace-nowrap dark:text-white">
              CleanEase
            </span>
          </Navbar.Brand>
        </div>

        <div className="flex gap-2 md:order-2 justify-end items-end">
          <Button
            className="w-15 h-10 hidden md:inline items-center"
            pill
            size="sm"
            color="gray"
            outline
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <Tooltip
                className="mt-3 whitespace-nowrap "
                content="Dark Theme"
                style="dark"
                animation="duration-1000"
                placement="bottom"
              >
                <FaMoon />
              </Tooltip>
            ) : (
              <Tooltip
                className="mt-3 whitespace-nowrap"
                content="Light Theme"
                style="light"
                animation="duration-500"
                placement="bottom"
              >
                <FaSun />
              </Tooltip>
            )}
          </Button>
          {!(currentuser && currentuser.rest.isAdmin) && ( // Show buttons if currentuser is NOT an admin
            <>
              {currentuser && ( // Show cart button only if the user is logged in
                <Link to="/cart">
                  <Button
                    className="relative w-15 h-10 flex items-center"
                    pill
                    size="sm"
                    gradientDuoTone="purpleToBlue"
                  >
                    <MdShoppingCart />
                    {cartItems.length > 0 && (
                      <Badge
                        color="info"
                        className="absolute bottom-5 left-7 rounded-xl border border-blue-900"
                      >
                        {cartItems.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
              <Button
                className="relative w-15 h-10 md:flex items-center hidden"
                gradientDuoTone="purpleToBlue"
                pill
                size="sm"
                onClick={() => setIsNotificationOpen(true)}
              >
                {notifications.length > 0 ? (
                  <MdNotificationsActive className="size-4" />
                ) : (
                  <FaBell />
                )}
              </Button>
            </>
          )}

          {currentuser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={currentuser.rest.profilePicture}
                  rounded
                  bordered={hasNewOrder}
                  color="success"
                  onError={(e) => {
                    e.target.src =
                      "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png";
                  }}
                  status={hasNewOrder ? "online" : ""}
                  statusPosition={hasNewOrder ? "bottom-right" : ""}
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-bold tracking-wider text-green-600 dark:text-green-400">
                  Hi, {currentuser.rest.username.toUpperCase()}
                </span>
              </Dropdown.Header>

              <Link to="/user/dashboard?tab=profile">
                <Dropdown.Item className="justify-between gap-2">
                  Profile <FaUser className="mr-1" />
                </Dropdown.Item>
              </Link>
              <DropdownDivider />
              {!(currentuser && currentuser.rest.isAdmin) && ( // Show dropdown items if currentuser is NOT an admin
                <>
                  <Link to="/orders">
                    <Dropdown.Item className="justify-between gap-2">
                      Orders <MdCleaningServices className="mr-1" />
                      {hasNewOrder && (
                        <Badge className="ml-auto" color="success">
                          New
                        </Badge>
                      )}
                    </Dropdown.Item>
                  </Link>
                  <DropdownDivider />
                </>
              )}
              <Dropdown.Item
                onClick={handleSignOut}
                className="justify-between gap-2"
              >
                Sign Out
                <FaSignOutAlt className="mr-1" />
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/signin">
              <Button gradientDuoTone="purpleToBlue">SignIn</Button>
            </Link>
          )}
        </div>

        <Navbar.Collapse>
          <div className="hidden md:flex justify-end gap-5">
            {/* Show links if currentuser is not an admin */}
            {!(currentuser && currentuser.rest.isAdmin) && ( // This condition checks if the user is NOT an admin
              <>
                <Navbar.Link
                  active={path === "/"}
                  as={"div"}
                  className="w-full"
                >
                  <Link to="/" className="w-full block text-center">
                    Home
                  </Link>
                </Navbar.Link>

                {path === "/" && (
                  <Navbar.Link as={"div"} className="w-full">
                    <Link
                      to="/"
                      onClick={(e) => {
                        e.preventDefault();
                        const faqSection = document.getElementById("faq");
                        if (faqSection) {
                          faqSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="w-full block text-center"
                    >
                      FAQ
                    </Link>
                  </Navbar.Link>
                )}
                <Navbar.Link
                  active={path === "/services"}
                  as={"div"}
                  className="w-full"
                >
                  <Link to="/services" className="w-full block text-center">
                    Services
                  </Link>
                </Navbar.Link>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header
          title="MENU"
          titleIcon={() => <></>}
          className="flex justify-between"
        />

        <Drawer.Items>
          <div className="flex items-center justify-between py-2">
            <Sidebar
              aria-label="Sidebar with multi-level dropdown example"
              className="[&>div]:bg-transparent [&>div]:p-0"
            >
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  {!(currentuser && currentuser.rest.isAdmin) && (
                    <>
                      <Sidebar.Item
                        as={Link}
                        to="/"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          handleClose();
                        }}
                        icon={FaHome}
                      >
                        Home
                      </Sidebar.Item>
                      {path === "/" && (
                        <Sidebar.Item
                          as={Link}
                          to="#faq"
                          onClick={(e) => {
                            e.preventDefault();
                            const faqSection = document.getElementById("faq");
                            if (faqSection) {
                              faqSection.scrollIntoView({ behavior: "smooth" });
                            }
                            handleClose();
                          }}
                          icon={FaQuestion}
                        >
                          FAQ
                        </Sidebar.Item>
                      )}
                      <Sidebar.Item
                        as={Link}
                        to="/services"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          handleClose();
                        }}
                        icon={MdCleaningServices}
                      >
                        Services
                      </Sidebar.Item>
                    </>
                  )}
                  {/* Admin Links */}
                  {currentuser && currentuser.rest.isAdmin && (
                    <>
                      <Sidebar.Item
                        as={Link}
                        to="/admin/dashboard"
                        onClick={handleClose}
                        icon={HiChartPie}
                        active={location.pathname === "/admin/dashboard"}
                      >
                        Dashboard
                      </Sidebar.Item>
                      <Sidebar.Item
                        as={Link}
                        to="/admin/users"
                        onClick={handleClose}
                        icon={HiUser}
                        active={location.pathname === "/admin/users"}
                      >
                        Users
                      </Sidebar.Item>
                      <Sidebar.Item
                        as={Link}
                        to="/admin/services"
                        onClick={handleClose}
                        icon={MdCleaningServices}
                        active={location.pathname === "/admin/services"}
                      >
                        Services
                      </Sidebar.Item>
                      <Sidebar.Item
                        as={Link}
                        to="/admin/orders"
                        onClick={handleClose}
                        icon={MdBusiness}
                        active={location.pathname === "/admin/orders"}
                      >
                        Orders
                      </Sidebar.Item>
                      <Sidebar.Item
                        as={Link}
                        to="/admin/reviews"
                        onClick={handleClose}
                        icon={MdReviews}
                        active={location.pathname === "/admin/reviews"}
                      >
                        Reviews
                      </Sidebar.Item>
                      <Sidebar.Item
                        as={Link}
                        to="/admin/transactions"
                        onClick={handleClose}
                        icon={GrTransaction}
                        active={location.pathname === "/admin/transactions"}
                      >
                        Transactions
                      </Sidebar.Item>
                    </>
                  )}
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>

            <Button
              className="  inline-flex bottom-10 "
              gradientDuoTone="none"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? (
                <Tooltip
                  content="Switch to Dark Theme"
                  style="dark"
                  placement="left"
                >
                  <FaMoon className="text-2xl" />
                </Tooltip>
              ) : (
                <Tooltip
                  content="Switch to Light Theme"
                  style="light"
                  placement="left"
                >
                  <FaSun className="text-2xl" />
                </Tooltip>
              )}
            </Button>
          </div>
        </Drawer.Items>
        {!(currentuser && currentuser.rest.isAdmin) && (
          <>
            <Drawer.Header
              title="Notifications"
              className="flex justify-center items-center mt-10"
              titleIcon={() => (
                <>
                  <FaBell className="mr-1 " />{" "}
                </>
              )}
            />

            <Drawer.Items>
              <div className="w-full ">
                {notifications.length > 0 ? (
                  <>
                    {/* Upcoming Notifications */}
                    {notifications.filter(
                      (notification) => notification.status === "upcoming"
                    ).length > 0 && (
                      <div className="py-2">
                        <h2 className="font-semibold text-md">
                          Upcoming Services
                        </h2>
                        {notifications
                          .filter(
                            (notification) => notification.status === "upcoming"
                          )
                          .map((notification) => (
                            <div key={notification.id} className="py-1 ">
                              <Banner>
                                <div className="flex w-full rounded-xl justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                                  <div className="mx-auto text-xs flex items-center ">
                                    {notification.message}
                                  </div>
                                </div>
                              </Banner>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* In Process Notifications */}
                    {notifications.filter(
                      (notification) => notification.status === "in process"
                    ).length > 0 && (
                      <div className="py-2">
                        <h2 className="font-semibold text-md">
                          Running Services
                        </h2>
                        {notifications
                          .filter(
                            (notification) =>
                              notification.status === "in process"
                          )
                          .map((notification) => (
                            <div key={notification.id} className="py-1 ">
                              <Banner>
                                <div className="flex w-full rounded-xl justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                                  <div className="mx-auto text-xs flex items-center ">
                                    {notification.message}
                                  </div>
                                </div>
                              </Banner>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-2 text-center mt-5">No notifications</div>
                )}
              </div>
            </Drawer.Items>
          </>
        )}
      </Drawer>

      {/* Notification Drawer */}
      <Drawer
        open={isNotificationOpen}
        onClose={handleNotificationClose}
        position="right" // Position the drawer on the right
      >
        <Drawer.Header
          title="Notifications"
          className="flex justify-between"
          titleIcon={() => (
            <>
              <FaBell className="mr-1" />{" "}
            </>
          )}
        />

        <Drawer.Items>
          <div className="w-full ">
            {notifications.length > 0 ? (
              <>
                {/* Upcoming Notifications */}
                {notifications.filter(
                  (notification) => notification.status === "upcoming"
                ).length > 0 && (
                  <div className="py-2">
                    <h2 className="font-semibold text-lg">Upcoming Services</h2>
                    {notifications
                      .filter(
                        (notification) => notification.status === "upcoming"
                      )
                      .map((notification) => (
                        <div key={notification.id} className="py-2 ">
                          <Banner>
                            <div className="flex w-full rounded-xl justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                              <div className="mx-auto text-sm flex items-center ">
                                {notification.message}
                              </div>
                            </div>
                          </Banner>
                        </div>
                      ))}
                  </div>
                )}
                {/* In Process Notifications */}
                {notifications.filter(
                  (notification) => notification.status === "in process"
                ).length > 0 && (
                  <div className="py-2">
                    <h2 className="font-semibold text-lg">Running Services</h2>
                    {notifications
                      .filter(
                        (notification) => notification.status === "in process"
                      )
                      .map((notification) => (
                        <div key={notification.id} className="py-2 ">
                          <Banner>
                            <div className="flex w-full rounded-xl justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                              <div className="mx-auto text-sm  flex items-center">
                                {notification.message}
                              </div>
                            </div>
                          </Banner>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-2 text-center mt-5">No notifications</div>
            )}
          </div>
        </Drawer.Items>
      </Drawer>
      {/* Reminder */}
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal} // Call handleCloseModal on close
        className=""
      >
        <Modal.Header>
          <span className="flex gap-1 items-center text-yellow-400">
            <HiMiniBellAlert className="mt-1" />
            Reminder
          </span>
        </Modal.Header>
        <Modal.Body className="text-black dark:text-white">
          <ul className="list-disc pl-5 ">
            {modalMessages.map((message, index) => (
              <li key={index} className="py-1">
                {message}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Header;
