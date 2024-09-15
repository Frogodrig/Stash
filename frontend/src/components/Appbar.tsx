import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { Profile } from "../hooks";

export const Appbar = ({ profile }: { profile: Profile | null }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null); // Reference for avatar

  const handleAvatarClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleProfileClick = () => {
    navigate("/user");
    setIsDropdownOpen(false); // Close the dropdown
  };

  const handleSignoutClick = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Handle clicks outside the dropdown and avatar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !avatarRef.current?.contains(event.target as Node) // Ensure avatar click isn't closing the dropdown
      ) {
        setIsDropdownOpen(false); // Close dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scroll events to update stickiness
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        // Adjust 100 to the number of pixels you want to scroll before the Appbar becomes sticky
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (profile === null) {
    return (
      <div
        className={`border-b flex justify-between px-10 py-4 bg-white shadow-md transition-all ${
          isSticky ? "sticky top-0 left-0 w-full z-50" : ""
        }`}
      >
        <div className="flex flex-col justify-center cursor-pointer text-xl font-bold">
          STASH
        </div>
        <div className="flex">
          <div>
            <button
              type="button"
              className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-all"
            >
              New
            </button>
          </div>

          <div className="cursor-pointer inline-block">
            <div className="rounded-full justify-center bg-gray-300 w-10 h-10 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-b flex justify-between px-10 py-4 bg-white shadow-md transition-all ${
        isSticky ? "sticky top-0 left-0 w-full z-50" : ""
      }`}
    >
      <Link
        to={"/blogs"}
        className="flex flex-col justify-center cursor-pointer text-xl font-bold"
      >
        STASH
      </Link>
      <div className="relative">
        <Link to={"/publish"}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-all"
          >
            New
          </button>
        </Link>

        <div
          ref={avatarRef}
          onClick={handleAvatarClick}
          className="cursor-pointer inline-block"
        >
          <Avatar size="big" name={profile.name} />
        </div>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="dropdown bg-white shadow-lg rounded-lg absolute right-0 mt-2 py-2 w-48 border border-gray-200"
          >
            <div
              className="dropdown-item px-4 py-2 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-all text-gray-600"
              onClick={handleProfileClick}
            >
              My Profile
            </div>
            <div
              className="dropdown-item px-4 py-2 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-all text-gray-600"
              onClick={handleSignoutClick}
            >
              Signout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
