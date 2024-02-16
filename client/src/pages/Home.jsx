import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 align-center justify-center text-center">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-bold mb-4">Welcome to Todo App</h1>
          <p className="text-lg mb-4">
            Organize your tasks efficiently with Todo App.
          </p>
          <p className="text-lg mb-4">
            Get started by signing in or sign up for an account.
          </p>
          <Link to="/signin">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
