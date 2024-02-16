import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { RiDeleteBin2Line, RiEdit2Line } from "react-icons/ri"; // Import delete and edit icons

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filep, setFilep] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formdata, setFormdata] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [empty, isEmpty] = useState(false);

  const hchange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  const handleDeleteAccount = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      } else {
        alert("Account deleted successfully.");
        dispatch(deleteUserSuccess());
      }
    } catch (err) {
      dispatch(deleteUserFailure(err.message || "An error occurred"));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
      } else {
        alert("Signed out successfully.");
        dispatch(signOutUserSuccess(data));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message || "An error occurred"));
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilep(Math.round(progress));
      },
      (error) => {
        setFileUploadError(
          error.message || "An error occurred during file upload."
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormdata({ ...formdata, profile: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    dispatch(updateUserStart());

    if (!formdata.username && !formdata.email && !formdata.password && !file) {
      setFileUploadError("Please make changes before submitting.");
      setSubmitting(false);
      return;
    }

    try {
      const req = await fetch(`/api/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await req.json();

      if (req.ok) {
        alert("Profile updated successfully.");
        dispatch(updateUserSuccess(data));
      } else {
        setFileUploadError(data.message || "Update failed. Please try again.");
        dispatch(updateUserFailure(data.message || "Update failed."));
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setFileUploadError(
        error.message || "An error occurred during the update."
      );
      dispatch(
        updateUserFailure(
          error.message || "An error occurred during the update."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleShow = async () => {
    try {
      const res = await fetch(`/api/solo/${currentUser._id}`, {
        method: "GET",
      });

      if (res.ok) {
        const result = await res.json();
        setData(result);

        if (result.length === 0) {
          isEmpty(true);
        }
      } else {
        console.error("Error fetching data:", res.status, res.statusText);
        isEmpty(true);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      isEmpty(true);
    }
  };

  const sdelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // If deletion is successful, update the data state
        setData((prevData) =>
          prevData.filter((listing) => listing._id !== listingId)
        );
      } else {
        console.log("Deletion failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 p-8 max-w-md mx-auto mt-8 rounded-lg shadow-md">
      <h1 className="text-3xl text-center font-semibold my-4">Your Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full">
          {filep > 0 && (
            <div className="rounded-full overflow-hidden">
              <img
                src={formdata.profile || currentUser.profile}
                alt="profile"
                className="w-full h-full object-cover border-8"
              />
              <div
                className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center"
                style={{
                  opacity: filep / 100,
                  transition: "opacity 0.5s ease",
                }}
              >
                <CircularProgressbar
                  value={filep}
                  text={`${filep}%`}
                  strokeWidth={5}
                  styles={{
                    root: { width: "100%", height: "100%" },
                    path: {
                      stroke: `rgba(62, 152, 199, 1)`, // Always fully opaque
                    },
                  }}
                />
              </div>
            </div>
          )}

          <img
            onClick={() => fileRef.current.click()}
            src={formdata.profile || currentUser.profile}
            alt="profile"
            className="rounded-full w-full h-full object-cover border-8 cursor-pointer"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          className="hidden"
        />

        {fileUploadError && (
          <p className="text-red-500 mt-2 text-sm">{fileUploadError}</p>
        )}

        <input
          type="text"
          id="username"
          placeholder={currentUser.username}
          onChange={hchange}
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          id="email"
          placeholder={currentUser.email}
          onChange={hchange}
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          id="password"
          placeholder="New Password"
          onChange={hchange}
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:bg-blue-600 mb-4"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="text-red-500 hover:underline focus:outline-none"
          >
            Delete Account
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="text-red-500 hover:underline focus:outline-none"
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
