import globals from "./globals.js";
import {Game, SpriteID, State, FPS} from "./constants.js";
import Sprite from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { Level, level1 } from "./Level.js";
import Timer from "./Timer.js";
import Physics from "./Physics.js";
import { keydownHandler, keyupHandler } from "./events.js";

//Función que inicializa los elementos HTML
function initHTMLelements()
{
    //Canvas
    globals.canvas = document.getElementById('gameScreen');

    //Context
    globals.ctx = globals.canvas.getContext('2d');

    //canvas, context HUD
    globals.canvasHUD = document.getElementById('gameHUD');
    globals.ctxHUD = globals.canvasHUD.getContext('2d');

    //Eliminación del Anti-Aliasing
    globals.ctx.imageSmoothingEnabled = false;

    //Caja de texto para pruebas
    globals.txtPruebas = document.getElementById('txtPruebas');
}

//Función que inicializa las variables del juego
function initVars()
{
    //Inicializamos las variables de gestión de tiempo
    globals.previousCycleMilliseconds = 0;
    globals.deltaTime =                 0;
    globals.frameTimeObj =        1 / FPS; //Frame time in seconds

    //Inicializamos el estado del juego
    globals.gameState = Game.PLAYING;

    //Inicializamos los estado sde las acciones
    globals.action = {
        moveLeft:   false,
        moveRight:  false
    }
}

function loadAssets()
{
    let tileSet;

    //load the spritesheet image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/sprites2.png"; //ojo que la ruta es relativa al HTML, no al JS 
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    //load the bricks image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/fondo15.png"; //ojo que la ruta es relativa al HTML, no al JS 
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);
}

//UPDATE. funcion que se llama cada vez que se carga un archivo
function loadHandler(){
    globals.assetsLoaded++;

    //una vez se han cargado todos los activos pasamos
    if(globals.assetsLoaded === globals.assetsToLoad.length)
    {
        //UPDATE. remove the load event listener
        for(let i = 0; i < globals.tileSets ; ++i)
        {
            globals.tileSets[i].removeEventListener("load", loadHandler, false);
        }
       
        console.log("Assets finished loading");

        //Start the game
        globals.gameState = Game.PLAYING;
    }
}

function initSprites()///////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
    initPlayer();
    initPlataforms();
    initArrow();
}

function initArrow(){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(3, 0, 40, 8, 40, 24, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1);

        //creamos los datos de la animacion. 8 framesn / state
        const physics = new Physics(90);    //velocidad de la flecha, velocidad de las flechas

        //creamos nuestro sprite
        const flecha = new Sprite(SpriteID.ARROW, State.STILL, -30, Math.floor(Math.random() * 150+40), imageSet, frames, 0, 0, physics);

        //añadimos el pirate al array de sprites
        globals.sprites.push(flecha);

}

function initPlataforms(){
    for(let i = 0; i < 3 ; i++){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(40); //velocidad de las plataformas

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataforma = new Sprite(SpriteID.PLATAFORM, State.REGULAR, Math.floor(Math.random() * 200), 0, imageSet, frames, 0, Math.floor(Math.random() * 3), physics);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataforma);
    }

}

function initPlayer()
{
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, gridSize, xOffset, yOffset
    const imageSet = new ImageSet(0, 0, 15, 15, 27, 27, 6, 6);

    //creamos los datos de la animacion. 8 frames / state
    const frames = new Frames(3);

    //creamos nuestro sprite
    const player = new Sprite(SpriteID.PLAYER, State.LEFT, 100, 70, imageSet, frames, 0, 0);

    //añadimos el player al array de sprites
    globals.sprites.push(player);
}

function initLevel()
{
    //creamos las propiedades de las imagenes del mapa: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
    const imageSet = new ImageSet(0, 0, 32, 32, 32, 32, 0, 0);

    //creamos y guardamos nuestro nivel
    globals.level = new Level(level1, imageSet);

}

function initTimers()
{
    //creamos timer de valor 200, con cambios cada 0.5 segundos
    globals.levelTime = new Timer(200, 0.5);
}


function initEvents()
{
    //add the keyboard event listeners
    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);
}








//Exportamos las funciones
export {
    initHTMLelements,
    initVars,
    loadAssets,
    initSprites,
    initLevel,
    initTimers
}