import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner } from "flowbite-react";
import { MdCleaningServices, MdSubscriptions } from "react-icons/md";
import { FaClipboardList, FaStar, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TbTransactionRupee } from "react-icons/tb";
import API_BASE_URL from "../../apiConfig";

const AdminDashboard = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Please wait...");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrderedServices, setTotalOrderedServices] = useState(0);
  const [upcomingOrdersCount, setUpcomingOrdersCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [availableServicesCount, setAvailableServicesCount] = useState(0);

  useEffect(() => {
    let messageTimer;

    const fetchAllData = async () => {
      setLoading(true);
      messageTimer = setTimeout(() => {
        setLoadingMessage(
          "Due to inactivity on our page, data retrieval may be slower. We apologize for the inconvenience."
        );
      }, 5000);

      const token = localStorage.getItem("Token");

      try {
        const [usersRes, ordersRes, reviewsRes, servicesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/user/total`, { headers: { token } }),
          axios.get(`${API_BASE_URL}/order/total-orders`, { headers: { token } }),
          axios.get(`${API_BASE_URL}/review/total`, { headers: { token } }),
          axios.get(`${API_BASE_URL}/services`, { headers: { token } }),
        ]);

        // Set users data
        setTotalUsers(usersRes.data.totalUsers);

        // Set orders data
        const ordersData = ordersRes.data;
        setTotalOrders(ordersData.totalOrders);
        setTotalRevenue(ordersData.totalRevenue);
        setTotalOrderedServices(ordersData.totalOrderedServices);
        setUpcomingOrdersCount(ordersData.upcomingOrdersCount);
        setSubscriptionCount(ordersData.subscriptionCount);
        setCompletedOrdersCount(ordersData.completedOrdersCount);

        // Set reviews data
        setTotalReviews(reviewsRes.data.totalReviews);

        // Set services data
        const totalServices = servicesRes.data.reduce(
          (acc, service) => acc + service.products.length,
          0
        );
        setAvailableServicesCount(totalServices);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        clearTimeout(messageTimer);
      }
    };

    fetchAllData();

    return () => {
      clearTimeout(messageTimer);
    };
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  return (
    <div className="min-h-full">
      <div className="md:flex justify-center">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="text-center">
              <Spinner size="xl" aria-label="Loading..." className="mr-2" />
              <p className="mt-4 font-normal dark:text-slate-300 text-black">
                {loadingMessage.split(". ").map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < loadingMessage.split(". ").length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 text-black dark:text-white">
            <header className="mb-6">
              <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 text-center ">
              <Link to="/admin/users" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaUsers className="text-3xl mx-auto text-blue-500 " />
                  <div>
                    <h3 className="text-lg font-semibold">Total Users</h3>
                    <p className="text-2xl font-bold text-center">
                      {formatNumber(totalUsers)}
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/admin/transactions" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <TbTransactionRupee className="text-3xl text-yellow-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <p className="text-2xl font-bold text-center ">
                      ₹{formatNumber(totalRevenue)}
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/admin/orders" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaClipboardList className="text-3xl text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Total Orders</h3>
                    <p className="text-2xl font-bold text-center ">
                      {formatNumber(totalOrders)}
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/admin/orders" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaClipboardList className="text-3xl text-purple-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold ">Ordered Services</h3>
                    <p className="text-2xl font-bold text-center">
                      {formatNumber(totalOrderedServices)}
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/admin/orders" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MdCleaningServices className="text-3xl text-yellow-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Upcoming Services</h3>
                    <p className="text-2xl font-bold text-center">
                      {formatNumber(upcomingOrdersCount)}
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/admin/orders" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MdCleaningServices className="text-3xl text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Completed Services</h3>
                    <p className="text-2xl font-bold text-center">
                      {formatNumber(completedOrdersCount)}
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/admin/orders" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MdSubscriptions className="text-3xl text-teal-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Subscriptions</h3>
                    <p className="text-2xl font-bold text-center">
                      {formatNumber(subscriptionCount)}
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/admin/reviews" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaStar className="text-3xl text-yellow-300 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Total Reviews</h3>
                    <p className="text-2xl font-bold text-center">
                      {formatNumber(totalReviews)}
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/admin/services" className="hover:scale-105 transition-transform duration-200">
                <Card className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaClipboardList className="text-3xl text-blue-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold ">Available Services</h3>
                    <p className="text-2xl font-bold text-center">
                      {formatNumber(availableServicesCount)}
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;