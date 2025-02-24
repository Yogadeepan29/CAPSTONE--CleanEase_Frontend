import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  clearError,
} from "../../Redux/Slice/userSlice";
import OAuth from "../../Components/OAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import API_BASE_URL from "../../apiConfig";

const Signin = () => {
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const handleDismiss = () => {
    dispatch(clearError());
    setShowAlert(false); // Hide the alert
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter a valid email"),
      password: Yup.string().required("* Required"),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(signInStart());
        const response = await axios.post(
          `${API_BASE_URL}/auth/login-user`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;

        if (data.success === false) {
          return dispatch(signInFailure(data.message));
        }
        if (response.status === 200) {
          localStorage.setItem("Token", data.token);
          dispatch(signInSuccess(data));
          if (data.rest.isAdmin) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        if (error.response && error.response.data) {
          dispatch(
            signInFailure(error.response.data.message || "An error occurred")
          );
        } else {
          dispatch(signInFailure("An error occurred"));
        }
      }
    },
  });

  useEffect(() => {
    if (errorMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        handleDismiss(); // Dismiss the alert after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [errorMessage]);

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center self-center text-3xl md:text-6xl font-bold whitespace-nowrap dark:text-white">
            <span>Clean</span>
            <img src="/dust.png" className="h-12" alt="Flowbite Logo" />
            <span>Ease</span>
          </div>
          <p className="text-sm mt-6">
            You can sign in with your eamil and password or you can use the
            Google.
          </p>
        </div>
        <div className="flex-1">
          {/* <form className="flex flex-col gap-4" onSubmit={handleSubmit}> */}
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="email@address.com"
                id="email"
                // onChange={handleChange}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    color="purple"
                    aria-label="Purple spinner example"
                    size="sm"
                  />
                  <span className="pl-3">Loading ...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-6">
            <span>Don't have An Account ?</span>
            <Link
              to="/signup"
              className="text-blue-600 font-semibold dark:text-blue-400 dark:font-bold"
            >
              Sign Up
            </Link>
          </div>
          {showAlert && errorMessage && (
            <div className="mt-5">
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">OOPS! {errorMessage}</span>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
