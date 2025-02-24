import { Breadcrumb, Button, Card, HR, Checkbox, Label } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineArrowRight } from "react-icons/hi";
import { updateServiceDateTime } from "../../Redux/Slice/cartSlice";
import { RiCalendarScheduleFill } from "react-icons/ri";
import {
  format,
  addDays,
  isToday,
  isAfter,
  isBefore,
  isSameDay,
  isSameHour,
  setHours,
  setMinutes,
} from "date-fns";

const CheckoutSlot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);
  const checkoutData = useSelector((state) => state.cart.checkoutData);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [allSlotsSelected, setAllSlotsSelected] = useState(false);

  // Function to handle date selection
  const handleDateSelect = (serviceId, date) => {
    const currentItem = checkoutData.items.find(
      (item) => item.productId === serviceId
    );

    setSelectedSlots((prev) => ({
      ...prev,
      [serviceId]: {
        date,
        time: null, 
      },
    }));
    dispatch(
      updateServiceDateTime({
        productId: serviceId,
        date,
        time: null,
        subscription: currentItem.subscription,
      })
    );
  };
  // Function to handle time selection
  const handleTimeSelect = (serviceId, time) => {
    const currentItem = checkoutData.items.find(
      (item) => item.productId === serviceId
    );

    setSelectedSlots((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        time,
      },
    }));
    dispatch(
      updateServiceDateTime({
        productId: serviceId,
        date: selectedSlots[serviceId]?.date,
        time,
        subscription: currentItem.subscription,
      })
    );
  };

  const generateAvailableDates = () => {
    const today = new Date();
    const availableDates = [];
    console.log(today);

    // Define the cutoff time (2:30 PM)
    const cutoffTime = setHours(setMinutes(new Date(), 30), 14); // 2:30 PM

    // If it's before 8 AM, include today
    if (isBefore(today, cutoffTime)) {
      availableDates.push(format(today, "yyyy-MM-dd")); // Include today
    }

    // Add the next four days
    const daysToAdd = isAfter(today, cutoffTime) ? 4 : 3; // If cutoff has passed, add 4 future days, else add 3
    for (let i = 1; i <= daysToAdd; i++) {
      const nextDate = addDays(today, i);
      availableDates.push(format(nextDate, "yyyy-MM-dd")); // Use ISO format
    }

    return availableDates;
  };

  // Function to generate time slots (8:00 AM to 7:00 PM)
  const generateTimeSlots = (selectedDate) => {
    const times = [];
    const today = new Date();
    const currentTime = new Date();
    const cutoffTime = new Date(currentTime.getTime() + 120 * 60000); // 120 minutes = 2 hours

    // Check if the selected date is valid
    const selectedDateObj = new Date(selectedDate);
    if (isNaN(selectedDateObj)) {
      console.error("Invalid selected date:", selectedDate);
      return times; // Return an empty array if the date is invalid
    }

    // Check if the selected date is today
    const isTodaySelected = isSameDay(selectedDateObj, today);

    if (isTodaySelected) {
      // If it's after 5 PM, no time slots available for today
      if (isAfter(currentTime, setHours(setMinutes(today, 30), 17))) {
        return times; // No slots available for today
      }

      // Calculate the start time based on current time for today
      let startHour = 8; // 8:00 AM
      let startMinute = 0;

      if (isAfter(currentTime, setHours(today, 8))) {
        // If current time is after 8 AM, set the start time to the current time
        startHour = currentTime.getHours();
        startMinute = currentTime.getMinutes();

        // Adjust start time to the next available slot
        if (startMinute < 30) {
          startMinute = 30; // Round up to the next half hour
        } else {
          startMinute = 0; // Reset to the next hour
          startHour += 1; // Move to the next hour
        }

        // If the adjusted start hour is greater than 17 (5 PM), return no slots
        if (startHour > 17) {
          return times; // No available time slots left for today
        }
      }

      // Generate time slots for today
      for (let hour = startHour; hour <= 16; hour++) {
        for (
          let minute = hour === startHour ? startMinute : 0;
          minute <= 30;
          minute += 30
        ) {
          if (hour === 16 && minute > 30) {
            break; // Stop at 4:30 PM
          }

          const slotTime = setHours(setMinutes(new Date(), minute), hour);

          // Only add the slot if it's at least 2 hours from now
          if (isAfter(slotTime, cutoffTime)) {
            times.push(format(slotTime, "hh:mm a"));
          }
        }
      }
    } else {
      // For future days, generate fixed time slots from 8 AM to 4:30 PM
      for (let hour = 8; hour <= 16; hour++) {
        for (let minute = 0; minute <= 30; minute += 30) {
          if (hour === 16 && minute > 30) {
            break; // Stop at 4:30 PM
          }
          const time = setHours(setMinutes(selectedDateObj, minute), hour);
          times.push(format(time, "hh:mm a"));
        }
      }
    }

    return times;
  };

  // Check if all services have both date and time selected
  useEffect(() => {
    const allSelected = checkoutData.items.every((item) => {
      const slot = selectedSlots[item.productId];
      return slot && slot.date && slot.time; // Check if both date and time are selected
    });
    setAllSlotsSelected(allSelected);
  }, [selectedSlots, checkoutData.items]);

  console.log("Checkout Data:", checkoutData);

  const handleCheckout = () => {
    navigate("/checkout/summary");
  };

  return (
    <>
      <section className=" mx-auto container min-h-screen antialiased dark:bg-gray-900 ">
        <div className="mx-auto top-20 max-w-screen-xl p-4 2xl:px-0 mt-10 sm:mt-5">
          <h2 className="text-3xl md:text-5xl text-center font-semibold text-gray-900 dark:text-white ">
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
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      Cart
                    </Link>
                  ) : (
                    "Checkout"
                  )}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link
                    to="/checkout"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Service Address
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item> <span className="font-bold text-gray-800  dark:text-gray-200 cursor-default">Slot Selection</span> </Breadcrumb.Item>
              </Breadcrumb>

              <Card className="mt-4 border border-gray-700 bg-gray-50 dark:border-gray-400 dark:bg-gray-800">
                <div className="text-center font-bold text-2xl md:text-3xl ">
                  <h1>Schedule Service</h1>
                </div>
                {checkoutData.items.map((item) => {
                  const productDetail =
                    checkoutData.productDetails[item.productId];
                  const selectedAddressId = item.selectedAddressId;
                  const selectedAddress = currentuser.rest.addresses.find(
                    (address) => address._id === selectedAddressId
                  );
                  const addressString = selectedAddress
                    ? `${selectedAddress.doorNumber}, ${selectedAddress.streetName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pinCode}`
                    : "No address selected"; // Fallback if no address is found

                  const selectedDate = selectedSlots[item.productId]?.date; // Get the selected date for the current service
                  // const timeSlots = generateTimeSlots(selectedDate); // Generate time slots based on the selected date
                  const timeSlots = selectedDate
                    ? generateTimeSlots(selectedDate)
                    : [];
                  return (
                    <div key={item.productId} className="">
                      <h3 className="text-xl font-semibold text-center text-green-400 mb-3 border border-slate-500 rounded-lg  p-3">
                        {productDetail.name}
                      </h3>
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 py-3">
                        <div>
                          <FaLocationDot />
                        </div>
                        <p>{addressString}</p>
                      </div>
                      <p className="my-2 font-semibold text-lg">
                        When should the professional arrive?
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2  sm:grid-cols-4">
                        {generateAvailableDates().map((date) => {
                          const dateObj = new Date(date); // Create date from ISO format
                          const day = dateObj.toLocaleString("en-US", {
                            weekday: "short",
                          }); // Get short day name
                          const dayOfMonth = String(dateObj.getDate()).padStart(
                            2,
                            "0"
                          );
                          const isSelected =
                            selectedSlots[item.productId]?.date === date;
                          return (
                            <Button
                              key={date}
                              color={isSelected ? "custom" : "gray"}
                              onClick={() =>
                                handleDateSelect(item.productId, date)
                              }
                              className={`flex-col transition-colors duration-300  ease-in-out transform ${
                                isSelected ? "border-green-500 " : ""
                              } ${isSelected ? "ring-2 ring-green-400" : ""}`}
                            >
                              <div className="flex-col mx-auto">
                                <h3>{day}</h3>
                                <h5> {dayOfMonth}</h5>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                      {selectedDate && (
                        <>
                          <p className="mt-4 mb-2 font-semibold text-lg">
                            Select start time of service:
                          </p>
                          <p className="mb-4 ml-3 text-sm font-normal text-red-500 dark:text-red-400">
                            * This service will take approx{" "}
                            {productDetail.duration}.
                          </p>
                        </>
                      )}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {timeSlots.map((time, index) => {
                          // Check if this time is selected
                          const isTimeSelected =
                            selectedSlots[item.productId]?.time === time;
                          const isDateSelected =
                            selectedSlots[item.productId]?.date !== undefined;

                          return (
                            <Button
                              key={`${item.productId}-${index}`} // Use a unique key
                              color={isTimeSelected ? "custom" : "gray"}
                              onClick={() =>
                                isDateSelected &&
                                handleTimeSelect(item.productId, time)
                              }
                              disabled={!isDateSelected}
                              className={`transition duration-200 ease-in-out transform cursor-default ${
                                isTimeSelected ? "border-green-500 " : ""
                              } ${
                                isTimeSelected ? "ring-2 ring-green-400" : ""
                              }`}
                            >
                              {time}
                            </Button>
                          );
                        })}
                      </div>
                      <HR className="my-8 border-gray-300 dark:border-gray-600" />
                    </div>
                  );
                })}
              </Card>
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
                  <Button
                    className={`flex w-full items-center gap-2 justify-center align-center p-0.5  ${
                      !allSlotsSelected ? "cursor-default" : ""
                    }`}
                    outline
                    gradientDuoTone="cyanToBlue"
                    type="submit"
                    disabled={!allSlotsSelected}
                    onClick={handleCheckout}
                  >
                    <div className="text-base flex text-center align-center items-center gap-2">
                      <RiCalendarScheduleFill /> Schedule Slot
                    </div>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutSlot;
