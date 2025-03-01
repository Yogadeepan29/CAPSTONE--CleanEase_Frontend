import {
  Breadcrumb,
  Button,
  Card,
  Label,
  TextInput,
  Checkbox,
  HR,
  Modal,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CiCirclePlus } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import { FaPen } from "react-icons/fa";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../../Redux/Slice/userSlice";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { updateServiceAddress } from "../../Redux/Slice/cartSlice";
import API_BASE_URL from "../../apiConfig";

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddressIds, setSelectedAddressIds] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    doorNumber: "",
    streetName: "",
    area: "",
    city: "",
    pinCode: "",
    state: "",
  });
  const checkoutData = useSelector((state) => state.cart.checkoutData);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check if checkoutData is empty
    if (checkoutData.items.length === 0) {
      navigate("/services"); // Redirect to services page
    }
  }, [checkoutData, navigate]);

  const handleAddressSelect = (addressId, serviceIndex) => {
    if (isUpdating) return;
    if (selectedAddressIds[serviceIndex] === addressId) return;
    setIsUpdating(true);
    setSelectedAddressIds((prev) => ({
      ...prev,
      [serviceIndex]: addressId,
    }));

    dispatch(updateServiceAddress({ serviceIndex, addressId }));

    setTimeout(() => {
      if (serviceIndex < checkoutData.items.length - 1) {
        setCurrentServiceIndex((prev) => prev + 1);
      }
      setIsUpdating(false);
    }, 400);
  };

  const handleEditAddress = (address) => {
    setFormData({
      fullName: address.fullName,
      mobileNumber: address.mobileNumber,
      doorNumber: address.doorNumber,
      streetName: address.streetName,
      area: address.area,
      city: address.city,
      pinCode: address.pinCode,
      state: address.state,
    });
    setSelectedAddressId(address._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      fullName,
      mobileNumber,
      doorNumber,
      streetName,
      area,
      city,
      pinCode,
      state,
    } = formData;

    if (
      !fullName ||
      !mobileNumber ||
      !doorNumber ||
      !streetName ||
      !area ||
      !city ||
      !pinCode ||
      !state
    ) {
      toast.error("All address fields are required.");
      return;
    }

    try {
      dispatch(updateStart());
      const response = await fetch(
        `${API_BASE_URL}/user/update/address/${currentuser.rest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
          body: JSON.stringify({
            addressId: selectedAddressId,
            fullName,
            mobileNumber,
            doorNumber,
            streetName,
            area,
            city,
            pinCode,
            state,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Error: ${response.status} - ${errorText}`);
        dispatch(updateFailure(`Error: ${response.status}`));
        return;
      }

      const data = await response.json();
      dispatch(updateSuccess(data));
      toast.success("Address Updated Successfully");
      setIsModalOpen(false);
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout/slot");
  };

  const handleNextService = () => {
    if (currentServiceIndex < checkoutData.items.length - 1) {
      setCurrentServiceIndex((prev) => prev + 1);
    }
  };

  const handlePreviousService = () => {
    if (currentServiceIndex > 0) {
      setCurrentServiceIndex((prev) => prev - 1);
    }
  };

  const allAddressesSelected =
    Object.keys(selectedAddressIds).length === checkoutData.items.length &&
    Object.values(selectedAddressIds).every((id) => id !== undefined);

  return (
    <>
      <section className=" mx-auto container min-h-screen antialiased dark:bg-gray-900 ">
        <div className="mx-auto top-20 max-w-screen-xl p-4 2xl:px-0 mt-10 sm:mt-5">
          <h2 className="text-3xl md:text-5xl text-center font-semibold text-blue-600 dark:text-blue-500 ">
            Checkout{" "}
          </h2>
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <Breadcrumb
                aria-label="Default breadcrumb example "
                className="my-5  "
              >
                <Breadcrumb.Item>
                  {checkoutData.source === "cart" ? (
                    <Link
                      to="/cart"
                      className="flex items-center cursor-default text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      Cart
                    </Link>
                  ) : (
                    <span className="cursor-default"> Checkout</span>
                  )}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {" "}
                  <span className="font-bold text-gray-800  dark:text-gray-200 cursor-default">
                    Service Address
                  </span>{" "}
                </Breadcrumb.Item>
              </Breadcrumb>
              {currentuser.rest && currentuser.rest.addresses.length > 0 ? (
                <Card className="mt-4 border border-gray-700 bg-gray-50 dark:border-gray-400 dark:bg-gray-800">
                  <div className="text-center font-bold text-2xl md:text-3xl text-green-500 dark:text-green-400">
                    <h1>Service Address</h1>
                  </div>
                  {checkoutData.items.length > 1 && (
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={handlePreviousService}
                        pill
                        outline
                        disabled={currentServiceIndex === 0}
                        className=""
                      >
                        <span className="text-2xl">
                          <HiOutlineArrowLeft />
                        </span>
                      </Button>
                      <h5 className="flex-1 text-center text-xl font-semibold text-green-400 transition-transform  duration-300 scale-110">
                        {
                          checkoutData.productDetails[
                            checkoutData.items[currentServiceIndex].productId
                          ].name
                        }
                      </h5>
                      <Button
                        onClick={handleNextService}
                        pill
                        outline
                        disabled={
                          currentServiceIndex === checkoutData.items.length - 1
                        }
                        className=""
                      >
                        <span className="text-2xl">
                          <HiOutlineArrowRight />
                        </span>
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-col gap-2  items-start ">
                    {currentuser.rest.addresses.map((address) => (
                      <div key={address._id} className="w-full px-2">
                        <div
                          className={`flex items-center justify-between gap-3 transition-transform  duration-300  ${
                            selectedAddressIds[currentServiceIndex] ===
                            address._id
                              ? "scale-105 border-2  border-green-400 "
                              : ""
                          } rounded-lg p-2`}
                        >
                          <Checkbox
                            id={address._id}
                            checked={
                              selectedAddressIds[currentServiceIndex] ===
                              address._id
                            }
                            onChange={() =>
                              handleAddressSelect(
                                address._id,
                                currentServiceIndex
                              )
                            }
                            className="mr-2"
                          />
                          <Label htmlFor={address._id} className="flex-1">
                            <span className="font-bold text-lg">
                              {address.fullName.toUpperCase()}
                            </span>{" "}
                            <br />
                            <span className="font-normal flex-grow break-words">
                              {address.doorNumber}, {address.streetName},{" "}
                              {address.area}, {address.city}, {address.state} -{" "}
                              {address.pinCode} <br />
                            </span>
                            <span> Phone Number - {address.mobileNumber} </span>
                          </Label>
                          <Link
                            as="Button"
                            className="font-bold text-blue-400 dark:text-yellow-300 flex justify-end whitespace-nowrap text-sm "
                            onClick={() => handleEditAddress(address)}
                          >
                            | Edit |
                          </Link>
                        </div>
                        <HR className="my-3" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end ">
                    <Link
                      to="/user/dashboard?tab=address"
                      className="cursor-pointer font-semibold hover:text-blue-500"
                    >
                      <CiCirclePlus className="h-6 w-6 inline" /> Add New
                      Address
                    </Link>
                  </div>
                </Card>
              ) : (
                <Card className="mt-4 p-4 border border-gray-700 bg-gray-50 dark:border-gray-400 dark:bg-gray-800">
                  <h3 className="text-xl font-semibold">No Address Found</h3>
                  <p>You currently have no saved addresses.</p>
                  <Link
                     to="/user/dashboard?tab=address"
                    className="text-green-500 font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <CiCirclePlus className="h-6 w-6 inline " />
                      <span>Add New Address</span>
                    </div>
                  </Link>
                </Card>
              )}
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:pt-5 lg:w-full lg:sticky lg:top-20  lg:self-start">
              <Card className="space-y-4 rounded-lg border border-gray-700 bg-gray-50 p-4 shadow-sm dark:border-gray-400 dark:bg-gray-800 sm:p-6 ">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Order summary
                </p>
                <div className="space-y-4">
                  <h2 className="font-semibold text-sm ">
                    Selected Services :
                  </h2>
                  <div className="flex flex-col space-y-2 ">
                    {checkoutData.items.map((item) => {
                      const productDetail =
                        checkoutData.productDetails[item.productId]; // Access product details safely
                      return (
                        <div
                          key={item.productId}
                          className="flex justify-between"
                        >
                          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {productDetail
                              ? productDetail.name
                              : "Product details not available"}
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹&nbsp;{item.subtotal}
                          </p>
                        </div>
                      );
                    })}

                    {checkoutData.items.some(
                      (item) => item.addons.length > 0
                    ) && (
                      <div className="text-sm font-normal text-red-600 flex items-center mt-4">
                        <span className="mr-2 text-xl">*</span>
                        <p>Including Additional services</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                    <p className="text-xl font-bold  text-gray-900 dark:text-white">
                      Total
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹&nbsp;{checkoutData.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4 text-sm font-normal text-red-600 flex items-center">
                    <span className="mr-2 text-xl">*</span>
                    <p>Final pricing may vary based on room/area size, etc.</p>
                  </div>
                </div>
                <div className="flex  items-center justify-center gap-2 mt-2">
                  {allAddressesSelected ? (
                    <Button
                      className="flex w-full items-center gap-2 justify-center align-center p-0.5"
                      outline
                      gradientDuoTone="cyanToBlue"
                      type="submit"
                      onClick={handleCheckout}
                    >
                      <div className="text-lg flex text-center align-center items-center gap-2">
                        <span> Use This Address</span>{" "}
                        <span className="mt-1 text-xl">
                          <HiOutlineArrowRight />
                        </span>
                      </div>
                    </Button>
                  ) : (
                    <Button
                      className="flex w-full items-center gap-2 justify-center align-center p-0.5 cursor-default"
                      outline
                      gradientDuoTone="grayToBlack"
                      type="submit"
                      disabled
                    >
                      <div className="text-lg flex text-center align-center items-center gap-2">
                        Select Address
                      </div>
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>
          <div className="flex gap-2 items-center">
            Edit Address <FaPen size={15} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {/* Full Name and Mobile Number Fields Side by Side */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="flex-1">
                <Label
                  htmlFor="fullName"
                  value="Full Name (First and Last Name)"
                />
                <TextInput
                  type="text"
                  id="fullName"
                  placeholder="Enter Your Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="mobileNumber" value="Mobile Number" />
                <TextInput
                  type="text"
                  id="mobileNumber"
                  placeholder="Enter Your Contact Number"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
            </div>

            {/* House No. and Street Name Fields Side by Side */}
            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              <div className="flex-1 sm:flex-none">
                <Label htmlFor="doorNumber" value="Flat, House no., Company" />
                <TextInput
                  type="text"
                  id="doorNumber"
                  placeholder="House / Flat / Office No."
                  value={formData.doorNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, doorNumber: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div className="flex-1 sm:flex-none">
                <Label htmlFor="streetName" value="Street" />
                <TextInput
                  type="text"
                  id="streetName"
                  placeholder="Enter Your Street Name"
                  value={formData.streetName}
                  onChange={(e) =>
                    setFormData({ ...formData, streetName: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div className="flex-1 sm:flex-none">
                <Label htmlFor="area" value="Area" />
                <TextInput
                  type="text"
                  id="area"
                  placeholder="Enter Your Area"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
            </div>

            {/* Area, City, and State Fields - Full Width on Small Screens and Side by Side on Medium Screens and Above */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 sm:flex-none">
                <Label htmlFor="city" value="City" />
                <TextInput
                  type="text"
                  id="city"
                  placeholder="Enter Your City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div className="flex-1 sm:flex-none">
                <Label htmlFor="pinCode" value="Pincode" />
                <TextInput
                  type="text"
                  id="pinCode"
                  placeholder="Enter Your Pincode"
                  value={formData.pinCode}
                  onChange={(e) =>
                    setFormData({ ...formData, pinCode: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div className="flex-1 sm:flex-none">
                <Label htmlFor="state" value="State" />
                <TextInput
                  type="text"
                  id="state"
                  placeholder="Enter Your State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              gradientDuoTone="redToYellow"
              className="mt-6 w-full"
            >
              Update Address
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
};

export default CheckoutAddress;
