import React, { useEffect, useState } from "react";
import {
  Table,
  TextInput,
  Modal,
  Button,
  Breadcrumb,
  Textarea,
  Rating,
  Spinner,
} from "flowbite-react";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import { FaSort, FaSortUp, FaSortDown, FaEdit } from "react-icons/fa";
import { BiSolidCommentDetail } from "react-icons/bi";
import API_BASE_URL from "../../apiConfig";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewIdToRespond, setReviewIdToRespond] = useState(null);
  const [responseText, setResponseText] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 15;

  // Sorting state
  const [sortField, setSortField] = useState("sno"); // Default to sorting by S.No
  const [sortOrder, setSortOrder] = useState("desc"); // Default to descending order

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("Token");
      try {
        const response = await axios.get(`${API_BASE_URL}/review`, {
          headers: { token },
        });
        console.log(response.data); // Log the response data for debugging
        // Sort reviews by createdAt in descending order
        const sortedReviews = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sortedReviews);
      } catch (err) {
        setError(err.response.data.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

    // Handle response to a review
  const handleRespond = async () => {
    const token = localStorage.getItem("Token");
    try {
      await axios.patch(
        `${API_BASE_URL}/review/respond/${reviewIdToRespond}`,
        { response: responseText },
        { headers: { token } }
      );
      // Close the modal and reset the response text
      setModalOpen(false);
      setResponseText("");
      // Optionally, refetch reviews to update the list
      const updatedReviews = reviews.map((review) =>
        review._id === reviewIdToRespond
          ? { ...review, response: responseText }
          : review
      );
      setReviews(updatedReviews);
    } catch (err) {
      setError(
        err.response.data.message || "An error occurred while responding"
      );
    }
  };

    // Filter reviews based on search term
  const filteredReviews = reviews.filter((review) => {
    const feedbackMatch = review.feedback.toLowerCase().includes(searchTerm.toLowerCase());
    const ratingMatch = review.rating.toString().includes(searchTerm.toLowerCase());
    const usernameMatch = review.userId ? review.userId.username.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const serviceNameMatch = review.productName ? review.productName.toLowerCase().includes(searchTerm.toLowerCase()) : false;
  
    return feedbackMatch || ratingMatch || usernameMatch || serviceNameMatch;
  });

  // Sorting function
  const sortReviews = (reviews) => {
    if (!sortField || sortOrder === "neutral") return reviews; // No sorting if no field is selected or neutral

    return [...reviews].sort((a, b) => {
      let aValue, bValue;

      if (sortField === "sno") {
        // For S.No, we want to sort based on the index
        aValue = reviews.length - reviews.indexOf(a); // Higher index means higher S.No
        bValue = reviews.length - reviews.indexOf(b);
      } else if (sortField === "serviceName") {
        aValue = a.productName.toLowerCase();
        bValue = b.productName.toLowerCase();
      } else if (sortField === "userName") {
        aValue = a.userId ? a.userId.username.toLowerCase() : "";
        bValue = b.userId ? b.userId.username.toLowerCase() : "";
      } else if (sortField === "rating") {
        aValue = a.rating;
        bValue = b.rating;
      } else if (sortField === "date") {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      } else {
        return 0; // Default case
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If the same field is clicked, toggle the order
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      // If a different field is clicked, set it as the new sort field
      setSortField(field);
      setSortOrder("desc"); // Default to descending
    }
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortReviews(filteredReviews).slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

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
        <Breadcrumb.Item>Reviews</Breadcrumb.Item>
      </Breadcrumb>
      <div className="grid mt-10">
        <h1 className="text-2xl font-bold mb-4">
          List Reviews ({filteredReviews.length})
        </h1>
        <div className="mb-4">
          <TextInput
            id="search-review"
            type="text"
            placeholder="Search Review..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={AiOutlineSearch}
            className="w-full md:max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table hoverable className="text-center text-xs md:text-sm">
            <Table.Head>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("sno")}
                >
                  S.No
                  {sortField === "sno" && sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : sortField === "sno" && sortOrder === "desc" ? (
                    <FaSortDown className="ml-1" />
                  ) : (
                    <FaSort className="ml-1" />
                  )}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("serviceName")}
                >
                  Service Name
                  {sortField === "serviceName" && sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : sortField === "serviceName" && sortOrder === "desc" ? (
                    <FaSortDown className="ml-1" />
                  ) : (
                    <FaSort className="ml-1" />
                  )}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("userName")}
                >
                  User Name
                  {sortField === "userName" && sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : sortField === "userName" && sortOrder === "desc" ? (
                    <FaSortDown className="ml-1" />
                  ) : (
                    <FaSort className="ml-1" />
                  )}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex justify-center items-center cursor-pointer"
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
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortField === "date" && sortOrder === "asc" ? (
                    <FaSortUp className="ml-1" />
                  ) : sortField === "date" && sortOrder === "desc" ? (
                    <FaSortDown className="ml-1" />
                  ) : (
                    <FaSort className="ml-1" />
                  )}
                </div>
              </Table.HeadCell>
              <Table.HeadCell className="flex pt-5 pb-5 justify-center items-center">
                Feedback
              </Table.HeadCell>
              <Table.HeadCell >Respond</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {currentReviews.length > 0 ? (
                currentReviews.map((review, index) => (
                  <Table.Row key={review._id}>
                    <Table.Cell>
                      {(currentPage - 1) * reviewsPerPage + index + 1}
                    </Table.Cell>
                    <Table.Cell>
                      {review.productName
                        ? review.productName
                        : "Unknown Product"}
                    </Table.Cell>
                    <Table.Cell>
                      {review.userId ? review.userId.username : "Unknown User"}
                    </Table.Cell>
                    <Table.Cell className="flex justify-center">
                      <Rating>
                        {[...Array(5)].map((_, starIndex) => (
                          <Rating.Star
                            key={starIndex}
                            className={
                              starIndex < review.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </Rating>
                    </Table.Cell>
                    <Table.Cell>
                    {new Date(review.createdAt).toLocaleDateString("en-GB")} {/* Display only the date */}
                    </Table.Cell>
                    <Table.Cell className="text-start">
                      {review.feedback}
                    </Table.Cell>
                    <Table.Cell className="flex justify-center items-center">
                      <button
                        onClick={() => {
                          setReviewIdToRespond(review._id);
                          setResponseText(review.response || "");
                          setModalOpen(true);
                        }}
                        className={
                          review.response
                            ? "text-red-500 hover:text-red-400"
                            : "text-yellow-400 hover:text-yellow-300"
                        }
                      >
                        {review.response ? (
                          <FaEdit className="size-6" />
                        ) : (
                          <BiSolidCommentDetail className="size-6" />
                        )}
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center">
                    No reviews found
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Response Modal */}
        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
          <Modal.Header>Respond to Review</Modal.Header>
          <Modal.Body>
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Type your response here..."
              className="w-full h-24 p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleRespond}>Reply</Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AdminReviews;