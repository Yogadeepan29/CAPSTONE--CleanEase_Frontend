import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Select,
  TextInput,
  Checkbox,
  Label,
  Textarea,
  Spinner
} from "flowbite-react";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaIndianRupeeSign } from "react-icons/fa6";
import API_BASE_URL from "../apiConfig";

// AddServiceModal component for adding a new service
const AddServiceModal = ({ isOpen, onClose, services, onServiceAdded }) => {
  const [availableAddons, setAvailableAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

    // Effect to fetch available addons when the modal opens
  useEffect(() => {
    if (isOpen) {
      const allAddons = services.flatMap((service) =>
        service.products.flatMap((product) => product.addons)
      );

      const uniqueAddons = Array.from(
        new Set(allAddons.map((addon) => addon.name))
      ).map((name) => allAddons.find((addon) => addon.name === name));

      setAvailableAddons(uniqueAddons);
    }
  }, [isOpen, services]);

    // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      newServiceCategory: "",
      newCategory: "",
      newServiceName: "",
      newServicePrice: "",
      newServiceDescription: "",
      newServiceDurationFrom: 0, 
      newServiceDurationTo: 1,
      newServiceIdealFor: "",
      newServiceImg: "",
      enableSubscription: false,
      features: ["", ""],
    },
    validationSchema: Yup.object({
      newServiceCategory: Yup.string().required("Category is required"),
      newServiceName: Yup.string().required("Service Name is required"),
      newServicePrice: Yup.number()
        .required("Service Price is required")
        .positive("Price must be positive"),
      newServiceDurationFrom: Yup.number()
        .min(0, "From value must be at least 0")
        .max(11, "From value must be at most 11")
        .required("From value is required"),
      newServiceDurationTo: Yup.number()
        .min(1, "To value must be at least 1")
        .max(12, "To value must be at most 12")
        .required("To value is required"),
      newServiceDescription: Yup.string().required("Description is required"),
      newServiceIdealFor: Yup.string().required("Ideal For is required"),
      newServiceImg: Yup.string()
        .url("Must be a valid URL")
        .required("Image URL is required"),
      features: Yup.array()
        .of(Yup.string().nullable())
        .test(
          "at-least-two",
          "At least two features are required",
          (features) => {
            return (
              features.filter((feature) => feature && feature.trim() !== "")
                .length >= 2
            );
          }
        ),
    }),
    onSubmit: async (values) => {
      setIsLoading(true); 
      setIsSubmitted(false);
      try {
        const newService = {
          category:
            values.newServiceCategory === "createNew"
              ? values.newCategory
              : values.newServiceCategory,
          products: [
            {
              name: values.newServiceName,
              price: parseFloat(values.newServicePrice),
              description: values.newServiceDescription,
              duration: `${values.newServiceDurationFrom}-${values.newServiceDurationTo} hours`,
              idealFor: values.newServiceIdealFor,
              productImg: values.newServiceImg,
              enableSubscription: values.enableSubscription,
              subscription: values.enableSubscription,
              category:
                values.newServiceCategory === "createNew"
                  ? values.newCategory
                  : values.newServiceCategory,
              features: values.features.filter(
                (feature) => feature.trim() !== ""
              ),
              addons: selectedAddons,
            },
          ],
        };

           // Send POST request to add the new service
        await axios.post(`${API_BASE_URL}/services`, newService);
        onServiceAdded();
        onClose();

        formik.resetForm();
        setSelectedAddons([]);
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.message ||
            "An error occurred while adding the service"
          : "An unexpected error occurred. Please try again.";

        console.error(errorMessage);
        alert(errorMessage);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    },
  });

  // Handle addon selection
  const handleAddonChange = (addon) => {
    const addonId = addon._id;
    if (selectedAddons.some((selected) => selected._id === addonId)) {
      setSelectedAddons(
        selectedAddons.filter((selected) => selected._id !== addonId)
      );
    } else {
      if (selectedAddons.length < 6) {
        setSelectedAddons([...selectedAddons, addon]);
      }
    }
  };

   // Handle feature input change
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formik.values.features];
    updatedFeatures[index] = value;
    formik.setFieldValue("features", updatedFeatures);
  };

    // Add a new feature input
  const addFeature = () => {
    if (formik.values.features.length < 6) {
      formik.setFieldValue("features", [...formik.values.features, ""]);
    }
  };

  // Handle modal close and reset form
  const handleClose = () => {
    formik.resetForm(); // Reset the form when closing the modal
    setSelectedAddons([]); // Clear selected addons
    onClose(); // Call the original onClose function
  };

  return (
    <Modal show={isOpen} onClose={handleClose} popup size="xl">
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-4 text-lg font-bold text-gray-500 dark:text-gray-200">
            Add New Service
          </h3>
          <div className="flex items-center justify-end mb-2">
            <Checkbox
              id="enable-subscription"
              checked={formik.values.enableSubscription}
              onChange={() =>
                formik.setFieldValue(
                  "enableSubscription",
                  !formik.values.enableSubscription
                )
              }
            />
            <Label htmlFor="enable-subscription" className="ml-2">
              Enable Subscription
            </Label>
          </div>
          <Label>Category</Label>
          <Select
            value={formik.values.newServiceCategory}
            onChange={(e) => {
              formik.setFieldValue("newServiceCategory", e.target.value);
              if (e.target.value === "createNew") {
                formik.setFieldValue("newCategory", "");
              }
            }}
            className="my-2"
          >
            <option value="" disabled>
              Select Category
            </option>
            {services.map((service) => (
              <option key={service._id} value={service.category}>
                {service.category}
              </option>
            ))}
            <option value="createNew">Create New Category</option>
          </Select>
          {formik.values.newServiceCategory === "createNew" && (
            <TextInput
              id="new-category"
              type="text"
              placeholder="New Category Name"
              value={formik.values.newCategory}
              onChange={(e) =>
                formik.setFieldValue("newCategory", e.target.value)
              }
              className="mb-4"
            />
          )}

          <Label>Service Details</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div>
              <TextInput
                id="new-service-name"
                type="text"
                placeholder="Service Name"
                className="mb-2"
                value={formik.values.newServiceName}
                onChange={(e) =>
                  formik.setFieldValue("newServiceName", e.target.value)
                }
              />
              {isSubmitted && formik.errors.newServiceName && (
                <span className="text-red-500">
                  {formik.errors.newServiceName}
                </span>
              )}
              <TextInput
                id="new-service-price"
                type="number"
                icon={FaIndianRupeeSign}
                placeholder="Service Price"
                value={formik.values.newServicePrice}
                onChange={(e) =>
                  formik.setFieldValue("newServicePrice", e.target.value)
                }
              />
              {isSubmitted && formik.errors.newServicePrice && (
                <span className="text-red-500">
                  {formik.errors.newServicePrice}
                </span>
              )}
            </div>
            <div>
              <span className="sm:mr-12 flex sm:inline font-semibold text-sm text-slate-400">
                Duration
              </span>
              <div className="flex gap-2 items-center mt-2">
                <Select
                  id="new-service-duration-from"
                  value={formik.values.newServiceDurationFrom}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "newServiceDurationFrom",
                      e.target.value
                    )
                  }
                  className="w-1/2 "
                >
                  {[...Array(12).keys()].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Select>
                <Label>-</Label>
                <Select
                  id="new-service-duration-to"
                  value={formik.values.newServiceDurationTo}
                  onChange={(e) =>
                    formik.setFieldValue("newServiceDurationTo", e.target.value)
                  }
                  className="w-1/2"
                >
                  {[...Array(13).keys()]
                    .filter((num) => num > formik.values.newServiceDurationFrom)
                    .map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                </Select>
                <Label className="ml-2">hours</Label>
                {isSubmitted && formik.errors.newServiceDurationFrom && (
                  <span className="text-red-500">
                    {formik.errors.newServiceDurationFrom}
                  </span>
                )}
                {isSubmitted && formik.errors.newServiceDurationTo && (
                  <span className="text-red-500">
                    {formik.errors.newServiceDurationTo}
                  </span>
                )}
              </div>
            </div>
          </div>

          <TextInput
            id="new-service-img"
            type="text"
            placeholder="Product Image URL"
            className="mb-2"
            value={formik.values.newServiceImg}
            onChange={(e) =>
              formik.setFieldValue("newServiceImg", e.target.value)
            }
          />
          {isSubmitted && formik.errors.newServiceImg && (
            <span className="text-red-500">{formik.errors.newServiceImg}</span>
          )}

          <Textarea
            id="new-service-description"
            type="text"
            placeholder="Service Description"
            value={formik.values.newServiceDescription}
            onChange={(e) =>
              formik.setFieldValue("newServiceDescription", e.target.value)
            }
            className="mb-2"
          />
          {isSubmitted && formik.errors.newServiceDescription && (
            <div className="text-red-500 mb-2">
              {formik.errors.newServiceDescription}
            </div>
          )}

          <TextInput
            id="new-service-idealFor"
            type="text"
            placeholder="Ideal For"
            value={formik.values.newServiceIdealFor}
            onChange={(e) =>
              formik.setFieldValue("newServiceIdealFor", e.target.value)
            }
            className="mb-2"
          />
          {isSubmitted && formik.errors.newServiceIdealFor && (
            <div className="text-red-500 mb-2">
              {formik.errors.newServiceIdealFor}
            </div>
          )}

          <div>
            <Label className="mb-2">Features</Label>
            <div className="grid grid-cols-2 gap-2">
              {formik.values.features.map((feature, index) => (
                <TextInput
                  key={index}
                  id={`feature-${index}`}
                  type="text"
                  placeholder={`Feature ${index + 1}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="my-2"
                />
              ))}
              {formik.values.features.length < 6 && (
                <div
                  className="flex items-center text-yellow-400 justify-center gap-2 cursor-pointer mt-2 hover:text-green-400"
                  onClick={addFeature}
                >
                  <CiCirclePlus className="h-6 w-6 inline" />
                  <span className="whitespace-nowrap text-sm ">
                    Add Feature
                  </span>
                </div>
              )}
            </div>
            {isSubmitted && formik.errors.features && (
              <div className="text-red-500">{formik.errors.features}</div>
            )}
          </div>

          <div className="my-4">
            <Label className="mb-2">Select Addons (3-6 required)</Label>
            <div className="max-h-40 overflow-auto border border-gray-500 rounded-md mt-3 p-4 scrollbar-hide">
              {availableAddons.map((addon) => (
                <div key={addon._id} className="flex items-center">
                  <Checkbox
                    id={addon._id}
                    checked={selectedAddons.some(
                      (selected) => selected._id === addon._id
                    )}
                    onChange={() => handleAddonChange(addon)}
                  />
                  <Label
                    htmlFor={addon._id}
                    className="ml-2 flex justify-between p-1 w-full"
                  >
                    <span>{addon.name}</span>
                    <span>₹{addon.price.toFixed(2)}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-5">
            <Button
              color="success"
              onClick={() => {
                setIsSubmitted(true); 
                formik.handleSubmit();
              }}
              disabled={isLoading} 
            >
              {isLoading ? (
                <Spinner color="warning" aria-label="Loading..." />
              ) : (
                "Add Service"
              )}
            </Button>
            <Button color="gray" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddServiceModal;