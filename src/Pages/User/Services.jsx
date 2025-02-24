import React, { useState, useEffect } from "react";
import Filter from "../../Components/Filter";
import { Badge, Button, HR, Rating } from "flowbite-react";
import { HiShoppingCart } from "react-icons/hi";
import axios from "axios";
import { Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCheckoutData } from "../../Redux/Slice/cartSlice";
import API_BASE_URL from "../../apiConfig";

const Services = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [token, setToken] = useState(null);
  //
  const cartItems = useSelector((state) => state.cart.items);
  //

  useEffect(() => {
    const storedToken = localStorage.getItem("Token");
    setToken(storedToken);
    dispatch(clearCheckoutData());

    axios
      .get(`${API_BASE_URL}/services`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleFilterChange = (filteredData) => {
    setFilteredData(filteredData);
  };

  const handleAddToCart = async (productId, category) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/add`,
        { productId, category, addons: [], prevAddons: [] },
        {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      );
      if (response.data.success) {
        dispatch(
          addToCart({
            _id: productId,
            category,
            addons: [],
            prevAddons: [],
            subscription: false,
          })
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  //
  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.productId === productId);
  };
  //
  return (
    <div className="min-h-screen">
      <div className="md:flex md:flex-row justify-center">
        <div className="md:w-2/10 md:min-h-screen ">
          <Filter
            onCategoryChange={handleCategoryChange}
            selectedCategories={selectedCategories}
            data={data}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="md:w-8/10 container p-4 relative top-20 md:top-0">
          {filteredData.length > 0 ? (
            filteredData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-14">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold my-10">
                  {category.category}
                </h1>

                <div className="grid grid-cols-1  sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-3 sm:ms-10">
                  {category.products.map((product, productIndex) => (
                    <Card
                      key={productIndex}
                      className="max-w-sm mx-auto mb-4 hover:text-green-400 hover:scale-105 transition duration-300 ease-in-out cursor:pointer "
                      imgAlt="Services-Product Image"
                      imgSrc={
                        product.productImg
                          ? product.productImg
                          : "/Images/test.png"
                      }
                    >
                      <Link
                        to={`/services/${category.category}/${product.name}`}
                        key={productIndex}
                        className="h-full w-full"
                      >
                        <h5 className="text-xl lg:text-2xl font-bold title pb-5">
                          {product.name}
                        </h5>
                        <Rating className="pb-4">
                          <Rating.Star />
                          {product.rating !== 0 && (
                            <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                              {product.rating.toFixed(1)}
                            </p>
                          )}

                          {product.reviews !== 0 && (
                            <>
                              <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
                              <div className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">
                                {product.reviews} reviews
                              </div>
                            </>
                          )}
                          {(product.rating === 0 || product.reviews === 0) && (
                            <div className="text-sm font-meduim text-gray-900 dark:text-white">
                              No reviews
                            </div>
                          )}
                        </Rating>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            Start's at{" "}
                          </span>
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {" "}
                            ₹{product.price}{" "}
                          </span>
                        </div>

                        <div className="flex flex-col h-full py-2 ">
                          <p>
                            {" "}
                            <span className="font-semibold  text-gray-900 dark:text-white">
                              Duration:
                            </span>{" "}
                            <span className=" text-gray-900 dark:text-white">
                              {product.duration}
                            </span>
                          </p>
                          <p>
                            {" "}
                            <span className="font-semibold  text-gray-900 dark:text-white">
                              Ideal for:
                            </span>{" "}
                            <span className=" text-gray-900 dark:text-white">
                              {product.idealFor}
                            </span>
                          </p>
                        </div>
                      </Link>

                      <Button
                        outline
                        gradientMonochrome="success"
                        className={`w-full ${
                          isProductInCart(product._id) ? "cursor-default" : ""
                        } `}
                        onClick={() =>
                          handleAddToCart(product._id, category.category)
                        }
                        disabled={isProductInCart(product._id)}
                      >
                        {isProductInCart(product._id) ? (
                          <>
                            <HiShoppingCart className="mr-2 h-5 w-5" />
                            Already in Cart
                          </>
                        ) : (
                          <>
                            <HiShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                          </>
                        )}
                      </Button>

                      <ul className="mt-2 ml-auto gap-4 flex">
                        {product.bestseller ? (
                          <li className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org /2000/svg"
                              width={24}
                              height={24}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m7.171 12.906-2.153 6.411 2.672-.89 1.568 2.34 1.825-5.183m5.73-2.678 2.154 6.411-2.673-.89-1.568 2.34-1.825-5.183M9.165 4.3c.58.068 1.153-.17 1.515-.628a1.681 1.681 0 0 1 2.64 0 1.68 1.68 0 0 0 1.515.628 1.681 1.681 0 0 1 1.866 1.866c-.068.58.17 1.154.628 1.516a1.681 1.681 0 0 1 0 2.639 1.682 1.682 0 0 0-.628 1.515 1.681 1.681 0 0 1-1.866 1.866 1.681 1.681 0 0 0-1.516.628 1.681 1.681 0 0 1-2.639 0 1.681 1.681 0 0 0-1.515-.628 1.681 1.681 0 0 1-1.867-1.866 1.681 1.681 0 0 0-.627-1.515 1.681 1.681 0 0 1 0-2.64c.458-.361.696-.935.627-1.515A1.681 1.681 0 0 1 9.165 4.3ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Best Seller
                            </p>
                          </li>
                        ) : product.rating === 0 ? (
                          <li>
                            <Badge
                              className="flex w-12 ml-auto rounded-lg"
                              size="sm"
                              color="info"
                            >
                              New
                            </Badge>
                          </li>
                        ) : (
                          <div className="mt-3 p-2"></div>
                        )}
                      </ul>
                    </Card>
                  ))}
                </div>
                <HR />
              </div>
            ))
          ) : (
            <div className="h-screen text-4xl pb-20  flex justify-center items-center">
              <h1 className="pb-20 mb-20">Oops😓,No Services Found </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
