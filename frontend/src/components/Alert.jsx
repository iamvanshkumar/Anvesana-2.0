import React from "react";
import { FaCross } from "react-icons/fa";
import { FaCircleHalfStroke, FaX, FaXmark } from "react-icons/fa6";

const Alert = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#ff00002e] bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4 ">
        <FaXmark  size={64} className="p-2 rounded-full bg-red-400 text-white" />
        <p>{message}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-[#2BACDE] rounded text-white
           hover:bg-black transition-all duration-300 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Alert;
