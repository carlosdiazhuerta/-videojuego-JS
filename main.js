const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

window.addEventListener("load", starGame);

function starGame(){
    let canvasSize;

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);

    const elementsSize = (canvasSize / 10)-1;
    game.font = elementsSize + "px Verdana";
    game.textAlign= "end";
    for (let i= 1; i <= 10; i++) {
        for (let z = 1; z <= 10; z++) {
        game.fillText(emojis['X'], elementsSize * i + 15, elementsSize * z - 10);
        }
    }
} 
