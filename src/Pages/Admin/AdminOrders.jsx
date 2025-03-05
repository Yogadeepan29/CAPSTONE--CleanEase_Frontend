import React, { useEffect, useState } from "react";
import {
  Table,
  TextInput,
  Breadcrumb,
  Checkbox,
  Label,
  Button,
  Spinner,
} from "flowbite-react";
import axios from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import API_BASE_URL from "../../apiConfig";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("orderNo"); 
  const [sortOrder, setSortOrder] = useState("desc"); 
  const [showCompleted, setShowCompleted] = useState(true); 
  const [showUpcoming, setShowUpcoming] = useState(true); 

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

 // Fetch orders from the API
  const fetchOrders = async () => {
    const token = localStorage.getItem("Token");
    try {
      const response = await axios.get(`${API_BASE_URL}/order/all`, {
        headers: { token },
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.response.data.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

   // Sort orders based on selected field and order
  const sortOrders = (orders) => {
    if (!sortField || sortOrder === "neutral") return orders;

    return [...orders].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "totalAmount") {
        aValue = a.totalAmount;
        bValue = b.totalAmount;
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });
  };

    // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const orderNoMatch = order.orderNo
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const usernameMatch = order.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const serviceNameMatch = order.items.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusMatch =
      (showCompleted && order.items[0].status === "Completed") ||
      (showUpcoming && order.items[0].status === "upcoming");

    return (orderNoMatch || usernameMatch || serviceNameMatch) && statusMatch;
  });

  const sortedOrders = sortOrders(filteredOrders);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalOrdersCount = sortedOrders.length;
  const totalPages = Math.ceil(totalOrdersCount / ordersPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center ">
        <Spinner size="xl" aria-label="Loading..." />
        <p className="mt-4 text-lg">Please wait...</p>
      </div>
    );
  }
  
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold">{error}</div>
    );

  return (
    <>
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item href="/admin/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Orders</Breadcrumb.Item>
      </Breadcrumb>
      <div className="grid mt-10">
        <h1 className="text-2xl font-bold mb-4">
          List Orders ({totalOrdersCount})
        </h1>
        <div className="flex flex-col md:flex-row md:justify-between mb-4">
          <TextInput
            id="search-order"
            type="text"
            placeholder="Search Order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={AiOutlineSearch}
            className="w-full md:max-w-sm mb-2 md:mb-0"
          />
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 ml-auto">
            <div className="flex items-center mb-2 md:mb-0">
              <Checkbox
                id="completed-checkbox"
                checked={showCompleted}
                className="cursor-pointer"
                onChange={() => setShowCompleted(!showCompleted)}
              />
              <Label
                htmlFor="completed-checkbox"
                className="ml-2 text-xs cursor-pointer"
              >
                Completed
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="upcoming-checkbox"
                checked={showUpcoming}
                className="cursor-pointer"
                onChange={() => setShowUpcoming(!showUpcoming)}
              />
              <Label
                htmlFor="upcoming-checkbox"
                className="ml-2 text-xs cursor-pointer"
              >
                Upcoming
              </Label>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            className="text-center table-auto text-xs md:text-sm"
          >
            <Table.Head>
              <Table.HeadCell>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("orderNo")}
                >
                  Order No
                  {sortField === "orderNo" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>User Name</Table.HeadCell>
              <Table.HeadCell>Service Name</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Addons</Table.HeadCell>
              <Table.HeadCell>Subscription</Table.HeadCell>
              <Table.HeadCell>Service On</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("totalAmount")}
                >
                  Total Amount
                  {sortField === "totalAmount" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {currentOrders.length > 0 ? (
                currentOrders.map((order, orderIndex) => {
                  const rowColor =
                    orderIndex % 2 === 0
                      ? "bg-gray-200 dark:bg-gray-900"
                      : "bg-gray-100 dark:bg-gray-800";
                  return (
                    <React.Fragment key={order._id}>
                      <Table.Row className={rowColor}>
                        <Table.Cell rowSpan={order.items.length}>
                          # {order.orderNo}
                        </Table.Cell>
                        <Table.Cell rowSpan={order.items.length}>
                          {order.username}
                        </Table.Cell>
                        <Table.Cell>{order.items[0].name}</Table.Cell>
                        <Table.Cell>
                          ₹{order.items[0].price.toFixed(2)}
                        </Table.Cell>
                        <Table.Cell>
                          {order.items[0].subscription
                            ? "All complementary"
                            : order.items[0].addons.length > 0
                            ? order.items[0].addons.map((addon, index) => (
                                <div key={addon._id}>
                                  {addon.name}
                                  {index < order.items[0].addons.length - 1 &&
                                    ","}
                                </div>
                              ))
                            : "-"}
                        </Table.Cell>
                        <Table.Cell>
                          {order.items[0].subscription ? "Yes" : "No"}
                        </Table.Cell>
                        <Table.Cell className="text-xs">
                          {order.items[0].serviceDate}
                          <br />
                          {order.items[0].serviceTime}
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            className={`inline-block font-medium ${
                              order.items[0].status === "Completed"
                                ? "text-green-500"
                                : order.items[0].status === "On process"
                                ? "text-orange-400"
                                : order.items[0].status === "upcoming"
                                ? "text-yellow-500 dark:text-yellow-300"
                                : "text-gray-500"
                            }`}
                          >
                            {order.items[0].status}
                          </span>
                        </Table.Cell>
                        <Table.Cell rowSpan={order.items.length}>
                          <div className="text-gray-600 dark:text-gray-400">
                            {order.items[0].serviceAddress.city}, <br />
                            {order.items[0].serviceAddress.state}.
                          </div>
                        </Table.Cell>
                        <Table.Cell rowSpan={order.items.length}>
                          ₹{order.totalAmount.toFixed(2)}
                        </Table.Cell>
                      </Table.Row>
                      {order.items.slice(1).map((item) => (
                        <Table.Row key={item._id} className={rowColor}>
                          <Table.Cell>{item.name}</Table.Cell>
                          <Table.Cell>₹{item.price.toFixed(2)}</Table.Cell>
                          <Table.Cell>
                            {item.subscription
                              ? "All complementary"
                              : item.addons.length > 0
                              ? item.addons.map((addon, index) => (
                                  <div key={addon._id}>
                                    {addon.name}
                                    {index < item.addons.length - 1 && ","}
                                  </div>
                                ))
                              : "-"}
                          </Table.Cell>
                          <Table.Cell>
                            {item.subscription ? "Yes" : "No"}
                          </Table.Cell>
                          <Table.Cell className="text-xs">
                            {item.serviceDate}
                            <br />
                            {item.serviceTime}
                          </Table.Cell>
                          <Table.Cell>
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
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </React.Fragment>
                  );
                })
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={9} className="text-center">
                    No orders found
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalOrdersCount > ordersPerPage && (
          <div className="mt-6 sm:flex text-center justify-between items-center">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {indexOfFirstOrder + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min(indexOfLastOrder, totalOrdersCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalOrdersCount}
              </span>{" "}
              Entries
            </p>
            <div className="sm:flex mt-2 sm:mt-0 space-x-2">
              <Button.Group>
                <Button
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  color="light"
                  pill
                  className={
                    currentPage === 1 ? "cursor-default" : "cursor-pointer"
                  }
                >
                  <div className="flex items-center gap-1">
                    <span>Previous</span>
                  </div>
                </Button>
                <Button
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages}
                  color="light"
                  pill
                  className={
                    currentPage === totalPages
                      ? "cursor-default"
                      : "cursor-pointer"
                  }
                >
                  <div className="flex items-center gap-1">
                    <span>Next</span>
                  </div>
                </Button>
              </Button.Group>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
