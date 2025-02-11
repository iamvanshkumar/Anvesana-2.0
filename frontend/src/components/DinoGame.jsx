import React, { useEffect, useRef, useState } from "react";
import dinoImg from "../assets/img/icons/dino.png"; // Dino sprite
import cactusImg from "../assets/img/icons/cactus.png"; // Obstacle sprite
import "../index.css"; // Import styles

const DinoGame = () => {
    const [isJumping, setIsJumping] = useState(false);
    const [dinoTop, setDinoTop] = useState(150);
    const [cactusLeft, setCactusLeft] = useState(400);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const dinoRef = useRef(null);

    useEffect(() => {
        let gravityInterval;
        if (isJumping) {
            gravityInterval = setInterval(() => {
                setDinoTop((prevTop) => (prevTop >= 150 ? 150 : prevTop + 5));
            }, 20);
        }
        return () => clearInterval(gravityInterval);
    }, [isJumping]);

    useEffect(() => {
        if (!isGameOver) {
            const cactusInterval = setInterval(() => {
                setCactusLeft((prevLeft) => (prevLeft <= -20 ? 400 : prevLeft - 5));
            }, 30);

            const collisionInterval = setInterval(() => {
                const dino = dinoRef.current;
                if (dino && cactusLeft >= 10 && cactusLeft <= 50 && dinoTop >= 120) {
                    setIsGameOver(true);
                    alert("Game Over! Your Score: " + score);
                    window.location.reload();
                }
            }, 10);

            const scoreInterval = setInterval(() => {
                setScore((prevScore) => prevScore + 1);
            }, 500);

            return () => {
                clearInterval(cactusInterval);
                clearInterval(collisionInterval);
                clearInterval(scoreInterval);
            };
        }
    }, [cactusLeft, dinoTop, isGameOver]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "Space") {
                event.preventDefault();
                handleJump();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleJump = () => {
        if (!isJumping) {
            setIsJumping(true);
            let jumpHeight = 0;
            const jumpInterval = setInterval(() => {
                if (jumpHeight >= 40) {
                    clearInterval(jumpInterval);
                    setIsJumping(false);
                } else {
                    setDinoTop((prevTop) => prevTop - 5);
                    jumpHeight += 5;
                }
            }, 20);
        }
    };

    return (
        <div className="game-container" onClick={handleJump}>
            <h2>Chrome Dino Game</h2>
            <div className="game">
                <img
                    src={dinoImg}
                    alt="Dino"
                    className="dino"
                    ref={dinoRef}
                    style={{ top: `${dinoTop}px` }}
                />
                <img
                    src={cactusImg}
                    alt="Cactus"
                    className="cactus"
                    style={{ left: `${cactusLeft}px` }}
                />
            </div>
            <h3>Score: {score}</h3>
            <p>Click or press space to jump</p>
        </div>
    );
};

export default DinoGame;
