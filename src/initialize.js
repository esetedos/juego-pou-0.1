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
    globals.gameState = Game.NEW_GAME;

    //Inicializamos los estado sde las acciones
    globals.action = {
        moveLeft:   false,
        moveRight:  false,
        jump:       false
    }

    //Variables logica juego
    globals.life = 3;
    globals.saltoKop = 0;
}

function loadAssets()
{
    let tileSet;
    let new_game;

    //load the spritesheet image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/sprites8.png"; //ojo que la ruta es relativa al HTML, no al JS 
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    //load the bricks image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/fondo18.png"; //ojo que la ruta es relativa al HTML, no al JS 
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    new_game = new Image();
    new_game.addEventListener("load", loadHandler, false);
    new_game.src = "./images/pantalla_inicio.png";  //Ojo que la ruta es relativa al HTML, no al JS
    globals.tileMap.push(new_game);
    globals.assetsToLoad.push(new_game);
}

//UPDATE. funcion que se llama cada vez que se carga un archivo
function loadHandler(){
    globals.assetsLoaded++;

    //una vez se han cargado todos los activos pasamos
    if(globals.assetsLoaded === globals.assetsToLoad.length)
    {
        //UPDATE. remove the load event listener
        for(let i = 0; i < globals.tileSets; ++i)
        {
            globals.tileSets[i].removeEventListener("load", loadHandler, false);
        }
       
        console.log("Assets finished loading");

        //Start the game
        globals.gameState = Game.NEW_GAME;
    }
}

function initSprites()///////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
    initPlayer();
    initPlataforms();
    initArrow();
    initCarrot();
    initPlataformsN();
    initPlataformsMoviento();
}

function initPlataformsMoviento(){
    for(let i = 0; i < 2 ; i++){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(2, 1, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1, 5);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(20, 0, 0); //velocidad de las plataformas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 0, 0)

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataforma = new Plataformas(SpriteID.PLATAFORMMOVIMIENTO, State.SOLID_5, Math.floor(Math.random() * 200), 35, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox, Math.random()*30+1);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataforma);
    }

}

function initPlataformsN(){
    let b = 0;
    for(let a = 0; a < 2; a++)
    {
        for(let i = 0; i < 2; ++i){
            //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
            const imageSet = new ImageSet(2, 2, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

            //creamos los datos de la animacion. 8 framesn / state
            const frames = new Frames(1, 5);

            //creamos nuestro objeto physics con vLimit = 40 pixels/second
            const physics = new Physics(1, 0); //velocidad de las plataformas

            //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
            const hitBox = new HitBox(30, 4, 0, 0)

            //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
            const plataformaN = new PlataformasN(SpriteID.PLATAFORMN, State.SOLID, Math.floor(Math.random()*150+30), b, imageSet, frames, physics, 2, 5, hitBox);

            //añadimos el pirate al array de sprites
            globals.sprites.push(plataformaN);
        }
        //la plataforma extra por si todas las nubes desaparecen, pa' q al menos esta aguante

            //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
            const imageSet = new ImageSet(2, 2, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

            //creamos los datos de la animacion. 8 framesn / state
            const frames = new Frames(1, 5);

            //creamos nuestro objeto physics con vLimit = 40 pixels/second
            const physics = new Physics(1, 0); //velocidad de las plataformas

            //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
            const hitBox = new HitBox(30, 4, 0, 0)

            //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
            const plataformaN = new PlataformasN(SpriteID.PLATAFORMN, State.SOLID, 300, b, imageSet, frames, physics, 2, 5, hitBox);

            //añadimos el pirate al array de sprites
            globals.sprites.push(plataformaN);

        b = 73;
    }

}

function initCarrot()
{
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, gridSize, xOffset, yOffset
    const imageSet = new ImageSet(4, 0, 10, 6, 10, 24, 0, 2);

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
        const imageSet = new ImageSet(3, 0, 40, 8, 40, 24, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1);
        
        //creamos los datos de la animacion. 8 framesn / state
        const physics = new Physics(10);    //velocidad de la flecha, velocidad de las flechas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 8, 2)

        //creamos nuestro sprite
        const flecha = new Sprite(SpriteID.ARROW, State.SOLID_2, -30, 150, imageSet, frames, physics, hitBox);

         //añadimos el pirate al array de sprites
        globals.sprites.push(flecha);

}

function initPlataforms(){
    let b = 110;
    for(let a = 0; a < 2; a++)
    {
        for(let i = 0; i < 3 ; i++){
            //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
            const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

            //creamos los datos de la animacion. 8 framesn / state
            const frames = new Frames(1, 5);

            //creamos nuestro objeto physics con vLimit = 40 pixels/second
            const physics = new Physics(40, 40, 0); //velocidad de las plataformas

            //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
            const hitBox = new HitBox(30, 4, 0, 0)

            //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
            const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, Math.floor(Math.random() * 200), b, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);

            //añadimos el pirate al array de sprites
            globals.sprites.push(plataforma);
        }
        b = 148;
    }
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
    const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

    //creamos los datos de la animacion. 8 framesn / state
    const frames = new Frames(1, 5);

    //creamos nuestro objeto physics con vLimit = 40 pixels/second
    const physics = new Physics(40, 40, 0); //velocidad de las plataformas

    //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
    const hitBox = new HitBox(30, 4, 0, 0)

    //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
    const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, 170, 148, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);

    //añadimos el pirate al array de sprites
    globals.sprites.push(plataforma);
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
    const hitBox = new HitBox(11, 2, 2, 15)

    //Segunda hitBox para la colisión con los objetos (arrow y carrot)
    const hitBox2 = new HitBox(10, 12, 3, 3)

    //creamos nuestro sprite
    const player = new Sprite(SpriteID.PLAYER, State.LEFT, 230, 130, imageSet, frames, physics, hitBox, hitBox2);

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