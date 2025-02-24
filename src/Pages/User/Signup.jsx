import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import OAuth from "../../Components/OAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import API_BASE_URL from "../../apiConfig";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const handleDismiss = () => {
    setErrorMessage(null);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Enter a valid username'),
      email: Yup.string().email('Invalid email address').required('Please enter a valid email'),
      password: Yup.string().required('* Required'),
    }),
    onSubmit: async (values) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await axios.post(
      `${API_BASE_URL}/auth/register-user`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (response.status === 200) {
        navigate("/signin");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  },
});

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3000);

      return () => clearTimeout(timer);
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
            You can sign up with your eamil and password or you can use the
            Google. **This is the demo project**
          </p>
        </div>
        <div className="flex-1">
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div>
              <Label value="UserName" />
              <TextInput
                type="text"
                placeholder="Enter Your Username"
                id="username"
               onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-500">{formik.errors.username}</div>
              ) : null}
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="email@address.com"
                id="email"
                onChange={formik .handleChange}
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
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-6">
            <span>Already have An Account ?</span>
            <Link
              to="/signin"
              className="text-blue-600 font-semibold dark:text-blue-400 dark:font-bold"
            >
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-5">
              <span className="font-medium">OOPS! {errorMessage}</span>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
