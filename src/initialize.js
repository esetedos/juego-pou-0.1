import globals from "./globals.js";
import {Game, SpriteID, State, FPS} from "./constants.js";
import Sprite, { Plataformas, PlataformasN} from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { Level, level1 } from "./Level.js";
import Timer from "./Timer.js";
import Physics from "./Physics.js";
import { keydownHandler, keyupHandler } from "./events.js";
import HitBox from "./HitBox.js";

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
        moveRight:  false,
        jump:       false
    }

    //Variables logica juego
    globals.life = 400;
    globals.saltoKop = 0;
}

function loadAssets()
{
    let tileSet;

    //load the spritesheet image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/sprites6.png"; //ojo que la ruta es relativa al HTML, no al JS 
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    //load the bricks image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/fondo18.png"; //ojo que la ruta es relativa al HTML, no al JS 
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
    initCarrot();
    initPlataformsN();
}

function initPlataformsN(){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(4, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1, 5);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(40); //velocidad de las plataformas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 1, 0, 0)

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataformaN = new PlataformasN(SpriteID.PLATAFORMN, State.SOLID, 30, -20, imageSet, frames, physics, 2, 5, hitBox);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataformaN);

}

function initCarrot()
{
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, gridSize, xOffset, yOffset
    const imageSet = new ImageSet(6, 0, 10, 6, 10, 24, 0, 8);

    //creamos los datos de la animacion. 8 frames / state
    const frames = new Frames(1); //en teoría debería ser (0, 5)

    //creamos nuestro objeto physics con vLimit = 40 pixeles/seconds
    const physics = new Physics(40);

    //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
    const hitBox = new HitBox(6, 2, 2, 2)

    //creamos nuestro sprite
    const carrot = new Sprite(SpriteID.CARROT, State.SOLID_3, 150, 60, imageSet, frames, physics, hitBox);

    //añadimos el player al array de sprites
    globals.sprites.push(carrot);
}

//algo
function initArrow(){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(5, 0, 40, 8, 40, 24, 0, 12); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1);
        
        //creamos los datos de la animacion. 8 framesn / state
        const physics = new Physics(10);    //velocidad de la flecha, velocidad de las flechas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 8, 2)

        //creamos nuestro sprite
        const flecha = new Sprite(SpriteID.ARROW, State.SOLID_2, -30, Math.floor(Math.random() * 150+40), imageSet, frames, physics, hitBox);

         //añadimos el pirate al array de sprites
        globals.sprites.push(flecha);

}

function initPlataforms(){
    for(let i = 0; i < 3 ; i++){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(4, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1, 5);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(40); //velocidad de las plataformas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 1, 0, 0)

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, Math.floor(Math.random() * 200), 0, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataforma);
    }

}

function initPlayer()
{
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, gridSize, xOffset, yOffset
    const imageSet = new ImageSet(0, 0, 15, 15, 27, 27, 6, 6);

    //creamos los datos de la animacion. 8 frames / state
    const frames = new Frames(3, 5); //en teoría debería ser (0, 5)

    //creamos nuestro objeto physics con vLimit = 40 pixeles/seconds
    const physics = new Physics(40, 40, 0.98, -100);

    //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
    //Para la colisión con las plataformas
    const hitBox = new HitBox(11, 2, 2, 14)

    //Segunda hitBox para la colisión con los objetos (arrow y carrot)
    const hitBox2 = new HitBox(10, 12, 3, 3)

    //creamos nuestro sprite
    const player = new Sprite(SpriteID.PLAYER, State.RIGHT, 50, 160, imageSet, frames, physics, hitBox, hitBox2);

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
    globals.levelTime = new Timer(0, 0.5);
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
    initTimers,
    initEvents
}