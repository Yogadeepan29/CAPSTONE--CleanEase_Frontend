import React, { useEffect, useState } from "react";
import { Table, TextInput, Modal, Button, Breadcrumb, Spinner } from "flowbite-react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { format } from "date-fns";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import API_BASE_URL from "../../apiConfig";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("Token");
      try {
        const response = await axios.get(`${API_BASE_URL}/user/all`, {
          headers: { token },
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response.data.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    const token = localStorage.getItem("Token");
    try {
      await axios.delete(
        `${API_BASE_URL}/user/delete/${userIdToDelete}`,
        {
          headers: { token },
        }
      );
      // Remove the deleted user from the state
      const updatedUsers = users.filter((user) => user._id !== userIdToDelete);
      setUsers(updatedUsers);

      // Check if the current page is valid
      const totalPages = Math.ceil(updatedUsers.length / usersPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages); // Reset to the last page if current page is invalid
      }
      setModalOpen(false); // Close the modal after deletion
    } catch (err) {
      setError(
        err.response.data.message || "An error occurred while deleting the user"
      );
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
        <Breadcrumb.Item>Users</Breadcrumb.Item>
      </Breadcrumb>
      <div className="grid mt-10">
        <h1 className="text-2xl font-bold mb-4">
          List Users ({filteredUsers.length}){" "}
        </h1>
        <div className=" mb-4 ml-auto max-w-sm ">
          <TextInput
            id="search-user"
            type="text"
            placeholder="Search User... "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={AiOutlineSearch}
          />
        </div>

        <div className="overflow-x-auto ">
          <Table hoverable className="text-center text-xs md:text-sm">
            <Table.Head>
              <Table.HeadCell>S.No</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Customer ID</Table.HeadCell>
              <Table.HeadCell>Created Date</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>{index + indexOfFirstUser + 1}</Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.stripeCustomerId || "N/A"}</Table.Cell>
                    <Table.Cell>
                      {format(new Date(user.createdAt), "dd-MM-yyyy")}
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => {
                          setUserIdToDelete(user._id); // Fixed variable name
                          setModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    No users found
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination with Previous and Next Buttons */}
        {filteredUsers.length > usersPerPage && (
          <div className="mt-6 sm:flex text-center justify-between items-center">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {indexOfFirstUser + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredUsers.length}
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

        {/* Confirmation Modal */}
        <Modal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-200">
                Are you sure you want to delete this Account
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
                  Yes,I'm sure
                </Button>
                <Button color="gray" onClick={() => setModalOpen(false)}>
                  No,Changed My Mind
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AdminUsers;
