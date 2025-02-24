import React, { useState } from "react";
import { Avatar, Button, Rating, Dropdown } from "flowbite-react";
import { format } from "date-fns";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";

const CustomerReviews = ({
  reviews,
  currentPage,
  reviewsPerPage,
  onPageChange,
}) => {
  const [sortOption, setSortOption] = useState("Sort by");
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "Positive") {
      return b.rating - a.rating; // Sort by rating descending
    } else if (sortOption === "Negative") {
      return a.rating - b.rating; // Sort by rating ascending
    } else {
      // Default: Sort by most recent (latest createdAt at the top)
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  return (
    <div className="border rounded-3xl p-4 max-w-full mx-auto mt-10 overflow-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Customer Reviews</h2>
        {currentReviews.length > 0 && (
          <Dropdown label={sortOption} inline>
            <Dropdown.Item onClick={() => setSortOption("Recent")}>
              Recent
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("Positive")}>
              Positive first
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("Negative")}>
              Negative first
            </Dropdown.Item>
          </Dropdown>
        )}
      </div>
      {currentReviews.length > 0 ? (
        <div className="grid gap-4 mt-3">
          {currentReviews.map((review) => {
            const hasUserId = review.userId && review.userId._id;
            return (
              <div
                key={review._id}
                className="flex flex-col p-3 rounded border-b gap-3"
              >
                <div className="flex items-start gap-3 ">
                  <Avatar
                    img={hasUserId ? review.userId.profilePicture : null}
                    onError={(e) => {
                      e.target.src =
                        "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png";
                    }}
                    rounded
                    size="sm"
                  />
                  <div className="flex flex-col w-full">
                    <Rating>
                      {[...Array(5)].map((_, index) => (
                        <Rating.Star
                          key={index}
                          className={
                            index < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </Rating>
                    <div className="flex items-center justify-between ">
                      <p className="font-semibold">
                        {hasUserId ? review.userId.username : "Old User"}
                      </p>

                      {hasUserId && (
                        <div className="flex items-center  gap-1">
                          <BsPatchCheckFill className="text-blue-600" />
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            Verified purchase
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      {format(new Date(review.createdAt), "dd/MM/yyyy")}
                    </p>

                    <p className="mt-2 ml-4 text-sm">{review.feedback}</p>
                  </div>
                </div>

                {/* Admin Response Section */}
                {review.response && (
                  <div className="ml-10 mt-2 p-3 border-l-4 border-blue-500 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-start gap-3">
                    <Avatar
                      img="/dust.png" // Placeholder for Admin Avatar
                      rounded
                      size="sm"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                        Clean Ease
                      </p>
                      <p className="text-sm ml-2 text-gray-700 dark:text-gray-300">
                        {review.response}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center mt-5">No reviews yet.</p>
      )}

      {/* Pagination with Previous and Next Buttons */}
      {reviews.length > 0 && (
        <div
          className={`mt-6 sm:flex text-center items-center ${
            reviews.length <= 5 ? "justify-center" : "justify-between"
          }`}
        >
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {indexOfFirstReview + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(indexOfLastReview, reviews.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {reviews.length}
            </span>{" "}
            Entries
          </p>
          {/* Show pagination buttons only if there are more than 5 reviews */}
          {reviews.length > reviewsPerPage && (
            <div className="sm:flex mt-2 sm:mt-0 space-x-2">
              <Button.Group>
                <Button
                  onClick={() => onPageChange("prev")}
                  disabled={currentPage === 1}
                  color="light"
                  pill
                >
                  <div className="flex items-center gap-1">
                    <span>
                      <FaAngleLeft />
                    </span>
                    <span>Previous</span>
                  </div>
                </Button>
                <Button
                  onClick={() => onPageChange("next")}
                  disabled={
                    currentPage === Math.ceil(reviews.length / reviewsPerPage)
                  }
                  color="light"
                  pill
                >
                  <div className="flex items-center gap-1 ">
                    <span>Next</span>
                    <span className="mt-0.5">
                      <FaAngleRight />
                    </span>
                  </div>
                </Button>
              </Button.Group>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
