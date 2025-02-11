import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import logo from "../assets/img/logo/logo_full.png";
import { useState } from "react";
import handleSignup from "../firebase/signupHandler";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    employeeId: "",
    city: "",
    process: "",
    shift: "",
    password: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <AuthLayout>
      <div className="flex items-center justify-between">
        <h2 className="text-black font-bold text-2xl">Sign Up</h2>
        <img
          src={logo}
          className="w-24 py-4"
          alt="logo_full"
          draggable="false"
        />
      </div>

      {/* SignUp Form */}
      <form onSubmit={(e) => handleSignup(e, userData, navigate)}>
        <div className="py-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={userData.firstName}
              onChange={handleChange}
            />
            <FormInput
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={userData.lastName}
              onChange={handleChange}
            />
            <FormInput
              label="Date of Birth"
              type="date"
              name="dob"
              placeholder="Enter your date of birth"
              value={userData.dob}
              onChange={handleChange}
            />
            <FormInput
              label="Phone Number"
              type="number"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={userData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <FormInput
            label="Email address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={userData.email}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={userData.password}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4 items-center">
            <FormInput
              label="Employee ID"
              type="text"
              name="employeeId"
              placeholder="Enter your employee ID"
              value={userData.employeeId}
              onChange={handleChange} //function to handle employee id changes to set city
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <select
                name="city"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={userData.city}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select City
                </option>
                <option value="Jammu">Jammu</option>
                <option value="Dehradun">Dehradun</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Process
              </label>
              <select
                name="process"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={userData.process}
                onChange={handleChange}
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
                name="shift"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={userData.shift}
                onChange={handleChange}
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
          <div className="flex justify-end text-sm">
            <Link
              to="/"
              className="text-[#2BACDE] hover:text-black transition-all duration-300"
            >
              Already have an account?
            </Link>
          </div>
          <button
            className="p-2 hover:bg-black bg-[#2BACDE] transition-all duration-150 rounded-md text-white font-semibold cursor-pointer"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>

      <p className="text-gray-400 text-xs text-center">2025© BERG.CO.IN</p>
    </AuthLayout>
  );
}
