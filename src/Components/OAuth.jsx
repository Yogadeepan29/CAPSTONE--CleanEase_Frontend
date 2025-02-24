import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { signInFailure, signInSuccess } from "../Redux/Slice/userSlice";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import axios from "axios";
import API_BASE_URL from "../apiConfig";

// OAuth component for Google Sign-In
const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

// Handle Google Sign-In
const handleSubmit = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    
    // Prepare the data to send to your backend
    const userData = {
      name: result.user.displayName,
      email: result.user.email,
      profilePic: result.user.photoURL,
    };

    // Use Axios to send the POST request
    const res = await axios.post(`${API_BASE_URL}/auth/google`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is successful
    if (res.status === 200) {
      // If the response is OK, store the token and dispatch success action
      localStorage.setItem("Token", res.data.token);
      dispatch(signInSuccess(res.data));

      // Navigate based on user role
      if (res.data.rest.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  } catch (error) {
    // Handle error
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(signInFailure(errorMessage));
  }
};

  return (
    <Button type="button" gradientDuoTone="purpleToBlue" onClick={handleSubmit}>
      <AiFillGoogleCircle className="w-6 h-8 mr-2" />
      <p className="pt-1">Continue with Google</p>
    </Button>
  );
};

export default OAuth;
