import globals from "./globals.js";
import {Game, SpriteID, State, FPS} from "./constants.js";
import Sprite from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { Level, level1 } from "./Level.js";

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
}

function loadAssets()
{
    let tileSet;

    //load the spritesheet image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/spritesheet.png"; //ojo que la ruta es relativa al HTML, no al JS 
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    //load the bricks image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/bricks.png"; //ojo que la ruta es relativa al HTML, no al JS 
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
    initPirate();
}

function initPirate(){
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, gridSize, xOffset, yOffset
    const imageSet = new ImageSet(5, 0, 32, 47, 64, 17, 16);

    //creamos los datos de la animacion. 8 framesn / state
    const frames = new Frames(8);

    //creamos nuestro sprite
    const pirate = new Sprite(SpriteID.PIRATE, State.RIGHT_2, 100, 100, imageSet, frames);

    //añadimos el pirate al array de sprites
    globals.sprites.push(pirate);
}

function initPlayer()
{
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, gridSize, xOffset, yOffset
    const imageSet = new ImageSet(0, 0, 44, 57, 64, 10, 6);

    //creamos los datos de la animacion. 8 frames / state
    const frames = new Frames(8);

    //creamos nuestro sprite
    const player = new Sprite(SpriteID.PLAYER, State.UP, 100, 70, imageSet, frames);

    //añadimos el player al array de sprites
    globals.sprites.push(player);
}

function initLevel()
{
    //creamos las propiedades de las imagenes del mapa: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
    const imageSet = new ImageSet(0, 0, 32, 32, 32, 0, 0);

    //creamos y guardamos nuestro nivel
    globals.level = new Level(level1, imageSet);

}





//Exportamos las funciones
export {
    initHTMLelements,
    initVars,
    loadAssets,
    initSprites,
    initLevel
}