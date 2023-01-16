import globals from "./globals.js";
import { Game, State, SpriteID } from "./constants.js";



let contadorPrueba = 0; //?


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
    //lectura de teclado. Asignamos dirección a tecla
    readKeyboardAndAssignState(sprite);

    //const isLeftOrRightPressed = globals.action.moveLeft || globals.action.moveRight;

    switch(sprite.state)
    {
        case State.RIGHT:
            //si se mueve a la derecha ax (+)
            sprite.physics.vx = sprite.physics.vLimit;
            sprite.physics.vy = 0;
            //sprite.frames.frameCounter = 0; //cuando salte, pasara a ser 1
            break;

        case State.LEFT:
            //si se mueve a la izquierda asignamos ax (-)
            sprite.physics.vx = -sprite.physics.vLimit;
             sprite.physics.vy = 0;
            break;

        default: //casos de estar parado
            // sprite.physics.ax = 0;
            sprite.physics.vy = 0;
            sprite.physics.vx = 0;
    }

    // //calculamos velocidad en X y en Y (V = V at)
    // sprite.physics.vx += sprite.physics.ax * globals.deltaTime;

    // //Aplicamos fricción en los cambios de dirección y cuando no haya teclas pulsadas para reducir la velocidad rápidamente
    // if((sprite.state === State.LEFT && sprite.physics.vx > 0) ||
    //     (sprite.state === State.RIGHT && sprite.physics.vx < 0) ||
    //     (!isLeftOrRightPressed))
    // {
    //     sprite.physics.vx *= sprite.physics.friction;
    // }

    // //limitamos a la velocidad máxima en dirección horizontal
    // if(sprite.physics.vx > sprite.physicsvLimit) //derecha (velocidad +)
    // {
    //     sprite.physics.vx = sprite.physics.vLimit;
    // }
    // else if(sprite.physics.vx < -sprite.physics.vLimit) // Izquierda (velocidad -)
    // {
    //     sprite.physics.vx =- sprite.physics.vLimit;
    // }

    //calculamos distancia que se mueve (X = X + Vt)
    //xPos seguirá un movimiento uniforme acelerado
    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    sprite.yPos += sprite.physics.vy * globals.deltaTime;

    //Actualizamos la animación
    updateAnimationFrame(sprite);
    

/*
    //Aqui actualizaremos el estado de las variables del player
    sprite.xPos = 10;
    sprite.yPos = 50;

     sprite.frames.frameCounter = 0;
*/
     //sprite.state = State.LEFT;
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
        
        //la eliminación de sprites en off. cuando se borra el 4º, el que era 5º pasa a ser el 4º. poner i-- para que no salga error
        //poner aqui en un if que si está en estado off/block, entonces que entre con el splice
        //poner esto --> sprite.splice(i,1)
        /*
        if(sprite.state == State.BROKE){ //aquí iría el splice (para eliminar el objeto)

        }
        */
        
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
    sprite.physics.vx = sprite.physics.vLimit;

    // //aqui actualizaremos el estado de ls vriables del pirata
    // sprite.xPos = 200;
    // sprite.yPos = sprite.xInitPosition;

    sprite.state = State.STILL;

    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    
    if(sprite.xPos > 270){
        sprite.state = State.BROKE;
        // sprite.xPos = -30;
        // sprite.yPos =  Math.floor(Math.random() * 150+40);
    }
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

    //updateAnimationFrame(sprite);
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
    switch(sprite.state){
        case State.STILL_LEFT:
        case State.STILL_RIGHT:
            sprite.frames.frameCounter = 0;
            sprite.frames.frameChangeCounter = 0;
            break;
        
        default:
            //aumentamos el contador de timepo entre frames
            sprite.frames.frameChangeCounter++;

            //cambiamos de frame cuando el lag de animación alcanza animSpeed
            if(sprite.frames.frameChangeCounter === sprite.frames.speed)
            {
                //cambiamos de frame y reseteamos el contador de cambio de frame
                //sprite.frames.frameCounter++;
                sprite.frames.frameChangeCounter = 0;
            }

            //Si hemos llegado al máximo de frames reiniciamos el contador (animación cíclica)
            if(sprite.frames.frameCounter === sprite.frames.framesPerState)
            {
                sprite.frames.frameCounter = 0;
            }
    }
    
}


function readKeyboardAndAssignState(sprite){
    sprite.state =  globals.action.moveLeft         ? State.LEFT :          //Left Key
                    globals.action.moveRight        ? State.RIGHT :         //Right key
                    sprite.state === State.LEFT     ? State.STILL_LEFT :    //No key pressed and precious state LEFT
                    sprite.state === State.RIGHT    ? State.STILL_RIGHT :   //No key pressed and precious state RIGHT
                    sprite.state;
                    
}