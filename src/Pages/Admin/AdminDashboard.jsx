import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, Card, Drawer, Button } from "flowbite-react";
import { HiChartPie, HiUser  } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { MdCleaningServices, MdReviews, MdBusiness, MdSubscriptions } from "react-icons/md";
import { FaClipboardList, FaMoneyBillWave, FaStar, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TbTransactionRupee } from "react-icons/tb";
import API_BASE_URL from "../../apiConfig";

const AdminDashboard = () => {
    // State variables for various metrics
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrderedServices, setTotalOrderedServices] = useState(0); // New state for ordered services
  const [upcomingOrdersCount, setUpcomingOrdersCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0); // New state for subscription count
  const [totalReviews, setTotalReviews] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [availableServicesCount, setAvailableServicesCount] = useState(0);

  useEffect(() => {
        // Fetch total users
    const fetchTotalUsers = async () => {
      const token = localStorage.getItem("Token");
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/total`,
          {
            headers: { token },
          }
        );
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

       // Fetch total orders and revenue
    const fetchTotalOrdersAndRevenue = async () => {
      const token = localStorage.getItem("Token");
      try {
        const response = await axios.get(
         `${API_BASE_URL}/order/total-orders`,
          {
            headers: { token },
          }
        );
        setTotalOrders(response.data.totalOrders);
        setTotalRevenue(response.data.totalRevenue);
        setTotalOrderedServices(response.data.totalOrderedServices); // Set total ordered services
        setUpcomingOrdersCount(response.data.upcomingOrdersCount); // Set pending orders count
        setSubscriptionCount(response.data.subscriptionCount);
        setCompletedOrdersCount(response.data.completedOrdersCount);
      } catch (error) {
        console.error("Error fetching total orders and revenue:", error);
      }
    };

        // Fetch total reviews
    const fetchTotalReviews = async () => {
      const token = localStorage.getItem("Token");
      try {
        const response = await axios.get(
         `${API_BASE_URL}/review/total`,
          {
            headers: { token },
          }
        );
        setTotalReviews(response.data.totalReviews); // Update state with total reviews
      } catch (error) {
        console.error("Error fetching total reviews:", error);
      }
    };

        // Fetch available services
    const fetchAvailableServices = async () => {
      const token = localStorage.getItem("Token");
      try {
        const response = await axios.get(`${API_BASE_URL}/services`, {
          headers: { token },
        });
        // Calculate the total number of products across all services
        const totalServices = response.data.reduce((acc, service) => {
          return acc + service.products.length; // Sum the length of products in each service
        }, 0);
        setAvailableServicesCount(totalServices); // Set the count of available services
      } catch (error) {
        console.error("Error fetching available services:", error);
      }
    };

    fetchTotalUsers();
    fetchTotalOrdersAndRevenue();
    fetchTotalReviews(); 
    fetchAvailableServices();// Call the function to fetch total reviews
  }, []);

  // Utility function to format numbers
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"; // Format to one decimal place
    }
    return num;
  };

  return (
    <div className="min-h-full">
      <div className="md:flex justify-center">
        {/* Main Content */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;