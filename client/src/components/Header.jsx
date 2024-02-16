import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <nav className="bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard">
                <span className="text-white text-2xl font-extrabold uppercase tracking-wide">
                  Todo
                </span>
              </Link>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            {currentUser ? (
              <Link to="/profile">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={currentUser.profile}
                  alt="profile"
                />
              </Link>
            ) : (
              <Link
                to="/signin"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
