import React, { useState, useEffect } from "react";
import { FaSquare, FaAppleAlt } from "react-icons/fa";
import snakeFace from "../assets/img/icons/snake.png";
import Alert from "../components/Alert";
import "../index.css";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const FOOD_POSITION = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const SnakeGamePage = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(FOOD_POSITION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(() => {
    return localStorage.getItem("lastScore") || 0;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection =
        e.key === "ArrowUp" && direction.y !== 1
          ? { x: 0, y: -1 }
          : e.key === "ArrowDown" && direction.y !== -1
          ? { x: 0, y: 1 }
          : e.key === "ArrowLeft" && direction.x !== 1
          ? { x: -1, y: 0 }
          : e.key === "ArrowRight" && direction.x !== -1
          ? { x: 1, y: 0 }
          : direction;
      setDirection(newDirection);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || !gameStarted || gamePaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };

        // Check for wall collision
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check for self-collision
        if (
          newSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setFood(FOOD_POSITION);
          setScore((prevScore) => prevScore + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 200);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, gameStarted, gamePaused]);

  useEffect(() => {
    if (!gameStarted || gameOver || gamePaused) return;

    const timer = setInterval(() => {
      setPlayTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, gamePaused]);

  useEffect(() => {
    if (gameOver) {
      localStorage.setItem("lastScore", score);
      setLastScore(score);
    }
  }, [gameOver, score]);

  const handleAlertClose = () => {
    setGameOver(false);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(FOOD_POSITION);
    setGameStarted(false);
    setGamePaused(false);
    setPlayTime(0);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-black gap-4">
      <div className="mb-4 px-8 w-full flex justify-center gap-12 text-sm font-semibold">
        <div>
          Play Time: <span className="text-[#2BACDE]">{playTime}</span> Sec
        </div>
        <div>
          Score: <span className="text-[#2BACDE]">{score}</span>
        </div>
        <div>
          Last Score: <span className="text-[#2BACDE]">{lastScore}</span>
        </div>
      </div>
      <div
        className="grid gap-1 p-4 border border-gray-100 bg-white rounded-lg"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
        }}
      >
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y
          );
          const isFood = food.x === x && food.y === y;
          return (
            <div key={i} className="w-5 h-5 flex justify-center items-center">
              {isHead ? (
                <img src={snakeFace} alt="snake_icon" draggable="false" />
              ) : isSnake ? (
                <FaSquare className="text-lime-500" />
              ) : isFood ? (
                <FaAppleAlt className="text-red-400" />
              ) : (
                <div className="w-full h-full bg-gray-100"></div>
              )}
            </div>
          );
        })}
      </div>
      {!gameStarted && !gameOver && (
        <button
          onClick={() => {
            setGameStarted(true);
            setPlayTime(0);
            setScore(0);
          }}
          className="p-2 flex justify-center items-center gap-1 bg-gradient-to-br hover:bg-gradient-to-tr from-green-300 to-green-500 transition-all duration-150 rounded-md text-white font-semibold cursor-pointer"
        >
          Start Game
        </button>
      )}
      {gameStarted && !gameOver && (
        <button
          onClick={() => setGamePaused(!gamePaused)}
          className="p-2 flex justify-center items-center gap-1 bg-gradient-to-br hover:bg-gradient-to-tr from-yellow-300 to-yellow-500 transition-all duration-150 rounded-md text-white font-semibold cursor-pointer"
        >
          {gamePaused ? "Resume Game" : "Pause Game"}
        </button>
      )}
      {gameOver && (
        <button
          onClick={() => {
            setSnake(INITIAL_SNAKE);
            setDirection(INITIAL_DIRECTION);
            setFood(FOOD_POSITION);
            setGameOver(false);
            setGameStarted(false);
            setGamePaused(false);
          }}
          className="p-2 flex justify-center items-center gap-1 bg-gradient-to-br hover:bg-gradient-to-tr from-blue-300 to-blue-500 transition-all duration-150 rounded-md text-white font-semibold cursor-pointer"
        >
          Restart Game
        </button>
      )}
      {gameOver && (
        <Alert
          message={`Game Over! Your score is ${score}`}
          onClose={handleAlertClose}
        />
      )}
    </div>
  );
};

export default SnakeGamePage;
