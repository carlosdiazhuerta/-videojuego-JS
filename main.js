const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');


const reset_button = document.querySelector('#reset_button');

reset_button.addEventListener('click', resetGame);

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition= {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemyPositions = [];

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

function fixNumber(n) {
  return Number(n.toFixed(0));
}

function resizeCanvas () {
    windowHeight = window.innerHeight * 0.9;
    windowWidth = window.innerWidth * 0.9;
    //Dependiendo del tamaño de la pantalla, va a colocar el tamaño cuadrado del canvas
    //Al dividir entre 10 y luego aproximar el valor a un entero garantiza que el canvas será un entero múltiplo de 10. Finalmente se multiplica la expresión por 10 para obtener el dato real del canvas
    //Con Math.ceil nos ahorramos el problema de los decimales
    if (window.innerHeight > window.innerWidth) {
        if ((windowWidth % 10) !== 0) {
             canvasSize = Math.ceil(windowWidth / 10) * 10;
        } else {
             canvasSize = windowWidth;
        }} 
    else {
        if ((windowHeight % 10) !== 0) {
             canvasSize = Math.ceil(windowHeight / 10) * 10;
        } else {
             canvasSize = windowHeight;
        }
    }

     canvas.setAttribute('width', canvasSize);
     canvas.setAttribute('height', canvasSize);
     elementsSize = (canvasSize / 10);
     startGame();
 }
function startGame() {
  console.log({ canvasSize, elementsSize });
  // console.log(window.innerWidth, window.innerHeight);

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }
  
  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  console.log({map, mapRows, mapRowCols});

  showLives();
  
  enemyPositions = [];
  game.clearRect(0,0,canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          // console.log({playerPosition});
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      
      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
}

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;
  
    if(giftCollision) {
      winningLevel();
    } 
    const enemyCollision = enemyPositions.find(enemy => {
      const enemyCollisionX =  enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
      const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
      return enemyCollisionX && enemyCollisionY;
    });
  
    if (enemyCollision) {
        showColision();
        //espera 1 segundo para empezar la funciona level fail//
        setTimeout (levelFail,1000);
    }
  
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    
  }
  
  function winningLevel() {
    console.log('Level up');
    level ++;
    startGame();
  }

function levelWin() {
  console.log('Subiste de nivel');
  level++;
  startGame();
}

function levelFail() {
  console.log('Chocaste contra un enemigo :(');
  lives--;
  
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log('¡Terminaste el juego!');
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'SUPERASTE EL RECORD :)';
    } else {
      pResult.innerHTML = 'lo siento, no superaste el records :(';
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)';
  }

  console.log({recordTime, playerTime});
}
function showColision() {
    game.fillText (emojis['BOMB_COLLISION'], playerPosition.x, playerPosition.y);
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    console.log ('choque');
  }

function showLives() {
  const heartsArray = Array(lives).fill(emojis['HEART']); // [1,2,3]
  
  spanLives.innerHTML = "";
  heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {
  console.log('Me quiero mover hacia arriba');
  if ((playerPosition.y - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
     playerPosition.y-= elementsSize;
    startGame();
  }
}

function moveLeft() {
  console.log('Me quiero mover hacia izquierda');

  if ((playerPosition.x - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  console.log('Me quiero mover hacia derecha');

  if ((playerPosition.x + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function resetGame() {
    location.reload();
}
function moveDown() {
  console.log('Me quiero mover hacia abajo');
  
  if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}