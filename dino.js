// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoDuckHeight = 50;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg1, dinoImg2, dinoDuckImg;
let dinoFrame = 0; 
let isDucking = false;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// bird
let birdArray = [];
let birdWidth = 92;
let birdHeight = 65;
let birdX = 700;
let birdY = 100; 
let birdImg1, birdImg2;
let birdFrame = 0; 

// ground
let groundImg;
let groundX = 0;
let groundY = boardHeight - 30; 

// physics
let velocityX = -8;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // Load images
    dinoImg1 = new Image();
    dinoImg1.src = "./pics/dino-run1.png"; 
    dinoImg2 = new Image();
    dinoImg2.src = "./pics/dino-run2.png"; 
    dinoDuckImg = new Image();
    dinoDuckImg.src = "./pics/dino-duck2.png"; 

    cactus1Img = new Image();
    cactus1Img.src = "./pics/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./pics/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./pics/cactus3.png";

    birdImg1 = new Image();
    birdImg1.src = "./pics/bird1.png"; 
    birdImg2 = new Image();
    birdImg2.src = "./pics/bird2.png"; 

    groundImg = new Image();
    groundImg.src = "./pics/track.png"; 

    requestAnimationFrame(update);
    setInterval(placeObstacle, 1000);
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keyup", stopDinoDuck);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // ground
    context.drawImage(groundImg, groundX, groundY, boardWidth, 30);
    context.drawImage(groundImg, groundX + boardWidth, groundY, boardWidth, 30);

    groundX += velocityX;
    if (groundX <= -boardWidth) {
        groundX = 0;
    }

    //dino
    if (!isDucking) {
        velocityY += gravity;
        dino.y = Math.min(dino.y + velocityY, dinoY);
    }

   
    let currentDinoImg = isDucking ? dinoDuckImg : (dinoFrame % 20 < 10 ? dinoImg1 : dinoImg2);
    context.drawImage(currentDinoImg, dino.x, dino.y, dino.width, dino.height);
    if (!isDucking) {
        dinoFrame++;
    }

    // Cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            
            break; 
        }
    }

    // Bird
    for (let i = 0; i < birdArray.length; i++) {
        let bird = birdArray[i];
        bird.x += velocityX;
        let currentBirdImg = birdFrame % 20 < 10 ? birdImg1 : birdImg2;
        context.drawImage(currentBirdImg, bird.x, bird.y, bird.width, bird.height);

        if (detectCollision(dino, bird)) {
            gameOver = true;  
            break; 
        }
    }
    birdFrame++;

    // Score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText("Score: " + score, boardWidth - 150, 20);
}


function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        isDucking = true;
        dino.height = dinoDuckHeight;
        dino.y = boardHeight - dinoDuckHeight;
    }
}

function stopDinoDuck(e) {
    if (e.code == "ArrowDown" && isDucking) {
        isDucking = false;
        dino.height = dinoHeight;
        dino.y = boardHeight - dinoHeight;
    }
}

function placeObstacle() {
    if (gameOver) {
        return;
    }

    let obstacleChance = Math.random();

    if (obstacleChance > 0.40) {
        let cactus = {
            img: null,
            x: cactusX,
            y: cactusY,
            width: null,
            height: cactusHeight
        }

        let placeCactusChance = Math.random();

        if (placeCactusChance > .90) {
            cactus.img = cactus3Img;
            cactus.width = cactus3Width;
            cactusArray.push(cactus);
        }
        else if (placeCactusChance > .70) {
            cactus.img = cactus2Img;
            cactus.width = cactus2Width;
            cactusArray.push(cactus);
        }
        else if (placeCactusChance > .50) {
            cactus.img = cactus1Img;
            cactus.width = cactus1Width;
            cactusArray.push(cactus);
        }
    } else {
        
        let bird = {
            img1: birdImg1,
            img2: birdImg2,
            x: birdX,
            y: birdY,
            width: birdWidth,
            height: birdHeight
        }

        birdArray.push(bird);
    }

    
    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
    if (birdArray.length > 5) {
        birdArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
