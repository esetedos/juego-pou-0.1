import globals from "./globals.js";

//importamos loadAssets
import {initHTMLelements, loadAssets, initSprites, initVars, initLevel, initTimers, initEvents, initParticles, initCamera} from "./initialize.js";

import update from "./gameLogic.js";
import render from "./gameRender.js";
// import { initBaseDeDatos } from "./events.js";




//GAME INIT

window.onload = init;

function init()
{
    //Inicializamos los elementos HTML: Canvas, Context, Caja de texto de pruebas
    initHTMLelements();

    //cargamos todos los activos: TILEMAPS, IMAGES, SOUNDS
    loadAssets();

    //inicializamos los sprites
    initSprites();

    //Inicialización de variables del juego
    initVars();

    //inicializamos el mapa del juego
    initLevel();

    //Start the first frame request
    window.requestAnimationFrame(gameLoop);

    initTimers();

    initEvents();

    initParticles();

    //inicializamos a cámara
    initCamera();

    // initBaseDeDatos();
}

//GAME EXECUTE

//Bucle principal de ejecución
function gameLoop(timeStamp)
{
    //Keep requesting new frames
    window.requestAnimationFrame(gameLoop, globals.canvas);

    //Tiempo real de ciclo de ejecución
    const elapsedCycleSeconds = (timeStamp - globals.previousCycleMilliseconds) / 1000; //seconds

    //Tiempo anterior de ciclo o ejecución
    globals.previousCycleMilliseconds = timeStamp;

    //Variable
    globals.deltaTime += elapsedCycleSeconds;

    if (globals.deltaTime >= globals.frameTimeObj)
    {

        //Update the game logic. gameLogic.js
        update();

        //Perform the drawing operation. gameRender.js
        render();

        //Corrección de exceso de tiempo
        globals.deltaTime -= globals.frameTimeObj;
    }
}