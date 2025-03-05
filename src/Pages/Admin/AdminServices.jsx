import React, { useEffect, useState } from "react";
import {
  Table,
  TextInput,
  Modal,
  Button,
  Breadcrumb,
  Tooltip,
  Spinner,
} from "flowbite-react";
import axios from "axios";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import AddServiceModal from "../../Components/AddServiceModal";
import EditServiceModal from "../../Components/EditServiceModal";
import { FaIndianRupeeSign } from "react-icons/fa6";
import API_BASE_URL from "../../apiConfig";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [editServiceModalOpen, setEditServiceModalOpen] = useState(false);
  const [serviceIdToEdit, setServiceIdToEdit] = useState(null);
  const [serviceIdToDelete, setServiceIdToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 10;
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("neutral");

  // State for editing service
  const [editServiceName, setEditServiceName] = useState("");
  const [editServicePrice, setEditServicePrice] = useState("");
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch services from the API
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services`);
      setServices(response.data);
    } catch (err) {
      setError(err.response.data.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAdded = async () => {
    await fetchServices(); // Fetch services again or update the state as needed
  };

  const handleEditAdminService = (product) => {
    // Set the service to edit and open the EditServiceModal
    setServiceToEdit(product);
    setEditServiceModalOpen(true); // Open the EditServiceModal
  };

  const handleEditInbuildService = async () => {
    try {
      // Convert the price to a number
      const priceAsNumber = parseFloat(editServicePrice);

      // Send the PUT request to update the service
      await axios.put(
        `${API_BASE_URL}/services/product/${serviceIdToEdit}`,
        {
          name: editServiceName,
          price: priceAsNumber, // Use the parsed number
        }
      );

      // Update the local state directly
      setServices((prevServices) =>
        prevServices.map((service) => {
          const updatedProducts = service.products.map((product) => {
            if (product._id === serviceIdToEdit) {
              return {
                ...product,
                name: editServiceName,
                price: priceAsNumber,
              }; // Use the parsed number
            }
            return product;
          });
          return { ...service, products: updatedProducts };
        })
      );

      setModalOpen(false); // Close the modal after editing
    } catch (err) {
      setError(
        err.response.data.message ||
          "An error occurred while editing the service"
      );
    }
  };

  const handleDeleteService = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/services/product/${serviceIdToDelete}`
      );
      setServices((prevServices) =>
        prevServices.map((service) => {
          return {
            ...service,
            products: service.products.filter(
              (product) => product._id !== serviceIdToDelete
            ),
          };
        })
      );
      setDeleteModalOpen(false); // Close the modal after deletion
    } catch (err) {
      setError(
        err.response.data.message ||
          "An error occurred while deleting the service"
      );
    }
  };

  // Handle input changes and track if there are changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setEditServiceName(value);
    } else if (name === "price") {
      setEditServicePrice(value);
    }

    // Check if there are changes, ignoring trailing spaces
    const trimmedName = value.trimEnd();
    const trimmedOriginalName =
      name === "name" ? editServiceName.trimEnd() : editServiceName;
    const trimmedPrice = parseFloat(value);
    const originalPrice = parseFloat(editServicePrice);

    setHasChanges(
      (name === "name" && trimmedName !== trimmedOriginalName) ||
        (name === "price" && trimmedPrice !== originalPrice)
    );
  };

  const sortServices = (services) => {
    if (!sortField || sortOrder === "neutral") return services; // No sorting if no field is selected or neutral

    return [...services].sort((a, b) => {
      let aValue, bValue;

      if (sortField === "addedBy") {
        // Custom sorting for addedBy
        aValue = a.addedBy === "Admin" ? 0 : 1; // Admin gets priority
        bValue = b.addedBy === "Admin" ? 0 : 1;
      } else {
        aValue =
          sortField === "price"
            ? a.price
            : sortField === "rating"
            ? a.rating
            : a.reviews;
        bValue =
          sortField === "price"
            ? b.price
            : sortField === "rating"
            ? b.rating
            : b.reviews;
      }

      if (sortOrder === "desc") {
        return aValue - bValue;
      } else if (sortOrder === "asc") {
        return bValue - aValue;
      }
      return 0; // Default case
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If the same field is clicked, toggle the order
      if (sortOrder === "neutral") {
        setSortOrder("desc"); // First click: descending
      } else if (sortOrder === "desc") {
        setSortOrder("asc"); // Second click: ascending
      } else {
        setSortField(null); // Reset to neutral
        setSortOrder("neutral");
      }
    } else {
      // If a different field is clicked, set it as the new sort field
      setSortField(field);
      setSortOrder("desc"); // Default to descending
    }
  };

  const filteredServices = services.reduce((acc, service) => {
    const matchingProducts = service.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingProducts.length > 0) {
      acc.push({ ...service, products: matchingProducts });
    }

    return acc;
  }, []);

  const sortedServices = sortServices(
    filteredServices.flatMap((service) => service.products)
  );

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;

  const currentServices = sortedServices.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const totalServicesCount = sortedServices.length;
  const totalPages = Math.ceil(totalServicesCount / servicesPerPage);

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
        <Breadcrumb.Item>Services</Breadcrumb.Item>
      </Breadcrumb>
      <div className="grid mt-10">
        <h1 className="text-2xl font-bold mb-4">
          List Services ({totalServicesCount}){" "}
        </h1>
        <div className="mb-4 mx-auto w-full flex flex-col md:flex-row items-center justify-between text-sm md:text-lg font-semibold gap-4">
          <TextInput
            id="search-service"
            type="text"
            placeholder="Search Service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={AiOutlineSearch}
            className="w-full md:max-w-sm"
          />
          <div
            className="flex items-center justify-center gap-2 cursor-pointer mt-2 md:mt-0 hover:text-green-400"
            onClick={() => setAddServiceModalOpen(true)}
          >
            <CiCirclePlus className="h-6 w-6 inline" />
            <span className="whitespace-nowrap text-sm sm:text-lg">
              Add New Service
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table hoverable className="text-center text-xs md:text-sm">
            <Table.Head>
              <Table.HeadCell>S.No</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Price
                  {sortField === "price" && sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : sortField === "price" && sortOrder === "desc" ? (
                    <FaSortDown className="ml-1" />
                  ) : (
                    <FaSort className="ml-1" />
                  )}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("rating")}
                >
                  Rating
                  {sortField === "rating" && sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : sortField === "rating" && sortOrder === "desc" ? (
                    <FaSortDown className="ml-1" />
                  ) : (
                    <FaSort className="ml-1" />
                  )}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("reviews")}
                >
                  Reviews
                  {sortField === "reviews" && sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : sortField === "reviews" && sortOrder === "desc" ? (
                    <FaSortDown className="ml-1" />
                  ) : (
                    <FaSort className="ml-1" />
                  )}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("addedBy")}
                >
                  ACTIONS
                  {sortField === "addedBy" && sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : sortField === "addedBy" && sortOrder === "desc" ? (
                    <FaSortDown className="ml-1" />
                  ) : (
                    <FaSort className="ml-1" />
                  )}
                </div>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {currentServices.length > 0 ? (
                currentServices.map((product, index) => {
                  const service = services.find((service) =>
                    service.products.includes(product)
                  );
                  return (
                    <Table.Row key={product._id}>
                      <Table.Cell>
                        {(currentPage - 1) * servicesPerPage + index + 1}
                      </Table.Cell>
                      <Table.Cell>{service.category}</Table.Cell>
                      <Table.Cell>{product.name}</Table.Cell>
                      <Table.Cell>₹{product.price.toFixed(2)}</Table.Cell>
                      <Table.Cell>{product.rating}</Table.Cell>
                      <Table.Cell>{product.reviews}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-3 items-center justify-center ">
                          {product.addedBy === "Admin" && (
                            <button
                              onClick={() => handleEditAdminService(product)} // Pass the product to the edit handler
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <FaEdit />
                            </button>
                          )}
                          {product.addedBy !== "Admin" && (
                            <button
                              onClick={() => {
                                setServiceIdToEdit(product._id); // Set the product ID to edit
                                setEditServiceName(product.name); // Set the current name for editing
                                setEditServicePrice(product.price); // Set the current price for editing
                                setModalOpen(true); // Open the edit modal
                              }}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <FaEdit />
                            </button>
                          )}

                          {product.addedBy !== "Admin" ? (
                            <Tooltip
                              content="Cannot delete inbuilt service"
                              placement="top"
                            >
                              <button
                                className={`text-red-600 hover:text-red-800 mt-2 opacity-50`}
                                style={{ cursor: "default" }} // Default cursor for disabled state
                              >
                                <FaTrash />
                              </button>
                            </Tooltip>
                          ) : (
                            <button
                              onClick={() => {
                                setServiceIdToDelete(product._id);
                                setDeleteModalOpen(true);
                              }}
                              className="text-red-600 hover:text-red-800 mt-0.5"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center">
                    No services found
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {totalServicesCount > servicesPerPage && (
          <div className="mt-6 sm:flex text-center justify-between items-center">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {indexOfFirstService + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min(indexOfLastService, totalServicesCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalServicesCount}
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

        {/* Modal for adding a new service */}
        <AddServiceModal
          isOpen={addServiceModalOpen}
          onClose={() => setAddServiceModalOpen(false)}
          services={services}
          onServiceAdded={handleServiceAdded}
          serviceToEdit={serviceToEdit} // Pass the service to edit
        />

        {/* Edit Modal for services added by Admin */}
        <EditServiceModal
          isOpen={editServiceModalOpen}
          onClose={() => setEditServiceModalOpen(false)}
          services={services}
          onServiceUpdated={handleServiceAdded}
          serviceToEdit={serviceToEdit}
        />

        {/* Edit Modal for inbuild services */}
        <Modal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
                Edit Service
              </h3>
              <TextInput
                id="edit-service-name"
                name="name"
                type="text"
                placeholder="Service Name"
                value={editServiceName}
                onChange={handleInputChange}
                className="mb-4"
              />
              <TextInput
                id="edit-service-price"
                name="price"
                type="number"
                icon={FaIndianRupeeSign}
                placeholder="Service Price"
                value={editServicePrice}
                onChange={handleInputChange}
                className="mb-4"
              />
              <div className="flex justify-center gap-4">
                <Button
                  color="success"
                  onClick={handleEditInbuildService} // Update the service
                  disabled={!hasChanges} // Disable if no changes
                  style={{ cursor: !hasChanges ? "default" : "pointer" }} // Default cursor when disabled
                >
                  Save Changes
                </Button>
                <Button color="gray" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Confirmation Modal for Deletion */}
        <Modal
          show={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
                Are you sure you want to delete this service?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteService}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
                  No, Changed My Mind
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AdminServices;
