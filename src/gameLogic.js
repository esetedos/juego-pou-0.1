import globals from "./globals.js";
import { Game, State, SpriteID } from "./constants.js";



let contadorPrueba = 0;


export default function update()
{
    //Change what the game is doing based on the game state
    switch(globals.gameState)
    {
        case Game.LOADING:
            console.log("Loading assets...");
            break;
        
        case Game.PLAYING:
            playGame();
            break;
        
        default:
            console.error("Error: Game State invalid");
    }
}

//Por último, desde gameLogic.js, podremos cambiar los atributos de nuestro personaje, a través de la función updatePlayer(). 

//funcion que actualiza el personaje
function updatePlayer(sprite)
{
    //Aqui actualizaremos el estado de las variables del player
    sprite.xPos = 10;
    sprite.yPos = 50;

    sprite.frames.frameCounter = 0;

    sprite.state = State.LEFT;
}



// updateSprite(): Función que accede al id del sprite y llama a la función que actualiza cada tipo de sprite.

// updateSprites(): Función que recorrerá el array sprites y llamará para cada uno de ellos a updateSprite().





function playGame()
{
    updateSprites();
    updateLevelTime();
}

function updateSprites()
{
    for (let i = 0; i < globals.sprites.length; ++i)
    {
        const sprite = globals.sprites[i];
        updateSprite(sprite);
    }
    
}

function updateSprite(sprite)
{
    const type = sprite.id;
    switch (type)
    {
        //caso del jugador
        case SpriteID.PLAYER:
            updatePlayer(sprite)
            break;

         //case de la(s) plataforma(s)
         case SpriteID.PLATAFORM:
            updatePlataform(sprite);
            break;

        //case de la flecha
        case SpriteID.ARROW:
            updateArrow(sprite);
            break;

        //caso del enemigo
        default:
            break;
    }
}

function updateArrow(sprite)
{
    //aqui actualizaremos el estado de ls vriables del pirata
    sprite.xPos = 200;
    sprite.yPos = sprite.xInitPosition;

    sprite.state = State.STILL;

    sprite.frames.frameCounter = 0;  
}

//función que actualiza  las plataformas
function updatePlataform(sprite)
{
    sprite.physics.vy = sprite.physics.vLimit;

    //aqui actualizaremos el estado de las vriables del pirata
    
    //sprite.xPos = sprite.xInitPosition;
    //sprite.yPos = 0;

    sprite.state = State.SOLID;

    //esto mantiene las tres plataformas con la misma imagen siempre
    //sprite.frames.frameCounter = sprite.platType;  

    sprite.yPos += sprite.physics.vy * globals.deltaTime;

    //esto es para que cuando lleguen abajo, vuelvan arriba en un sitio aleatorio y qeu tengan un dibujo aleatorio
    if(sprite.yPos > 190){
        sprite.yPos = 0;
        sprite.xPos =  Math.floor(Math.random() * 200);
        sprite.frames.frameCounter = Math.floor(Math.random() * 3); 
    }
}

function updateLevelTime()
{
    //incrementamos el ocntador de cambio de valor
    globals.levelTime.timeChangeCounter += globals.deltaTime;

    //Si ha pasado el tiempo necesario, cambiamos el valor del timer
    if(globals.levelTime.timeChangeCounter > globals.levelTime.timeChangeValue && globals.levelTime.value != 0){ //lo segundo es para que cuando llegue a 0, el tiempo no siga bajando
        globals.levelTime.value--;

        //reseteamos timeChangeCounter
        globals.levelTime.timeChangeCounter = 0;
    }
    
}

function updateAnimationFrame(sprite)
{
    sprite.frames.frameCounter++;

    //Si hemos llegado al máximo de frames reiniciamos el contador (animación cíclica)
    if(sprite.frames.frameCounter === sprite.frames.framesPerState)
    {
        sprite.frames.frameCounter = 0;
    }
}