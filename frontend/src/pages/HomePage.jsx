import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../index.css";

import {
  FaChartGantt,
  FaChartSimple,
  FaClock,
  FaGear,
  FaListCheck,
  FaMessage,
  FaMugHot,
  FaPlay,
  FaPlus,
  FaStop,
  FaTrash,
} from "react-icons/fa6";
import { useUser } from "../firebase/userContext";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { onSnapshot } from "firebase/firestore";

export default function HomePage() {
  const { user } = useUser();
  const UID = user?.uid;

  const [production, setProduction] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [process, setProcess] = user
    ? useState(user.process)
    : useState(localStorage.getItem("process"));
  const [activity, setActivity] = useState(
    localStorage.getItem("activity") || ""
  );
  const [todos, setTodos] = useState([]);
  const [isStartDisabled, setIsStartDisabled] = useState(false);
  const [isEndDisabled, setIsEndDisabled] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!UID) return; // Avoid running if UID is not available

    const formattedDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const dailyRef = doc(
      db,
      "EmployeeActivity",
      UID,
      "dailyData",
      formattedDate
    );

    // ✅ Setting up real-time listener
    const unsubscribe = onSnapshot(dailyRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduction(data.production || 0);
        setBreakTime(data.break || 0);
      } else {
        console.log("No data found for today.");
        setProduction(0);
        setBreakTime(0);
      }
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => unsubscribe();
  }, [UID]); // Runs when UID changes

  useEffect(() => {
    localStorage.setItem("process", process);
    localStorage.setItem("activity", activity);
    localStorage.setItem("isStartDisabled", isStartDisabled);
    localStorage.setItem("isEndDisabled", isEndDisabled);
    localStorage.setItem("isDisabled", isDisabled);
  }, [process, activity, isStartDisabled, isEndDisabled, isDisabled]);

  // Load tasks from local storage on component mount
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  // Save tasks to local storage whenever `todos` change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = (event) => {
    event.preventDefault();
    const newTodo = event.target.elements.todoInput.value.trim();
    if (newTodo) {
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      event.target.reset(); // Clear input
    }
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  useEffect(() => {
    console.log("Use Effect Called");
    const savedStartTime = localStorage.getItem("startTimestamp");
    const savedIsRunning = localStorage.getItem("isRunning") === "true";

    if (savedStartTime && savedIsRunning) {
      const elapsedTime = Math.floor(
        (Date.now() - parseInt(savedStartTime, 10)) / 1000
      );
      setTimer(elapsedTime);
      startTimer(elapsedTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Start Timer
  const startTimer = (resumeTime = 0) => {
    setIsStartDisabled(true);
    setIsEndDisabled(false);
    setIsDisabled(true);

    if (isRunning) return;

    if (activity == "") {
      alert("Please select activity");
      return;
    } else if (process == "") {
      alert("Please select process");
      return;
    }

    const startTime = Date.now() - resumeTime * 1000;

    const startTimeTwo = new Date();
    let formattedStartTime = localStorage.getItem("startTimeTwo");

    if (!formattedStartTime) {
      const startTimeTwo = new Date();
      formattedStartTime = startTimeTwo.toLocaleTimeString("en-GB", {
        hour12: false,
      });

      localStorage.setItem("startTimeTwo", formattedStartTime); // Store it only if not set
    }

    localStorage.setItem("startTimestamp", startTime.toString());
    localStorage.setItem("isRunning", "true");
    localStorage.setItem("activity", activity);
    localStorage.setItem("process", process);

    const id = setInterval(() => {
      setTimer((prev) => prev + 1); // Increment the timer by 1 second
    }, 1000);

    setIntervalId(id);
    setIsRunning(true);
  };

  // Stop Timer
  const stopTimer = async () => {
    setTimer(0); // Reset Timer after saving
    setIsStartDisabled(false);
    setIsEndDisabled(true);
    setIsDisabled(false);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = year + "-" + month + "-" + day;

    if (localStorage.getItem("process") == null) {
      process = user?.process;
    }

    const endTime = new Date();
    var formattedEndTime = endTime.toLocaleTimeString("en-GB", {
      hour12: false,
    });

    const startTimeStr = localStorage.getItem("startTimeTwo");
    const endTimeStr = formattedEndTime;

    const startSeconds = timeToSeconds(startTimeStr);
    const endSeconds = timeToSeconds(endTimeStr);

    let durationSeconds = endSeconds - startSeconds;

    if (durationSeconds < 0) {
      durationSeconds += 24 * 3600;
    }

    const duration = formatTime(durationSeconds);
   
    console.log(duration);
    try {
      const activityRef = collection(db, "EmployeeActivity", UID, "activity");
      await addDoc(activityRef, {
        date: formattedDate,
        process: process,
        activity: activity,
        uid: user?.uid,
        startTime: localStorage.getItem("startTimeTwo"),
        endTime: formattedEndTime,
        duration: duration,
      });

     

      const dailyRef = doc(
        db,
        "EmployeeActivity",
        UID,
        
        "dailyData",
        formattedDate
      );
      const dailyDoc = await getDoc(dailyRef);

      if (dailyDoc.exists()) {
        const data = dailyDoc.data();

        // Convert duration to seconds before updating
        const durationSeconds = timeToSeconds(duration);

        if (activity === "Production") {
          await updateDoc(dailyRef, {
            production: (data.production ?? 0) + durationSeconds, // Proper update
          });
        } else if (activity === "Break") {
          await updateDoc(dailyRef, {
            break: (data.break ?? 0) + durationSeconds, // Proper update
          });
        }
      } else {
        await setDoc(dailyRef, {
          date: formattedDate,
          production: activity === "Production" ? timeToSeconds(duration) : 0,
          break: activity !== "Production" ? timeToSeconds(duration) : 0,
        });
      }
    } catch (e) {
      console.error("Error writing document: ", e);
    }

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
    localStorage.removeItem("startTimestamp");
    localStorage.removeItem("activity");
    localStorage.setItem("isRunning", "false");
    localStorage.removeItem("startTimeTwo");
  };

  // Format Time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Convert HH:MM:SS to seconds
  function timeToSeconds(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  return (
    <div className="h-screen grid grid-cols-5 bg-gray-50 p-2">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="col-span-4 flex flex-col gap-4 h-full py-2 px-4 overflow-y-scroll">
        <Navbar />

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 items-center justify-center gap-4">
          {[
            {
              icon: <FaClock size={32} />,
              title: formatTime(timer),
              subtitle: "Total Time",
            },
            {
              icon: <FaGear size={32} />,
              title: formatTime(production),
              subtitle: "Production Time",
            },
            {
              icon: <FaMugHot size={32} />,
              title: formatTime(breakTime),
              subtitle: "Break Time",
            },
            {
              icon: <FaMessage size={32} />,
              title: "00:00:00",
              subtitle: "Feedback Time",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg_icons text-white p-4 flex flex-col gap-1 w-full h-full justify-center items-center mx-auto rounded-lg shadow-lg hover:shadow-xs transition-all duration-150"
            >
              {item.icon}
              <span className="text-2xl font-semibold text-[#2f2f2f]">
                {item.title}
              </span>
              {item.subtitle && (
                <span className="text-sm font-semibold">{item.subtitle}</span>
              )}
            </div>
          ))}
        </div>

        {/* Activity Tracker & To-Do List */}
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="flex flex-col gap-4">
            {/* Activity Tracker */}
            <div className="bg-white bg_card rounded-lg shadow-sm p-4 flex flex-col gap-4">
              <h5 className="flex items-center gap-2 font-medium text-gray-600">
                <FaChartGantt className="text-[#2BACDE]" />
                Activity Tracker
              </h5>
              <div className="flex flex-col gap-4 py-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Process
                  </label>
                  <select
                    className="block w-full p-2 border border-gray-200 text-gray-600 rounded-md"
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                    disabled={isDisabled}
                  >
                    <option value="">Select Process</option>
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
                    Select Activity
                  </label>
                  <select
                    className="block w-full p-2 border border-gray-200 text-gray-600 rounded-md"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    disabled={isDisabled}
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="Production">Production</option>
                    <option value="Break">Tea Break</option>
                    <option value="Break">Lunch Break</option>
                    <option value="Break">Bio Break</option>
                    <option value="Production">Team Meeting</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {/* Start button */}
                  <button
                    className="p-2 flex justify-center items-center gap-1 bg-gradient-to-br hover:bg-gradient-to-tr from-green-300 to-green-500 transition-all duration-150 rounded-md text-white font-semibold cursor-pointer"
                    type="button"
                    onClick={() => startTimer(timer)}
                    disabled={isStartDisabled}
                  >
                    <FaPlay />
                    Start
                  </button>

                  {/* End button */}
                  <button
                    className="p-2 flex justify-center items-center gap-1 bg-gradient-to-br hover:bg-gradient-to-tr from-red-300 to-red-500 transition-all duration-150 rounded-md text-white font-semibold cursor-pointer"
                    type="button"
                    onClick={stopTimer}
                    disabled={isEndDisabled}
                  >
                    <FaStop />
                    End
                  </button>
                </div>
              </div>
            </div>

            {/* To-Do List */}
            <div className="h-full bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col gap-4">
              <h5 className="flex items-center gap-2 font-medium text-gray-600">
                <FaListCheck className="text-[#2BACDE]" />
                To-Do List
              </h5>

              {/* To-Do Input Form */}
              <form onSubmit={addTodo} className="flex gap-2">
                <input
                  type="text"
                  name="todoInput"
                  className="flex-1 p-2 border border-gray-200 rounded-md"
                  placeholder="Add a new task..."
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#2EC4FF]  cursor-pointer text-white rounded-md hover:bg-[#3B71B6] transition"
                >
                  <FaPlus />
                </button>
              </form>

              {/* To-Do List Items */}
              <ul className="space-y-2 max-h-40 overflow-y-scroll">
                {todos.length > 0 ? (
                  todos.map((todo, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                    >
                      <span className="text-gray-800">{todo}</span>
                      <button
                        onClick={() => removeTodo(index)}
                        className="text-red-500 hover:text-red-700 transition-all duration-300 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-center text-sm p-2">
                    No tasks yet.
                  </li>
                )}
              </ul>
            </div>
          </div>
          {/* graph here */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col gap-4">
            <h5 className="flex items-center gap-2 font-medium text-gray-600">
              <FaChartSimple className="text-[#2BACDE]" />
              Activity View
            </h5>
          </div>
        </div>
      </main>
    </div>
  );
}
