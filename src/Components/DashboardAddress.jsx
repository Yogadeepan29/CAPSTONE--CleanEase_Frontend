import React, { useEffect, useState } from "react";
import { Button, TextInput, Label, Card, Modal } from "flowbite-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { CiCirclePlus } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../Redux/Slice/userSlice";
import { HiTrash } from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import API_BASE_URL from "../apiConfig";

const DashboardAddress = () => {
  const dispatch = useDispatch();
  const { currentuser, loading, error } = useSelector((state) => state.user);
  const [isEditable, setIsEditable] = useState(false);
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
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Populate formData with existing address data when the component mounts
  useEffect(() => {
    if (
      currentuser &&
      currentuser.rest &&
      currentuser.rest.addresses.length > 0
    ) {
      const address = currentuser.rest.addresses[0];
      setFormData(address);
    }
  }, [currentuser]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
  
    // Validate required fields
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
      let response;
  
      // Prepare the request data
      const requestData = {
        ...(selectedAddressId ? { addressId: selectedAddressId } : {}),
        fullName,
        mobileNumber,
        doorNumber,
        streetName,
        area,
        city,
        pinCode,
        state,
      };
  
      // Check if we are updating or adding an address
      if (selectedAddressId) {
        // Update existing address
        response = await axios.put(
          `${API_BASE_URL}/user/update/address/${currentuser.rest._id}`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("Token"),
            },
          }
        );
      } else {
        // Add new address
        response = await axios.post(
          `${API_BASE_URL}/user/add/address/${currentuser.rest._id}`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("Token"),
            },
          }
        );
      }
  
      // Dispatch success action and show success message
      dispatch(updateSuccess(response.data));
      toast.success(
        selectedAddressId
          ? "Address Updated Successfully"
          : "Address Added Successfully"
      );
  
      // Reset form and close modal
      setIsEditable(false);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      // Handle error
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(updateFailure(errorMessage));
      toast.error(errorMessage);
    }
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
    setIsEditable(true);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/user/delete/address/${currentuser.rest._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
          data: { addressId }, // Axios uses `data` for the body of DELETE requests
        }
      );
  
      // Check if the response is successful
      if (response.status !== 200) {
        toast.error(`Error: ${response.status} - ${response.data.message || 'Unknown error'}`);
        return;
      }
  
      // Dispatch the success action with the response data
      dispatch(updateSuccess(response.data));
      toast.success("Address Deleted Successfully");
    } catch (error) {
      // Handle error
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      doorNumber: "",
      streetName: "",
      area: "",
      city: "",
      pinCode: "",
      state: "",
    });
    setSelectedAddressId(null);
    setIsEditable(true);
  };

  return (
    <div className="mx-auto p-4 w-full">
      <h1 className="my-7 text-center font-semibold text-4xl">
        Saved Addresses
      </h1>

      {currentuser.rest && currentuser.rest.addresses.length > 0 && (
        <div className="flex justify-end container mx-auto">
          <span
            className="mt-6 mb-5 cursor-pointer font-semibold "
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <CiCirclePlus className="h-6 w-6 inline" /> Add Another Address
          </span>
        </div>
      )}

      <section id="saved-addresses" className="flex gap-4">
        {currentuser.rest && currentuser.rest.addresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
            {currentuser.rest.addresses.map((address) => (
              <Card key={address._id} className="mb-4 h-full max-w-sm ">
                <div className="flex flex-col h-full p-4 ">
                  <div className="flex-grow break-words">
                    <h5 className="text-md font-bold mb-2">
                      {address.fullName}
                    </h5>
                    <p className="text-sm">
                      {address.doorNumber}, {address.streetName},
                    </p>
                    <p className="text-sm">
                      {address.area}, {address.city} - {address.pinCode},
                    </p>
                    <p className="text-sm">{address.state}</p>
                    <p className="text-sm">
                      Phone number: {address.mobileNumber}
                    </p>
                  </div>
                  <div className="flex justify-center gap-5 mt-4">
                    <Button
                      type="button"
                      className="w-full"
                      color="failure"
                      onClick={() => handleDeleteAddress(address._id)}
                    >
                      <div className="flex items-center gap-1">
                        <span>
                          <HiTrash />
                        </span>
                        <span> Delete</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      className="w-full"
                      outline
                      gradientDuoTone="redToYellow"
                      onClick={() => {
                        handleEditAddress(address);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          <FaPen />
                        </span>
                        <span> Edit</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mx-auto">
            <p className="text-center">
              You currently have no saved addresses.
            </p>
            <Button
              type="button"
              className="mt-6 mx-auto"
              outline
              gradientDuoTone="purpleToPink"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              Add New Address
            </Button>
          </div>
        )}
      </section>
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Add New Address</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col" onSubmit={handleSubmit}>
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
                  onChange={handleChange}
                  disabled={!isEditable}
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
                  onChange={handleChange}
                  disabled={!isEditable}
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
                  onChange={handleChange}
                  disabled={!isEditable}
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
                  onChange={handleChange}
                  disabled={!isEditable}
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
                  onChange={handleChange}
                  disabled={!isEditable}
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
                  onChange={handleChange}
                  disabled={!isEditable}
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
                  onChange={handleChange}
                  disabled={!isEditable}
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
                  onChange={handleChange}
                  disabled={!isEditable}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-6 w-full"
              gradientDuoTone={
                selectedAddressId ? "redToYellow" : "purpleToPink"
              }
              disabled={loading}
            >
              {selectedAddressId ? "Update Address" : "Add New Address"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default DashboardAddress;
