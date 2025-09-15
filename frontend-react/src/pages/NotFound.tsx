import React from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-400 to-purple-600 text-white">
      {/* Navbar */}
      <nav className="bg-white text-black px-6 py-4 flex justify-between items-center shadow">
        <div className="text-xl font-bold text-blue-700">OutreachHub</div>
        <div className="space-x-4">
          <Link to="/" className="hover:underline font-medium">
            Home
          </Link>
          <Link to="/about" className="hover:underline font-medium">
            About
          </Link>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-6 max-w-xl">
          Oops! The page you're looking for doesn't exist or has been moved. Try
          heading back to the homepage.
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

