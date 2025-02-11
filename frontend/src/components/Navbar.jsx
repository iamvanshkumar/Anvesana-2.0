import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import profileIcon from "../assets/img/user/profile.png";
import "boxicons";
import { FaCalendar, FaClock } from "react-icons/fa";
import { useUser } from "../firebase/userContext";

export default function Navbar() {
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown

  useEffect(() => {
    // Function to update the greeting, date, and time
    const updateTime = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      // Dynamic Greeting
      if (hours < 12) {
        setGreeting("Good morning");
      } else if (hours < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }

      // Dynamic Date
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(date.toLocaleDateString("en-US", options));

      // Dynamic Time
      const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
      setTime(formattedTime);
    };

    // Initial update to set default date and time before setInterval starts
    updateTime();

    // Update time every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Toggle dropdown on button click
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const { user, loading } = useUser();
  if (loading) return <p>Loading...</p>;

  return (
    <nav className="w-full flex items-center justify-between p-2 border-b border-gray-100">
      <div className="text-xl">
        <span className="text-[#2BACDE] font-light">
          {greeting},
          <span className="text-gray-800 font-medium">
            {" "}
            {user ? user.firstName : "Guest"}
          </span>
        </span>
      </div>
      <div className="flex items-center text-gray-600 text-sm gap-1">
        <FaCalendar className="text-[#2BACDE]" />
        <span className="font-semibold">{currentDate}</span>
        <FaClock className="ml-2 text-[#2BACDE]" />
        <span>{time}</span> {/* Display the current time */}
      </div>
      <div className="relative">
        {/* Button to toggle dropdown */}
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-1 cursor-pointer"
        >
          <img
            src={profileIcon}
            className="w-8 h-8 rounded-full border-3 border-gray-100"
            alt="user_icon"
            draggable="false"
          />
          <span className="text-sm text-gray-600 font-medium hover:text-[#2BACDE]">
            {user ? user.firstName : "Guest"}
          </span>
          <box-icon name="chevron-down"></box-icon>
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200"
            onClick={() => setDropdownOpen(false)} // Close on click outside
          >
            <ul className="py-1 text-sm text-gray-700">
              <Link
                to="/profile"
                className="flex gap-1 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <box-icon name="user" size="xs" color="#364153"></box-icon>
                Profile
              </Link>
              <li className="flex gap-1 px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer">
                <box-icon name="log-out" size="xs" color="#fb2c36"></box-icon>
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
