import React, { useState, useEffect } from "react";
import SnakeBoard from "../components/SnakeBoard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaDragon, FaGamepad } from "react-icons/fa";
import DinoGame from "../components/DinoGame"; 

const GamePage = () => {
  return (
    <div className="h-screen grid grid-cols-5 bg-gray-50 p-2">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="col-span-4 flex flex-col gap-4 h-full py-2 px-4 overflow-y-scroll">
        <Navbar />

        <div className="bg_card rounded-lg shadow-sm p-4 flex flex-col gap-4">
            <h5 className="flex items-center gap-2 font-medium text-gray-600">
              <FaGamepad className="text-[#2BACDE]" />
              Snake Game
            </h5>
            <SnakeBoard />
          </div>
          
        {/* <div className="grid grid-cols-2 gap-4">
          <div className="bg_card rounded-lg shadow-sm p-4 flex flex-col gap-4">
            <h5 className="flex items-center gap-2 font-medium text-gray-600">
              <FaGamepad className="text-[#2BACDE]" />
              Snake Game
            </h5>
            <SnakeBoard />
          </div>
          <div className="bg_card rounded-lg shadow-sm p-4 flex flex-col gap-4">
            <h5 className="flex items-center gap-2 font-medium text-gray-600">
              <FaDragon className="text-[#2BACDE]" />
              Dino Game
            </h5>
            <DinoGame />
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default GamePage;
