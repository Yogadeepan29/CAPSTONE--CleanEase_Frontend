import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Checkbox,
  Button,
  Rating,
  Breadcrumb,
  HR,
  Label,
  Spinner,
} from "flowbite-react";
import { GiVacuumCleaner } from "react-icons/gi";
import { HiShoppingCart } from "react-icons/hi";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCheckoutData } from "../../Redux/Slice/cartSlice";
import CustomerReviews from "../../Components/CustomerReviews";
import API_BASE_URL from "../../apiConfig";

const ServiceDetails = () => {
  const { category, productName } = useParams();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({});
  const cartItems = useSelector((state) => state.cart.items);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const storedToken = localStorage.getItem("Token");
    setToken(storedToken);

    axios
      .get(`${API_BASE_URL}/services/${category}/${productName}`)
      .then((response) => {
        setProduct(response.data);
        // Fetch reviews for the product
        return axios.get(`${API_BASE_URL}/review/${response.data._id}`);
      })
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [category, productName]);

  const handleAddonChange = (addon) => {
    setSelectedAddons((prev) => {
      const updatedAddons = { ...prev };
      if (updatedAddons[addon._id]) {
        delete updatedAddons[addon._id];
      } else {
        updatedAddons[addon._id] = addon;
      }
      return updatedAddons;
    });
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      const addonsArray = Object.keys(selectedAddons).map(
        (key) => selectedAddons[key]._id
      );
      const response = await axios.post(
        `${API_BASE_URL}/cart/add`,
        {
          productId: product._id,
          category: product.category,
          addons: addonsArray,
          prevAddons: addonsArray,
        },
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
            _id: product._id,
            category: product.category,
            name: product.name,
            addons: addonsArray,
            prevAddons: addonsArray,
            subscription: false,
          })
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      const addonsArray = Object.keys(selectedAddons).map((key) => {
        const addon = selectedAddons[key];
        return {
          id: addon._id,
          name: addon.name,
          price: addon.price,
        };
      });
      const subtotal =
        product.price +
        addonsArray.reduce((total, addon) => {
          return total + addon.price;
        }, 0);
      dispatch(
        setCheckoutData({
          items: [
            {
              productId: product._id,
              name: product.name,
              category: product.category,
              addons: addonsArray,
              prevaddons: addonsArray,
              subscription: false,
              subtotal: subtotal,
              price: product.price,
            },
          ],
          totalPrice: subtotal,
          selectedAddons: selectedAddons,
          subscription: "false",
          productDetails: { [product._id]: product },
          source: "serviceDetails",
        })
      );

      // Navigate to the checkout page
      navigate("/checkout");
    } catch (error) {
      console.error("Error proceeding to checkout:", error);
    }
  };

  //
  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.productId === productId);
  };
  //

  if (!product || !product.features) {
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center mb-20">
            <Spinner size="xl" aria-label="Center-aligned spinner example" />
            <p className="mt-4 font-normal dark:text-slate-300 text-black">
              Please wait
            </p>
          </div>
        </div>
      </>
    );
  }

  const handlePageChange = (direction) => {
    if (
      direction === "next" &&
      currentPage < Math.ceil(reviews.length / reviewsPerPage)
    ) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 min-h-screen">
      <Breadcrumb aria-label="Default breadcrumb example " className="mt-5  ">
        <Breadcrumb.Item icon={GiVacuumCleaner}>
          <Link
            to="/services"
            className="flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Services
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {" "}
          <span className="cursor-default text-xs sm:text-sm"> {category}</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {" "}
          <span className="font-bold text-gray-800 sm:text-sm  text-xs dark:text-gray-200 cursor-default">
            {product.name}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <main className=" sm:p-5 relative  md:top-0">
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
          <div className="max-w-screen-xl sm:px-4 mx-auto 2xl:px-0">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
              <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                <img className="w-full rounded-3xl " src={product.productImg} />

                <div className="details mt-8 grid justify-center items-center text-center lg:justify-start">
                  <h1 className="text-2xl  font-semibold sm:text-3xl text-green-600 dark:text-green-500 tracking-wide">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-4 ">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-500 ">
                      Start's at{" "}
                    </span>
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {" "}
                      ₹ {product.price}{" "}
                    </span>
                  </div>
                  <Rating className="pb-4 mt-2 flex items-center">
                    <Rating.Star />
                    {product.rating !== 0 && (
                      <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                        {product.rating.toFixed(1)}
                      </p>
                    )}

                    {product.reviews !== 0 && (
                      <>
                        <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
                        <div className="text-sm font-medium text-gray-90 0 underline hover:no-underline dark:text-white">
                          {product.reviews} reviews
                        </div>
                      </>
                    )}
                    {(product.rating === 0 || product.reviews === 0) && (
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        No reviews
                      </div>
                    )}
                  </Rating>
                </div>
                <div className="mt-6 sm:gap-4 sm:items-center justify-center flex flex-wrap gap-2 sm:mt-8">
                  <Button
                    outline
                    gradientDuoTone="purpleToBlue"
                    className="mb-3"
                    onClick={handleBuyNow}
                  >
                    <FaShoppingBag className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>

                  <Button
                    outline
                    gradientMonochrome="teal"
                    className={`mb-3 ${
                      isProductInCart(product._id) ? "cursor-default" : ""
                    } `}
                    onClick={handleAddToCart}
                    //
                    disabled={isProductInCart(product._id)}
                    //
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
                </div>

                <section className="customer-reviews hidden lg:inline">
                  <CustomerReviews
                    reviews={reviews}
                    currentPage={currentPage}
                    reviewsPerPage={reviewsPerPage}
                    onPageChange={handlePageChange}
                  />
                </section>
              </div>

              <div className="mt-6 sm:mt-8 lg:mt-0 ">
                {product.addons && product.addons.length > 0 ? (
                  <section className="additional-services ">
                    <div className="border rounded-3xl p-8 max-w-md lg:max-w-lg mx-auto bg-slate-100 dark:bg-gray-800 ">
                      <h2 className="text-xl sm:text-2xl mb-5 font-bold text-center text-green-600 dark:text-green-500 tracking-wide ">
                        Additional services
                      </h2>
                      <div className="addons">
                        {product.addons.map((addon, index) => (
                          <div key={index} className="flex flex-col mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Checkbox
                                  id={`addon-${index}`}
                                  name="addons"
                                  value={addon.name}
                                  onChange={() => handleAddonChange(addon)}
                                  className="cursor-pointer"
                                  checked={!!selectedAddons[addon._id]}
                                />
                                <Label
                                  htmlFor={`addon-${index}`}
                                  className=" text-sm sm:text-lg font-medium cursor-pointer text-blue-700 dark:text-blue-400"
                                >
                                  {addon.name}
                                </Label>
                              </div>
                              <span className="text-sm sm:text-lg text-gray-700 dark:text-gray-400 whitespace-nowrap">
                                ₹ {addon.price}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {addon.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                ) : null}

                <HR />
                <section className="description mt-6">
                  <h2 className="text-3xl mb-5 font-bold text-blue-600 dark:text-blue-500 tracking-wider ">
                    Product Description
                  </h2>
                  <p className="text-sm sm:text-lg ">{product.description}</p>
                </section>

                <section className="features mt-6">
                  <h2 className="text-3xl mb-5 font-bold text-blue-600 dark:text-blue-500 tracking-wider ">Features</h2>

                  <ul className="grid grid-cols-12 gap-2">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center col-span-12 md:col-span-6 lg:col-span-12 "
                      >
                        <div className="flex items-center gap-2">
                          <FaArrowRight className="text-lg text-yellow-500 dark:text-yellow-400 " />
                          <span className="text-sm sm:text-lg ps-2">
                            {feature}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="service-details mt-10">
                  <h2 className="text-3xl mb-5 font-bold text-blue-600 dark:text-blue-500 tracking-wider ">Service Details</h2>
                  <div className="grid grid-cols-3 max-w-md gap-3 mb-2 justify-center mx-auto p-2 text-sm sm:text-lg">
                    <div className="font-semibold ">Ideal For</div>
                    <div className="text-center">:</div>
                    <div>{product.idealFor}</div>
                    <div className="font-semibold">Service Type</div>
                    <div className="text-center">:</div>
                    <div>{category}</div>
                    <div className="font-semibold">Service Duration</div>
                    <div className="text-center">:</div>
                    <div>{product.duration}</div>
                  </div>
                </section>

                <section className="customer-reviews lg:hidden w-full mt-10">
                  <CustomerReviews
                    reviews={reviews}
                    currentPage={currentPage}
                    reviewsPerPage={reviewsPerPage}
                    onPageChange={handlePageChange}
                  />
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServiceDetails;
