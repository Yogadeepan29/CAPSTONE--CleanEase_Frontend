import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Checkbox,
  Label,
  Spinner,
  Select,
  Textarea,
} from "flowbite-react";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaIndianRupeeSign } from "react-icons/fa6";
import API_BASE_URL from "../apiConfig";

// EditServiceModal component for editing service details
const EditServiceModal = ({
  isOpen,
  onClose,
  serviceToEdit,
  onServiceUpdated,
  services,
}) => {
  // State variables
  const [availableAddons, setAvailableAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to set form values when the modal opens
  useEffect(() => {
    if (isOpen && serviceToEdit) {
      formik.setValues({
        name: serviceToEdit.name || "",
        price: serviceToEdit.price || "",
        description: serviceToEdit.description || "",
        durationFrom: parseInt(serviceToEdit.duration.split("-")[0]) || 0,
        durationTo: parseInt(serviceToEdit.duration.split("-")[1]) || 1,
        idealFor: serviceToEdit.idealFor || "",
        productImg: serviceToEdit.productImg || "",
        enableSubscription: serviceToEdit.subscription || false,
        features: serviceToEdit.features || [],
      });
      setSelectedAddons(serviceToEdit.addons || []);
    }
  }, [isOpen, serviceToEdit]);

  // Effect to fetch available addons when the modal opens
  useEffect(() => {
    if (isOpen) {
      const allAddons =
        services?.flatMap((service) =>
          service.products.flatMap((product) => product.addons)
        ) || [];

      // Get unique addons based on their names
      const uniqueAddons = Array.from(
        new Set(allAddons.map((addon) => addon.name))
      ).map((name) => allAddons.find((addon) => addon.name === name));

      setAvailableAddons(uniqueAddons);
    }
  }, [isOpen, services]);

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      durationFrom: 0,
      durationTo: 1,
      idealFor: "",
      productImg: "",
      enableSubscription: false,
      features: ["", "", ""],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Service Name is required"),
      price: Yup.number()
        .required("Service Price is required")
        .positive("Price must be positive"),
      durationFrom: Yup.number()
        .min(0, "From value must be at least 0")
        .max(11, "From value must be at most 11")
        .required("From value is required"),
      durationTo: Yup.number()
        .min(1, "To value must be at least 1")
        .max(12, "To value must be at most 12")
        .required("To value is required"),
      description: Yup.string().required("Description is required"),
      idealFor: Yup.string().required("Ideal For is required"),
      productImg: Yup.string()
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
      try {
        const updatedServiceData = {
          name: values.name,
          price: parseFloat(values.price),
          description: values.description,
          duration: `${values.durationFrom}-${values.durationTo} hours`,
          idealFor: values.idealFor,
          productImg: values.productImg,
          enableSubscription: values.enableSubscription,
          features: values.features.filter((feature) => feature.trim() !== ""),
          addons: selectedAddons,
        };

        // Send updated service data to the server
        await axios.put(
          `${API_BASE_URL}/services/product/${serviceToEdit._id}/admin`,
          updatedServiceData
        );
        onServiceUpdated(); // Call the function to refresh the services
        onClose(); // Close the modal
      } catch (err) {
        console.error(err);
        alert("An error occurred while updating the service.");
      } finally {
        setIsLoading(false);
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

  // Handle feature input changes
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

  return (
    <Modal show={isOpen} onClose={onClose} popup size="xl">
      <Modal.Header />
      <Modal.Body>
        <div className="">
          <h3 className="mb-4 text-lg font-bold text-gray-500 text-center dark:text-gray-200">
            Edit Service
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4  items-center">
            <div>
              <Label htmlFor="service-name" className="block mb-1">
                Service Name
              </Label>
              <TextInput
                id="service-name"
                type="text"
                placeholder="Service Name"
                value={formik.values.name}
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
              />
              {formik.errors.name && (
                <span className="text-red-500">{formik.errors.name}</span>
              )}
            </div>
            <div>
              <Label htmlFor="service-price" className="block mb-1">
                Service Price
              </Label>
              <TextInput
                id="service-price"
                type="number"
                placeholder="Service Price"
                icon={FaIndianRupeeSign}
                value={formik.values.price}
                onChange={(e) => formik.setFieldValue("price", e.target.value)}
              />
              {formik.errors.price && (
                <span className="text-red-500">{formik.errors.price}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center  gap-4 mb-2">
            <div>
              <Label htmlFor="service-ideal-for" className="block mb-1 mt-5">
                Ideal For
              </Label>
              <TextInput
                id="service-ideal-for"
                type="text"
                placeholder="Ideal For"
                value={formik.values.idealFor}
                onChange={(e) =>
                  formik.setFieldValue("idealFor", e.target.value)
                }
                className="mb-4"
              />
              {formik.errors.idealFor && (
                <span className="text-red-500">{formik.errors.idealFor}</span>
              )}
            </div>
            <div>
              <span className="sm:mr-12 flex sm:inline font-semibold text-sm text-slate-400">
                Duration
              </span>
              <div className="flex gap-2 items-center mt-2">
                <Select
                  id="duration-from"
                  value={formik.values.durationFrom}
                  onChange={(e) =>
                    formik.setFieldValue("durationFrom", e.target.value)
                  }
                  className="w-1/2"
                >
                  {[...Array(12).keys()].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Select>
                <Label>-</Label>
                <Select
                  id="duration-to"
                  value={formik.values.durationTo}
                  onChange={(e) =>
                    formik.setFieldValue("durationTo", e.target.value)
                  }
                  className="w-1/2"
                >
                  {[...Array(13).keys()]
                    .filter((num) => num > formik.values.durationFrom)
                    .map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                </Select>
                <Label className="ml-2">hours</Label>
                {formik.errors.durationFrom && (
                  <span className="text-red-500">
                    {formik.errors.durationFrom}
                  </span>
                )}
                {formik.errors.durationTo && (
                  <span className="text-red-500">
                    {formik.errors.durationTo}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="service-img" className="block mb-1">
              Product Image URL
            </Label>
            <TextInput
              id="service-img"
              type="text"
              placeholder="Product Image URL"
              value={formik.values.productImg}
              onChange={(e) =>
                formik.setFieldValue("productImg", e.target.value)
              }
            />
            {formik.errors.productImg && (
              <span className="text-red-500">{formik.errors.productImg}</span>
            )}
          </div>
          <div>
            <Label htmlFor="service-description" className="block mt-3 mb-1">
              Service Description
            </Label>
            <Textarea
              id="service-description"
              type="text"
              placeholder="Service Description"
              value={formik.values.description}
              onChange={(e) =>
                formik.setFieldValue("description", e.target.value)
              }
              className="mb-4"
            />
            {formik.errors.description && (
              <span className="text-red-500">{formik.errors.description}</span>
            )}
          </div>

          <div>
            <Label className="mb-2 justify-center flex">Features</Label>
            <div className="grid grid-cols-2 gap-y-1 gap-x-2">
              {formik.values.features.map((feature, index) => (
                <div key={index}>
                  <TextInput
                    id={`feature-${index}`}
                    type="text"
                    placeholder={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="my-1"
                  />
                </div>
              ))}
              {formik.values.features.length < 6 && (
                <div
                  className="flex items-center text-yellow-400 justify-center gap-2 cursor-pointer mt-2 hover:text-green-400"
                  onClick={addFeature}
                >
                  <CiCirclePlus className="h-6 w-6 inline" />
                  <span className="whitespace-nowrap text-sm">Add Feature</span>
                </div>
              )}
            </div>
            {formik.errors.features && (
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
              onClick={formik.handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner color="warning" aria-label="Loading..." />
              ) : (
                "Update Service"
              )}
            </Button>
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditServiceModal;
