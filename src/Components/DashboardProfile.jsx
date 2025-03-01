import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiInformationCircle } from "react-icons/hi";
import axios from "axios";
import {
  signOutSucess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  clearError,
} from "../Redux/Slice/userSlice";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { clearCart } from "../Redux/Slice/cartSlice";
import API_BASE_URL from "../apiConfig";

const DashboardProfile = () => {
  const dispatch = useDispatch();
  const { currentuser, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpdateUserSuccess(false);
      setUpdateUserError(null);
      dispatch(clearError());
    }, 5000);

    return () => clearTimeout(timer);
  }, [updateUserSuccess, updateUserError]);

  //* Onchange in the image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  //* Uploading Process
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  //* Firebase Image Upload and Store section
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload the image (File size must be less than 2MB"
        );
        setImageFileUrl(null);
        setImageFile(null);
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  //* Onchange in the input Fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //* Updating User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Changes Made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait while the image is uploading");
      return;
    }

    try {
      dispatch(updateStart());
      const response = await axios.put(
        `${API_BASE_URL}/user/update/${currentuser.rest._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
        }
      );

      dispatch(updateSuccess(response.data));
      setUpdateUserSuccess("User  Profile Updated Successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(updateFailure(errorMessage));
      setUpdateUserError(errorMessage);
    }
  };

  //* User SignOut
  const handleSignOut = () => {
    dispatch(signOutSucess());
    dispatch(clearCart());
    localStorage.removeItem("Token");
  };

  //* Delete User
  const handleDelete = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const response = await axios.delete(
        `${API_BASE_URL}/user/delete/${currentuser.rest._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
        }
      );

      dispatch(deleteUserSuccess(response.data));
      dispatch(clearCart());
      localStorage.removeItem("Token");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("selectedAddons");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(deleteUserFailure(errorMessage));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 w-full">
      <h1 className="my-7 text-center font-semibold text-4xl text-blue-600 dark:text-blue-500 ">Profile</h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />

        <div
          className="relative w-48 h-48 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}% `}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(117,161,212,${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentuser.rest.profilePicture}
            onError={(e) => {
              e.target.src =
                "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png";
            }}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[#75a1d4] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-50"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert
            color="failure"
            icon={HiInformationCircle}
            className="mt-5"
            onDismiss={() => setImageFileUploadError(null)}
          >
            <span className="font-medium">OOPS! {imageFileUploadError}</span>
          </Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="UserName"
          defaultValue={currentuser.rest.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentuser.rest.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="********"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={loading || imageFileUploading}
        >
          {loading ? "loading..." : "Update"}
        </Button>
      </form>
      <div className=" text-red-600 flex justify-between mt-5">
        {!currentuser.rest.isAdmin && (
          <span
            className="cursor-pointer font-bold"
            onClick={() => setShowModal(true)}
          >
            Delete Account
          </span>
        )}
        <span className="cursor-pointer ml-auto" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert
          color="success"
          icon={HiInformationCircle}
          className="mt-5"
          onDismiss={() => setUpdateUserSuccess(null)}
        >
          <span className="font-medium me-2">😎Yaaa!</span>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert
          color="failure"
          icon={HiInformationCircle}
          className="mt-5"
          onDismiss={() => setUpdateUserError(null)}
        >
          <span className="font-medium me-2">🥴OOPS!</span>
          {updateUserError}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />

        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-200">
              Are you sure you want to delete this Account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes,I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Changed My Mind
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardProfile;
