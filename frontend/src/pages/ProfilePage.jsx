import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import profileIcon from "../assets/img/user/profile.png";
import FormInput from "../components/FormInput";
import { useUser } from "../firebase/userContext";
import "../index.css";
import {
  FaUser,
  FaEdit,
  FaBuilding,
  FaCamera,
  FaCloudUploadAlt,
  FaArrowCircleRight,
  FaAngleRight,
} from "react-icons/fa"; // Ensure react-icons is installed

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [city, setCity] = useState("");
  const [process, setProcess] = useState("");
  const [shift, setShift] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImgModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleEditClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleImageEditClick = () => setIsImgModalOpen(true);

  const fileInputRef = useRef(null);

  const handleImageCloseModal = () => {
    setIsImgModalOpen(false);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const { user, loading } = useUser();
  if (loading) return <p>Loading...</p>;

  return (
    <div className="h-screen grid grid-cols-5 bg-gray-50 p-2">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="col-span-4 flex flex-col gap-4 h-full py-2 px-4 overflow-y-scroll">
        <Navbar />

        {/* Profile Section */}
        <div className="bg_card rounded-lg shadow-sm py-4 px-8 flex items-center gap-4">
          <div className="flex flex-col items-center">
            <img
              src={profileIcon}
              className="h-24 w-24 rounded-full shadow-sm border-2 border-[#2EC4FF]"
              alt="User Icon"
              draggable="false"
            />

            <button
              onClick={handleImageEditClick}
              className="-mt-3
              cursor-pointer flex items-center gap-1 bg-[#2EC4FF] px-2 py-1 rounded-sm text-sm text-white hover:bg-[#3B71B6] transition-all duration-300"
            >
              <FaCamera className="text-white" />
            </button>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-[#2EC4FF]">
            {user ? user.firstName + " " + user.lastName : "Guest"}
            </h2>
            <span className="text-gray-500 text-sm">
            {user ? user.email : "abc@berg.co.in"}
            </span>
            <span className="text-gray-500 text-sm">{user ? user.process : "CEO"}</span>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="flex flex-col gap-4 bg-white border border-gray-100 rounded-lg shadow-sm py-4 px-8">
          <div className="py-2 border-b border-gray-100 w-full flex justify-between items-center">
            <span className="text-gray-700 font-medium flex items-center gap-1">
              <FaUser className="text-[#2BACDE] text-sm" /> Personal Information
            </span>
            <button
              onClick={handleEditClick}
              className="cursor-pointer flex items-center gap-1 bg-[#2EC4FF] px-2 py-1 rounded-sm text-sm text-white hover:bg-[#3B71B6] transition-all duration-300"
            >
              Edit <FaEdit className="text-white" />
            </button>
          </div>

          {/* Image Modal */}
          {isImageModalOpen && (
            <div className="fixed inset-0 bg-[#00000061] bg-opacity-50 flex justify-center items-center">
              <div className="relative bg-white rounded-lg shadow-sm w-full md:w-[30rem] max-w-[90%]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="font-medium text-gray-800 flex items-center gap-1">
                    <FaEdit className="" /> Edit Image
                  </h3>
                  <button
                    onClick={handleImageCloseModal}
                    type="button"
                    className=" cursor-pointer end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="authentication-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <div className="p-4 md:p-5">
                  <div className="py-6 flex flex-col gap-4">
                    <div className="col-span-full">
                      <label
                        htmlFor="file-upload"
                        className="mt-2 flex flex-col justify-center items-center text-center mx-auto rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer hover:bg-gray-100 transition-all duration-300"
                      >
                        <FaCloudUploadAlt
                          size={42}
                          className="text-[#2BACDE]"
                        />
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                          <span className="relative cursor-pointer font-semibold text-gray-600 ">
                            Upload a photo
                          </span>
                        </div>
                        <p className="text-xs/5 text-gray-600">
                          PNG, JPG, JPEG up to 1MB
                        </p>
                        {fileName && (
                          <p className="mt-2 text-sm text-[#2BACDE]">
                            {fileName}
                          </p>
                        )}
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <button className="p-2 hover:bg-black bg-[#2BACDE] transition-all duration-150 rounded-md text-white font-semibold cursor-pointer">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*Personal Information Modal  */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-[#00000061] bg-opacity-50 flex justify-center items-center">
              <div className="relative bg-white rounded-lg shadow-sm w-full md:w-[30rem] max-w-[90%]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="font-medium text-gray-800 flex items-center gap-1">
                    <FaEdit className="" /> Edit Personal Information
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    type="button"
                    className=" cursor-pointer end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="authentication-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <div className="p-4 md:p-5">
                  <div className="py-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="First Name"
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <FormInput
                        label="Last Name"
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <FormInput
                        label="Date of Birth"
                        type="date"
                        name="dob"
                        placeholder="Enter your date of birth"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                      <FormInput
                        label="Phone Number"
                        type="number"
                        name="phoneNumber"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        disabled
                        className="p-2 border border-gray-300 rounded-md focus:border-[#2BACDE] focus:ring-0"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Employee ID
                        </label>
                        <input
                          disabled
                          className="p-2 border border-gray-300 rounded-md focus:border-[#2BACDE] focus:ring-0"
                          type="text"
                          name="employeeId"
                          id="employeeId"
                          placeholder="Enter your employee ID"
                          value={employeeId}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <select
                          disabled
                          className="block w-full p-2 border border-gray-300 rounded-md"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        >
                          <option value="Jammu">Jammu</option>
                          <option value="Dehradun">Dehradun</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Process
                        </label>
                        <select
                          className="block w-full p-2 border border-gray-300 rounded-md"
                          value={process}
                          onChange={(e) => setProcess(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Process
                          </option>
                          <option value="MPQC:FK">MPQC:FK</option>
                          <option value="MPQC:Shopsy">MPQC:Shopsy</option>
                          <option value="Allen">Allen</option>
                          <option value="SQA-FK">SQA-FK</option>
                          <option value="UGC">UGC</option>
                          <option value="RQA">RQA</option>
                          <option value="VSQA">VSQA</option>
                          <option value="Image QC">Image QC</option>
                          <option value="Video QC">Video QC</option>
                          <option value="Cleartrip">Cleartrip</option>
                          <option value="Counterfeit">Counterfeit</option>
                          <option value="HITL">HITL</option>
                          <option value="RSQA">RSQA</option>
                          <option value="MIS">MIS</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Shift Timing
                        </label>
                        <select
                          className="block w-full p-2 border border-gray-300 rounded-md"
                          value={shift}
                          onChange={(e) => setShift(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Shift
                          </option>
                          <option value="6AM - 3PM">6AM - 3PM</option>
                          <option value="7AM - 4PM">7AM - 4PM</option>
                          <option value="9AM - 6PM (General Shift)">
                            9AM - 6PM (General Shift)
                          </option>
                          <option value="12PM - 9PM">12PM - 9PM</option>
                          <option value="3PM - 12PM">3PM - 12PM</option>
                          <option value="9PM - 6AM">9PM - 6AM</option>
                        </select>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-black bg-[#2BACDE] transition-all duration-150 rounded-md text-white font-semibold cursor-pointer">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full grid grid-cols-3 gap-6 p-4">
            {[
              
              { label: "First Name", value: user ? user.firstName : "Guest" },
              { label: "Last Name", value: user ? user.lastName : "Guest"},
              { label: "Date of Birth", value: user ? user.dob : "22/06/2001" },
              { label: "Email Address", value: user ? user.email : "abc@berg.co.in" },
              { label: "Phone Number", value: user ? user.phone : "9999999999" },
              { label: "City", value: user ? user.city : "Dehradun"},
            ].map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-gray-500 text-sm">{item.label}</span>
                <span className="text-gray-700 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work-Related Information */}
        <div className="flex flex-col gap-4 bg-white border border-gray-100 rounded-lg shadow-sm py-4 px-8">
          <div className="py-2 border-b border-gray-100 w-full flex justify-between items-center">
            <span className="text-gray-700 font-medium flex items-center gap-1">
              <FaBuilding className="text-[#2BACDE] text-sm" /> Work-Related
              Information
            </span>
          </div>

          <div className="w-full grid grid-cols-3 gap-6 p-4">
            {[
              { label: "Employee ID", value: user ? user.employeeId : "D11111"},
              { label: "Process Name", value: user ? user.process : "CEO"},
              { label: "Shift Timing", value: user ? user.shift : "9AM - 6PM" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-gray-500 text-sm">{item.label}</span>
                <span className="text-gray-700 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
