
export const getRandomFood = (size) => ({
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size),
  });
  
  export const moveSnake = (snake, direction) => {
    const head = { ...snake[0] };
    if (direction === "LEFT") head.x -= 1;
    if (direction === "RIGHT") head.x += 1;
    if (direction === "UP") head.y -= 1;
    if (direction === "DOWN") head.y += 1;
    return [head, ...snake];
  };
  
  export const checkCollision = (snake, size) => {
    const head = snake[0];
    return head.x < 0 || head.y < 0 || head.x >= size || head.y >= size || snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
  };
  