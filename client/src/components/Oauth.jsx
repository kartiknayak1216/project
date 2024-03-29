import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Move useNavigate here

  const hclick = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    try {
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token in localStorage or a secure storage mechanism
        dispatch(signInSuccess(data));

        // Redirect to the dashboard page
        navigate("/dashboard");
      } else {
        throw new Error(data.message); // Throw an error if the API request fails
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <button
      type="button"
      onClick={hclick}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default Oauth;
