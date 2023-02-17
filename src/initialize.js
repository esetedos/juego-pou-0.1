import globals from "./globals.js";
import {Game, SpriteID, State, FPS, ParticleState, ParticleID} from "./constants.js";
import Sprite, { Plataformas, PlataformasN} from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { Level, level1 } from "./Level.js";
import Timer from "./Timer.js";
import Physics from "./Physics.js";
import { keydownHandler, keyupHandler } from "./events.js";
import HitBox from "./HitBox.js";
import ExplosionParticles from "./Particle.js";
import ExplosionParticle from "./Particle.js";
import Camera from "./Camera.js";

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
    globals.ctxHUDHS = globals.canvasHUD.getContext('2d');

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
    //para poner el fondo en su sitio al inicio
    // globals.ctx.setTransform(1, 0, 0, 1, 0, 0);


    //Inicializamos el estado del juego
    globals.gameState = Game.PL;

    //Inicializamos los estado sde las acciones
    globals.action = {
        moveLeft:   false,
        moveRight:  false,
        jump:       false,
        H:          false,
        B:          false,
        G:          false
    }

    //Variables logica juego
    globals.life = 0;
    globals.saltoKop = 0;
}

function loadAssets()
{
    let tileSet;
    let tileMap;

    //load the spritesheet image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/sprites9.png"; //ojo que la ruta es relativa al HTML, no al JS 
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    //load the bricks image
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/fondo19.png"; //ojo que la ruta es relativa al HTML, no al JS 
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    tileMap = new Image();
    tileMap.addEventListener("load", loadHandler, false);
    tileMap.src = "./images/NEW_GAME.png";  //Ojo que la ruta es relativa al HTML, no al JS
    globals.tileMap.push(tileMap);
    globals.assetsToLoad.push(tileMap);

    tileMap = new Image();
    tileMap.addEventListener("load", loadHandler, false);
    tileMap.src = "./images/GAME_OVER.png";  //Ojo que la ruta es relativa al HTML, no al JS
    globals.tileMap.push(tileMap);
    globals.assetsToLoad.push(tileMap);

    tileMap = new Image();
    tileMap.addEventListener("load", loadHandler, false);
    tileMap.src = "./images/HIGH_SCORE.png";  //Ojo que la ruta es relativa al HTML, no al JS
    globals.tileMap.push(tileMap);
    globals.assetsToLoad.push(tileMap);

    tileMap = new Image();
    tileMap.addEventListener("load", loadHandler, false);
    tileMap.src = "./images/HISTORIA&KONTROLAK.png";  //Ojo que la ruta es relativa al HTML, no al JS
    globals.tileMap.push(tileMap);
    globals.assetsToLoad.push(tileMap);

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
        globals.gameState = Game.LOADING;
    }
}

function initSprites()///////////////////////////////////////////////////////////////////////////////////////////////////////////////
{
    initPlayer();
    initPlataforms();
    // initArrow();
    // initPlataformsN();
    // initPlataformsMoviento();
    
   
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
        const plataforma = new Plataformas(SpriteID.PLATAFORM_MOVIMIENTO, State.SOLID_5, Math.floor(Math.random() * 200), (level1.length-6)*32+35, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox, Math.random()*30+1);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataforma);
    }

}

/*
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
            const plataformaN = new PlataformasN(SpriteID.PLATAFORMN, State.SOLID, Math.floor(Math.random()*150+30), (level1.length-6)*32+b, imageSet, frames, physics, 2, 5, hitBox);

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
            const plataformaN = new PlataformasN(SpriteID.PLATAFORMN, State.SOLID, 300, (level1.length-6)*32+b, imageSet, frames, physics, 2, 5, hitBox);

            //añadimos el pirate al array de sprites
            globals.sprites.push(plataformaN);

        b = 73;
    }

}
*/


//algo
function initArrow(){
    for(let i = 0; i < 3; ++i)
    {
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(3, 0, 40, 8, 40, 24, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1);
        
        //creamos los datos de la animacion. 8 framesn / state
        const physics = new Physics(20);    //velocidad de la flecha, velocidad de las flechas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 8, 2)

        //creamos nuestro sprite
        const flecha = new Sprite(SpriteID.ARROW, State.SOLID_2, Math.floor(Math.random() * (-30)+(-70)), Math.floor(Math.random() * 150+(0)), imageSet, frames, physics, hitBox);

         //añadimos el pirate al array de sprites
        globals.sprites.push(flecha);
    }
        

}

function initPlataforms(){
    for(let i = 0; i < 2; i++){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1, 5);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(40, 40, 0); //velocidad de las plataformas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 0, 0)

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, Math.floor(Math.random() * 200), (level1.length-6)*32, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataforma);
    }

    for(let i = 0; i < 2; i++){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1, 5);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(40, 40, 0); //velocidad de las plataformas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 0, 0)

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, Math.floor(Math.random() * 200), (level1.length-6)*32+35, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataforma);
    }

    for(let i = 0; i < 2; i++){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1, 5);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(40, 40, 0); //velocidad de las plataformas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 0, 0)

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, Math.floor(Math.random() * 200), (level1.length-6)*32+73, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataforma);
    }

    for(let i = 0; i < 2; i++){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1, 5);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(40, 40, 0); //velocidad de las plataformas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 0, 0)

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, Math.floor(Math.random() * 200), (level1.length-6)*32+110, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);

        //añadimos el pirate al array de sprites
        globals.sprites.push(plataforma);
    }

    for(let i = 0; i < 2; i++){
        //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
        const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

        //creamos los datos de la animacion. 8 framesn / state
        const frames = new Frames(1, 5);

        //creamos nuestro objeto physics con vLimit = 40 pixels/second
        const physics = new Physics(40, 40, 0); //velocidad de las plataformas

        //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
        const hitBox = new HitBox(30, 4, 0, 0)

        //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
        const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, 170, (level1.length-6)*32+148, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);

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
    const hitBox = new HitBox(11, 2, 2, 15)

    //Segunda hitBox para la colisión con los objetos (arrow y carrot)
    const hitBox2 = new HitBox(10, 12, 3, 3)

    //creamos nuestro sprite                                235
    const player = new Sprite(SpriteID.PLAYER, State.LEFT, 235, (level1.length-6)*32+90, imageSet, frames, physics, hitBox, hitBox2, 0);

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
    globals.levelTime = new Timer(0, 1.33);
    globals.letterTimer = new Timer(0, 0.1);
    globals.timerProba = new Timer(0, 1);
    globals.timerSaltoKop = new Timer(0, 1);
}


function initEvents()
{
    //add the keyboard event listeners
    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);
}

function initParticles()
{
    initExplosion();
}

function initExplosion()
{
    const numParticles = 100;
    const xInit = globals.sprites[0].physics.xPos + globals.sprites[0].imageSet.xSize/2;
    const yInit = globals.sprites[0].physics.yPos + globals.sprites[0].imageSet.ySize+20;
    const radius = 0.5;
    const timeToFadeMAx = 5;
    const alpha = 1.0;

    for(let i = 0; i < numParticles; ++i)
    {
        const velocity = Math.random() * 25 + 5;
        const physics = new Physics(velocity);

        const timeToFade = timeToFadeMAx * Math.random() +1;
        const particle = new ExplosionParticle(ParticleID.EXPLOSION, ParticleState.ON, xInit, yInit, radius, alpha, physics, timeToFade);

        //Asignamos velocidades según el ángulo aleatorio
        const randomAngle = (Math.random() * 2) * Math.PI ;
        particle.physics.vx = particle.physics.vLimit * Math.cos(randomAngle) +10;
        particle.physics.vy = particle.physics.vLimit * Math.sin(randomAngle)+10;

        globals.particles.push(particle);
    }
}

function initCamera()
{
    const h = (level1.length-6)*32;
    globals.camera = new Camera(0, h);
    globals.cameraHS = new Camera(0, 0);
}

















//Exportamos las funciones
export {
    initHTMLelements,
    initVars,
    loadAssets,
    initCamera,
    initSprites,
    initLevel,
    initTimers,
    initEvents,
    initParticles
    
}