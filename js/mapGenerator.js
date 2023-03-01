
function initMapWithWalls(width, height) {
    const map = new Array(height).fill([]);
    for (let y = 0; y < height; ++y) {
        map[y] = new Array(width).fill(1);
    }
    return map;
}

function addNeighbourWallToList(map, walls, randomY, randomX, height, width) {
    if (randomY - 1 >= 1 && map[randomY - 1][randomX] === 1) {
        walls.push({ y: randomY - 1, x: randomX });
    }
    if (randomY + 1 < height - 1 && map[randomY + 1][randomX] === 1) {
        walls.push({ y: randomY + 1, x: randomX });
    }
    if (randomX - 1 >= 1 && map[randomY][randomX - 1] === 1) {
        walls.push({ y: randomY, x: randomX - 1 });
    }
    if (randomX + 1 < width - 1 && map[randomY][randomX + 1] === 1) {
        walls.push({ y: randomY, x: randomX + 1 });
    }
}

export function generateMap(startY, startX, width, height) {
    const map = initMapWithWalls(width, height);
    const walls = [];
    map[startY][startX] = 0;
    addNeighbourWallToList(map, walls, startY, startX, height, width);
    while (walls.length > 0) {
        const randomWall = walls[Math.floor(Math.random() * walls.length)];
        let counter = 0;
        if (randomWall.y - 1 >= 0 && map[randomWall.y - 1][randomWall.x] === 0) {
            ++counter;
        }
        if (randomWall.y + 1 < height && map[randomWall.y + 1][randomWall.x] === 0) {
            ++counter;
        }
        if (randomWall.x - 1 >= 0 && map[randomWall.y][randomWall.x - 1] === 0) {
            ++counter;
        }
        if (randomWall.x + 1 < width && map[randomWall.y][randomWall.x + 1] === 0) {
            ++counter;
        }
        if (counter === 1) {
            map[randomWall.y][randomWall.x] = 0;
            addNeighbourWallToList(map, walls, randomWall.y, randomWall.x, height, width);
        }
        walls.splice(walls.indexOf(randomWall), 1);
    }
    return map;
}

