import React, { useEffect, useState } from "react";
import { Table, TextInput, Breadcrumb, Button ,Spinner} from "flowbite-react";
import axios from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import API_BASE_URL from "../../apiConfig";

const AdminTransaction = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt"); 
  const [sortOrder, setSortOrder] = useState("desc"); 

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 15; 

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const sortTransactions = (orders) => {
    if (!sortField || sortOrder === "neutral") return orders;

    return [...orders].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "totalAmount") {
        aValue = a.totalAmount;
        bValue = b.totalAmount;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filteredTransactions = orders.filter((order) => {
    const usernameMatch = order.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const transactionIdMatch = order.transactionId
      ? order.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    return usernameMatch || transactionIdMatch;
  });

  const sortedTransactions = sortTransactions(filteredTransactions);

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalTransactionsCount = sortedTransactions.length;
  const totalPages = Math.ceil(totalTransactionsCount / transactionsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
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
        <Breadcrumb.Item>Transactions</Breadcrumb.Item>
      </Breadcrumb>
      <div className="grid mt-10">
        <h1 className="text-2xl font-bold mb-4">
          List Transactions ({sortedTransactions.length})
        </h1>
        <div className="mb-4">
          <TextInput
            id="search-transaction"
            type="text"
            placeholder="Search Transaction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={AiOutlineSearch}
            className="w-full md:max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table hoverable className="text-xs md:text-sm">
            <Table.Head>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("sNo")}
                >
                  S.No
                  {sortField === "sNo" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Customer Name
                  {sortField === "username" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Date
                  {sortField === "createdAt" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("transactionId")}
                >
                  Transaction ID
                  {sortField === "transactionId" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("paymentMode")}
                >
                  Type
                  {sortField === "paymentMode" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" &&
                    (sortOrder === "asc" ? (
                      <FaSortUp className="ml-1" />
                    ) : (
                      <FaSortDown className="ml-1" />
                    ))}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
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
            <Table.Body className="text-center">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((order, index) => (
                  <Table.Row key={order._id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{order.username}</Table.Cell>
                    <Table.Cell>{new Date(order.createdAt).toLocaleDateString("en-GB")}</Table.Cell>
                    <Table.Cell>{order.transactionId || "N/A"}</Table.Cell>
                    <Table.Cell>{order.paymentMode}</Table.Cell>
                    <Table.Cell>
                      <span className="inline-block font-medium text-green-500">
                        Success
                      </span>
                    </Table.Cell>
                    <Table.Cell>₹{order.totalAmount.toFixed(2)}</Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center">
                    No transactions found
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalTransactionsCount > transactionsPerPage && (
          <div className="mt-6 sm:flex text-center justify-between items-center">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {indexOfFirstTransaction + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min(indexOfLastTransaction, totalTransactionsCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalTransactionsCount}
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

export default AdminTransaction;