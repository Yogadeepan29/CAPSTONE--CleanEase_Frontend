// src/Pages/Cancel.jsx
import { Button } from "flowbite-react";
import React from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";

// Cancel component to display a message when payment is canceled
const Cancel = () => {
  return (
    <>
        <div className="flex pt-20 justify-center min-h-screen dark:bg-gradient-to-br from-gray-800 via-gray-900 to-black px-4">
      <div className="text-center max-w-md">
        <FaCircleXmark className="mx-auto text-6xl md:text-8xl text-red-500 mb-6" />
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Payment Canceled
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Your payment has failed. Please try again.
        </p>
        <Link to="/" className="inline-block">
          <Button
            outline
            gradientDuoTone="purpleToPink"
            className="font-medium text-lg"
          >
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
    </>
  );
};

export default Cancel;
