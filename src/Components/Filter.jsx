import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Sidebar,
  Checkbox,
  Label,
  TextInput,
  Modal,
  Navbar,
} from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { HiAdjustments } from "react-icons/hi";

// Filter component for filtering services based on categories, price, and duration
const Filter = ({
  onCategoryChange,
  selectedCategories,
  data,
  onFilterChange,
}) => {
   // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const priceFromRef = useRef(null);
  const priceToRef = useRef(null);
  const [selectedTimings, setSelectedTimings] = useState([]);

    // Handle timing checkbox changes
  const handleTimingChange = (event) => {
    const timing = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedTimings([...selectedTimings, timing]);
    } else {
      setSelectedTimings(selectedTimings.filter((t) => t !== timing));
    }
  };

    // Handle category checkbox changes
  const handleCategoryChange = (event) => {
    const category = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      onCategoryChange([...selectedCategories, category]);
    } else {
      onCategoryChange(selectedCategories.filter((cat) => cat !== category));
    }
  };

    // Handle search input changes
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

   // Apply price filter and close the modal
  const handleApplyPriceFilter = () => {
    setIsOpen(false);
    let filteredDataByCategory = data;

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filteredDataByCategory = filteredDataByCategory.filter((category) =>
        selectedCategories.includes(category.category)
      );
    }

    // Convert price inputs to numbers
    let filteredDataByPrice = filteredDataByCategory;
    const minPrice = parseFloat(priceFromRef.current.value) || 0;
    const maxPrice = parseFloat(priceToRef.current.value) || Infinity;

    // Update the state variables
    setPriceFrom(priceFromRef.current.value);
    setPriceTo(priceToRef.current.value);

    // Filter based on price range
    filteredDataByPrice = filteredDataByPrice.map((category) => {
      const filteredProducts = category.products.filter((product) => {
        const productPrice = parseFloat(product.price);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
      return {
        ...category,
        products: filteredProducts,
      };
    });

        // Filter out categories with no products
    const filteredDataWithProducts = filteredDataByPrice.filter(
      (category) => category.products.length > 0
    );
   // Pass the filtered data to the parent component
    onFilterChange(filteredDataWithProducts);
  };

  const handleCancelPriceFilter = () => {
    setIsOpen(false);
    setPriceFrom("");
    setPriceTo("");
  };

    // Effect to filter data based on search query, categories, price, and timings
  useEffect(() => {
    let filteredData = data;

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filteredData = filteredData.filter((category) =>
        selectedCategories.includes(category.category)
      );
    }
    // Filter by search query
    if (searchQuery !== "") {
      filteredData = filteredData.map((category) => {
        const filteredProducts = category.products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return {
          ...category,
          products: filteredProducts,
        };
      });
    }

    if (selectedCategories.length > 0) {
      filteredData = filteredData.filter((category) =>
        selectedCategories.includes(category.category)
      );
    }

    // Filter by price range
    if (priceFrom !== "" || priceTo !== "") {
      const minPrice = parseFloat(priceFrom) || 0;
      const maxPrice = parseFloat(priceTo) || Infinity;
      filteredData = filteredData.map((category) => {
        const filteredProducts = category.products.filter((product) => {
          const productPrice = parseFloat(product.price);
          return productPrice >= minPrice && productPrice <= maxPrice;
        });
        return {
          ...category,
          products: filteredProducts,
        };
      });
    }

  // Filter by selected timings
    if (selectedTimings.length > 0) {
      filteredData = filteredData.map((category) => {
        const filteredProducts = category.products.filter((product) => {
          const duration = product.duration;
          let maxDuration = Infinity;

          // Parse the duration string
          if (duration.includes("hours")) {
            // Handle "X hours"
            const hoursMatch = duration.match(/(\d+)(?=\s*hours)/);
            if (hoursMatch) {
              maxDuration = parseFloat(hoursMatch[0]);
            }
          } else if (duration.includes("-")) {
            // Handle "X-Y hours"
            const [min, max] = duration.split("-").map((d) => parseFloat(d));
            maxDuration = max;
          } else if (
            duration.includes("Flexible") ||
            duration.includes("Custom")
          ) {
            // Ignore custom durations
            return false;
          }

          // Check against selected timings
          return selectedTimings.some((timing) => {
            if (timing === "≤ 3 hours") return maxDuration <= 3;
            if (timing === "≤ 6 hours") return maxDuration <= 6;
            if (timing === "≤ 8 hours") return maxDuration <= 8;
            return false;
          });
        });
        return {
          ...category,
          products: filteredProducts,
        };
      });
    }
    // Filter out categories with no products
    const filteredDataWithProducts = filteredData.filter(
      (category) => category.products.length > 0
    );
   // Pass the filtered data to the parent component
    onFilterChange(filteredDataWithProducts);
  }, [
    searchQuery,
    selectedCategories,
    data,
    priceFrom,
    priceTo,
    selectedTimings,
  ]);

  return (
    <>
      <Navbar className="md:hidden fixed top-14 sm:mt-2 w-full z-10 ">
        <div className="ml-auto ">
          <form className="py-2 flex gap-5">
            <TextInput
              id="search-services"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Services..."
              rightIcon={AiOutlineSearch}
            />
            <Button color="gray" onClick={() => setIsOpen(true)}>
              <HiAdjustments className="mr-3 h-5 w-4" />
              Filter
            </Button>
          </form>
        </div>
      </Navbar>

      <aside className=" hidden  h-full md:flex justify-end bg-gray-50 dark:bg-gray-800  ">
        <Sidebar>
          <Sidebar.Logo className="flex justify-center pt-10">
            Filters
          </Sidebar.Logo>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <form>
                <TextInput
                  id="search-services"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Services..."
                  rightIcon={AiOutlineSearch}
                />
              </form>

              <Sidebar.Collapse
                className="font-semibold space-y-5"
                label="CATEGORIES"
                open={true}
              >
                {[
                  "Residential Cleaning",
                  "Deep Cleaning",
                  "Commercial Cleaning",
                  "Window Cleaning",
                  "Post-Construction Cleaning",
                  "Disinfection Services",
                ].map((category) => (
                  <div className="flex items-center gap-3" key={category}>
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onChange={handleCategoryChange}
                      className="cursor-pointer"
                    />
                    <Label className="cursor-pointer" htmlFor={category}>
                      {category}
                    </Label>
                  </div>
                ))}
              </Sidebar.Collapse>

              <Sidebar.Collapse
                className="font-semibold space-y-5"
                label="DURATION"
                open={true}
              >
                {["≤ 3 hours", "≤ 6 hours", "≤ 8 hours"].map((timing) => (
                  <div className="flex items-center gap-3" key={timing}>
                    <Checkbox
                      id={timing}
                      checked={selectedTimings.includes(timing)}
                      onChange={handleTimingChange}
                      className="cursor-pointer"
                    />
                    <Label className="cursor-pointer" htmlFor={timing}>
                      {timing}
                    </Label>
                  </div>
                ))}
              </Sidebar.Collapse>

              <Sidebar.Collapse
                className="font-semibold space-y-5"
                label="PRICES"
                open={true}
              >
                <div className="flex items-center justify-between col-span-2 space-x-3 mb-5">
                  <div className="w-full">
                    <Label
                      htmlFor="price-from"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      From
                    </Label>
                    <input
                      type="number"
                      id="price-from"
                      placeholder="0"
                      min={0}
                      step={500}
                      max={10000}
                      defaultValue={priceFrom}
                      ref={priceFromRef}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <Label
                      htmlFor="price-to"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      To
                    </Label>
                    <input
                      type="number"
                      id="price-to"
                      placeholder="10000"
                      min={0}
                      step={500}
                      max={15000}
                      defaultValue={priceTo}
                      ref={priceToRef}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-grow"
                    outline
                    gradientDuoTone="cyanToBlue"
                    type="submit"
                    onClick={handleCancelPriceFilter}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-grow"
                    gradientDuoTone="cyanToBlue"
                    type="submit"
                    onClick={handleApplyPriceFilter}
                  >
                    Apply
                  </Button>
                </div>
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </aside>

      <Modal
        show={isOpen}
        size="md"
        onClose={() => {
          setIsOpen(false);
        }}
        className="py-20 dark:bg-gray-600  dark:text-white "
      >
        <Modal.Header className="bg-gray-100 dark:bg-gray-900">
          <span className="text-lg font-bold">Filters</span>
        </Modal.Header>
        <Modal.Body className="bg-gray-50 dark:bg-gray-800">
          <div className="space-y-5">
            <h4 className="font-semibold">CATEGORIES</h4>
            <div className="flex flex-wrap gap-3">
              {[
                "Residential Cleaning",
                "Deep Cleaning",
                "Commercial Cleaning",
                "Window Cleaning",
                "Post-Construction Cleaning",
                "Disinfection Services",
              ].map((category) => (
                <div className="flex items-center gap-3" key={category}>
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                  />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>

            <h4 className="font-semibold">DURATION</h4>
            <div className="flex flex-col gap-3">
              {["≤ 3 hours", "≤ 6 hours", "≤ 8 hours"].map((timing) => (
                <div className="flex items-center gap-3" key={timing}>
                  <Checkbox
                    id={timing}
                    checked={selectedTimings.includes(timing)}
                    onChange={handleTimingChange}
                  />
                  <Label htmlFor={timing}>{timing}</Label>
                </div>
              ))}
            </div>

            <h4 className="font-semibold">PRICES</h4>
            <div className="flex items-center justify-between col-span-2 space-x-3 mb-5">
              <div className="w-full">
                <Label
                  htmlFor="price-from"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  From
                </Label>
                <input
                  type="number"
                  id="price-from"
                  placeholder="0"
                  min={0}
                  step={500}
                  max={10000}
                  defaultValue={priceFrom}
                  ref={priceFromRef}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="w-full">
                <Label
                  htmlFor="price-to"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  To
                </Label>
                <input
                  type="number"
                  id="price-to"
                  placeholder="10000"
                  min={0}
                  step={500}
                  max={15000}
                  defaultValue={priceTo}
                  ref={priceToRef}
                  className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w -full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-grow"
                outline
                gradientDuoTone="cyanToBlue"
                type="submit"
                onClick={handleCancelPriceFilter}
              >
                Cancel
              </Button>
              <Button
                className="flex-grow"
                gradientDuoTone="cyanToBlue"
                type="submit"
                onClick={handleApplyPriceFilter}
              >
                Apply
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-gray-100 dark:bg-gray-900">
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            className="ml-auto"
            color="failure"
            size="sm"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Filter;
