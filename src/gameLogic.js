import globals from "./globals.js";
import { Game, State, SpriteID, GRAVITY, ParticleState, ParticleID} from "./constants.js";
import callDetectCollisions from "./collisions.js";
import { Plataformas} from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import { initParticles, initSprites } from "./initialize.js";
import { Level, level1 } from "./Level.js";
import {collisionPlataform} from "./collisions.js";




let contadorPrueba = 0; //? h
let suelo = globals.canvas.height;

export default function update()
{
    //Change what the game is doing based on the game state
    switch(globals.gameState)
    {
        case Game.LOADING:
            console.log("Loading assets...");
            break;
        
        case Game.NEW_GAME:
            updateNewGame(); 
            break;

        case Game.PLAYING:
            playGame(); //120 segundos de demo
            break;

        case Game.GAME_OVER:
            updateGame_over4High_Score4History();
            break;

        case Game.HIGH_SCORE:
            updateGame_over4High_Score4History();
         
            break;

        case Game.HISTORY:
            updateGame_over4High_Score4History();
            break;
        
        default:
            console.error("Error: Game State invalid");
    }
}





// updateSprite(): Función que accede al id del sprite y llama a la función que actualiza cada tipo de sprite.

// updateSprites(): Función que recorrerá el array sprites y llamará para cada uno de ellos a updateSprite().





function playGame()
{
    //actualización de la física de Sprites
    updateSprites();

    //pa' las partículas
    updateParticles();

    //colisioNes de las plataformas y hitbox del player
    // detectCollisions();

    //colisiones; con el resto de objetos (sprites) y hitbox2 del player
    // detectCollisions2();

    callDetectCollisions();

    updateCamera();

    // actualización de la lógica del juego
    updateLevelTime();

    createPlataforms();

    gameEnd();

    actualiceHighScore();

   //actualización de la cámara
   
  
}

function updateSprites()
{
    for (let i = 0; i < globals.sprites.length; ++i)
    {
        const sprite = globals.sprites[i];
        
        //la eliminación de sprites en off. cuando se borra el 4º, el que era 5º pasa a ser el 4º. poner i-- para que no salga error
        //poner aqui en un if que si está en estado off/block, entonces que entre con el splice
        //poner esto --> sprite.splice(i,1)
        
        if(sprite.state == -1){ //aquí iría el splice (para eliminar el objeto)
            globals.sprites.splice(i,1); 
            i--;
            // globals.life = 234567;
        }
        
        
        
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

        case SpriteID.PLATAFORMN:
            updatePlataformN(sprite);
            break;

        case SpriteID.PLATAFORM_MOVIMIENTO:
            updatePlataformMovimiento(sprite);
            break;
    

        //caso del enemigo
        default:
            break;
    }
}

//Por último, desde gameLogic.js, podremos cambiar los atributos de nuestro personaje, a través de la función updatePlayer(). 

//funcion que actualiza el personaje
function updatePlayer(sprite)
{
    //lectura de teclado. Asignamos dirección a tecla
    readKeyboardAndAssignState(sprite);

    const isLeftOrRightPressed = globals.action.moveLeft || globals.action.moveRight;

    if(globals.action.moveLeft || globals.action.moveRight){
    switch(sprite.state)
    {
        case State.RIGHT:
            //si se mueve a la derecha ax (+)
            sprite.physics.ax = sprite.physics.aLimit;
            // sprite.physics.vy = 0;
            //sprite.frames.frameCounter = 0; //cuando salte, pasara a ser 1
            break;

        case State.LEFT:
            //si se mueve a la izquierda asignamos ax (-)
            sprite.physics.ax = -sprite.physics.aLimit;
            //  sprite.physics.vy = 0;
            break;

        default: //casos de estar parado
            sprite.physics.ax = 0;
            // sprite.physics.vy = 0;
            // sprite.physics.vx = 0;
    }
}
else sprite.physics.ax = 0;

    //calculamos velocidad en X y en Y (V = V at)
    sprite.physics.vx += sprite.physics.ax * globals.deltaTime;

    //Aplicamos fricción en los cambios de dirección y cuando no haya teclas pulsadas para reducir la velocidad rápidamente
    if((sprite.state === State.LEFT && sprite.physics.vx > 0) ||
        (sprite.state === State.RIGHT && sprite.physics.vx < 0) ||
        (!isLeftOrRightPressed))
    {
        sprite.physics.vx *= sprite.physics.friction;
    }

    //limitamos a la velocidad máxima en dirección horizontal
    if(sprite.physics.vx > sprite.physics.vLimit) //derecha (velocidad +)
    {
        sprite.physics.vx = sprite.physics.vLimit;
    }
    else if(sprite.physics.vx < -sprite.physics.vLimit) // Izquierda (velocidad -)
    {
        sprite.physics.vx =- sprite.physics.vLimit;
    }

    //calculamos distancia que se mueve (X = X + Vt)
    //xPos seguirá un movimiento uniforme acelerado
    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    // sprite.yPos += sprite.physics.vy * globals.deltaTime;


    //-----------------------------------------
    // MOVIMIENTO  VERTICAL
    //-----------------------------------------

    //Aceleración en Y es la gravedad
    sprite.physics.ay = GRAVITY;

    //No estamos en el suelo
    if(!sprite.physics.isOnGround)
    {   
        //calculamos velocidad en Y (V = V + at)
        sprite.physics.vy += sprite.physics.ay * globals.deltaTime;
        
    }
    else //estamos en el suelo
    {
        
        if(true) //globals.action.jump) //pulsamos la tecla de salto
        {
            sprite.physics.isOnGround = false;
            
            //asignamos velocidad inicial al salto
            sprite.physics.vy += sprite.physics.jumpForce;
        }
    }

    //calculamos distancia que se mueve (Y = Y + Vt)
    //yPos seguirá un movimiento uniforme acelerado
    sprite.yPos += sprite.physics.vy * globals.deltaTime;

    // untxiaren animazioa hemen (animación del conejo)
    if(sprite.physics.vy > 15)
    {
        sprite.frames.frameCounter=2;
    }
    else if(sprite.physics.vy < -15)
    {
        sprite.frames.frameCounter=1;
    }
    else if(15 > sprite.physics.vy > -15 )
    {
        sprite.frames.frameCounter=0;
    }



    //-----------------------------------------
    // COLISION CON EL SUELO (PASAREMOS LUEGO A COLISIONS)
    //-----------------------------------------

    //el  -2 es porqeu si el hitbox del player baja más abajo, surge un probleema porque (enn la parte de colisions) no hay ningun tileset más abajo, y da error
    if(sprite.yPos > globals.camera.y+globals.canvas.height - sprite.imageSet.ySize-2) //189
    {
        //230x, 130y
        sprite.state = State.LEFT;
        sprite.physics.vy = 0;
        sprite.physics.vx = 0;
        sprite.frames.frameCounter=0;
       
        sprite.xPos = 180; //235;
        sprite.yPos = globals.camera.y+71;
        
        globals.life--; //quita dos de vida
   



        // sprite.physics.isOnGround = true;
        // sprite.yPos = globals.canvas.height - sprite.imageSet.ySize-2;
        // sprite.physics.vy = 0;
        // sprite.frames.frameCounter=0;
        // sprite.yPos = globals.canvas.height - sprite.imageSet
    }

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


function updatePlataformMovimiento(sprite)
{
    // sprite.frames.frameCounter = 1;

    collisionPlataform(sprite);
    movimientoHorizontal(sprite);
}

function updatePlataformN(sprite)
{ 
    // sprite.frames.frameCounter = 2; 
    sprite.physics.vy = sprite.physics.vLimit;

    // sprite.state = State.SOLID_4;

    //esto mantiene las tres plataformas con la misma imagen siempre
    //sprite.frames.frameCounter = sprite.platType;  

    /*
    sprite.yPos += sprite.physics.vy * globals.deltaTime;

    //esto es para que cuando lleguen abajo, vuelvan arriba en un sitio aleatorio y qeu tengan un dibujo aleatorio
    if(sprite.yPos > 190){
        sprite.yPos = 0;
        // sprite.xPos =  Math.floor(Math.random() * 200);
       
    }
*/
    collisionPlataform(sprite);
    if(sprite.disappear == true)
    {
        disappearPlataformN(sprite);
    }
    

    //updateAnimationFrame(sprite);
}


function updateArrow(sprite)
{
    sprite.physics.vx = sprite.physics.vLimit;

    // //aqui actualizaremos el estado de ls vriables del pirata
    // sprite.xPos = 200;
    // sprite.yPos = sprite.xInitPosition;

    sprite.state = State.SOLID_2;

    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    
    if(sprite.xPos > 270){
        sprite.state = State.BROKE_2;
        // sprite.xPos = -30;
        // sprite.yPos =  Math.floor(Math.random() * 150+40);
    }
    updateLife(sprite);
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
/*
    sprite.yPos += sprite.physics.vy * globals.deltaTime;

    //esto es para que cuando lleguen abajo, vuelvan arriba en un sitio aleatorio y qeu tengan un dibujo aleatorio
    if(sprite.yPos > 190){
        sprite.yPos = 0;
        sprite.xPos =  Math.floor(Math.random() * 200);
        sprite.frames.frameCounter = Math.floor(Math.random() * 2); 
    }
*/
    //updateAnimationFrame(sprite);

    collisionPlataform(sprite); 
    //colisión entre plataforma y jugador    
}

function updateLevelTime()
{
    //incrementamos el ocntador de cambio de valor
    globals.levelTime.timeChangeCounter += globals.deltaTime;

    //Si ha pasado el tiempo necesario, cambiamos el valor del timer
    if(globals.levelTime.timeChangeCounter > globals.levelTime.timeChangeValue){    // && globals.levelTime.value != 0){ //lo segundo es para que cuando llegue a 0, el tiempo no siga bajando
        globals.levelTime.value++;

        //reseteamos timeChangeCounter
        globals.levelTime.timeChangeCounter = 0;
    }
    
}

function updateAnimationFrame(sprite)
{ 
    switch(sprite.state){
        case State.LEFT:
        case State.RIGHT:
            //sprite.frames.frameCounter = 0;
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
                    sprite.state === State.LEFT     ? State.LEFT :    //No key pressed and precious state LEFT
                    sprite.state === State.RIGHT    ? State.RIGHT :   //No key pressed and precious state RIGHT
                    sprite.state;
                    
}

function updateLife(sprite) //TO DO: llamar desde playGame. Esat funcion solo controla la vida, el resto lo tiene que llevar otra función
{
    if(sprite.isCollidingWithPlayer2)
    {
        //Si hay colisión reducimos las vida
        
        sprite.state = -1;
        //GAME_OVER (pero sólo se le quita una vida)
        //luego (fuera de aquí) se pondría que si las vidas son 0, GAME_OVER
   
        const player = globals.sprites[0];

        player.state = State.LEFT;
        player.physics.vy = 0;
        player.physics.vx = 0;
        player.frames.frameCounter=0;
       
        player.xPos = 180; //235;
        player.yPos = globals.camera.y+71;
        globals.life --; //quita dos de vida
    }
}




function movimientoHorizontal(sprite)
{
    
    if(sprite.kontMovimiento < 30)
    {
        sprite.kontMovimiento2 = 0;
        sprite.kontMovimiento++;
        sprite.physics.vx = sprite.physics.vLimit;
        // sprite.xPos += sprite.physics.vx * globals.deltaTime;
    }
    else
    {
        if(sprite.kontMovimiento2 < 30)
        {
            sprite.kontMovimiento2++;
            sprite.physics.vx = -sprite.physics.vLimit;
            // sprite.xPos += sprite.physics.vx * globals.deltaTime;
        }
        else sprite.kontMovimiento = 0;
    }
    if(sprite.xPos > globals.canvas.width)  sprite.xPos-=2;
    if(sprite.xPos < 0)                     sprite.xPos+=2;

    sprite.xPos += sprite.physics.vx * globals.deltaTime;
}


function disappearPlataformN(sprite)
{
    if(globals.levelTime.value == sprite.kontMovimiento) //+ sprite.physics.vLimit-1)
    {
        sprite.frames.frameCounter = 1;
    }
        if(globals.levelTime.value >= sprite.kontMovimiento + sprite.physics.vLimit)
        {
            //  globals.life = 0; 
            sprite.state = State.BROKE_4;
            sprite.frames.frameCounter = -100;
        }
}

function createPlataforms()
{
    if(globals.crearNuevasPlataf == true)
    {
        for(let i = 0; i < 3 ; i++){ //TO DO: hacer una funcion que las cree y llamarla desde aqui
            //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
            const imageSet = new ImageSet(2, 0, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12
    
            //creamos los datos de la animacion. 8 framesn / state
            const frames = new Frames(1, 5);
    
            //creamos nuestro objeto physics con vLimit = 40 pixels/second
            const physics = new Physics(40, 40, 0); //velocidad de las plataformas
    
            //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
            const hitBox = new HitBox(30, 4, 0, 0)
    
            //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
            const plataforma = new Plataformas(SpriteID.PLATAFORM, State.SOLID, Math.floor(Math.random() * 200), globals.camera.y, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox);
    
            //añadimos el pirate al array de sprites
            globals.sprites.push(plataforma);
        }
        globals.crearNuevasPlataf = false;
    }
}



function updateNewGame()
{
    // console.log("entra");
    // if (globals.action.jump === true) //to do quitar el if, que lo haga directamente (son las cosas que van a inicializar)
    
        globals.metroak = 0;
        globals.life = 4;
        globals.levelTime.value = 0;
        globals.camera.y = (level1.length-6)*32;
        initSprites;

    if(globals.action.jump)
        globals.gameState = Game.PLAYING;
    
    if (globals.action.G === true)
    {
        globals.gameState = Game.HIGH_SCORE;
    }
    if (globals.action.H === true)
    {
        globals.gameState = Game.HISTORY;
    }

}

function gameEnd()
{
    if(globals.life <= 0 || globals.levelTime.value == 120) //porque el tiempo va a x0.5, asi q para que sean 120s, pues serían 240 aquí
    {     
        globals.sprites.splice(0); 
        initSprites();
        globals.gameState = Game.GAME_OVER;   
    }
}

function updateGame_over4High_Score4History()
{   
    
    if (globals.action.B === true)
    {
        globals.gameState = Game.NEW_GAME;
    }
}




function updateParticles()
{   
    // 
        for(let i = 0; i < globals.particles.length; ++i)
        {
            //console.log("Entra: " + i)
            const particle = globals.particles[i];
            // if(globals.sprites[0].physics.isOnGround === true)
            // {
            //     globals.startParticles = true;
            //     particle.state = ParticleState.ON;
            // }
            updateParticle(particle);
        }

    
    
}

function updateParticle(particle)
{ 
    
    
        const type = particle.id;
        switch (type)
        {
            //caso del jugador
            case ParticleID.EXPLOSION:
                updateExplosionParticle(particle);
                break;

            //caso del enemigo  (en mi caso, no)
            default:
                break;
        }
    
}

function updateExplosionParticle(particle)
{
    particle.fadeCounter += globals.deltaTime;


    let xPos  ;
    let yPos = 100 ;
    

    if(globals.sprites[0].physics.isOnGround === true)
    {
        xPos = globals.sprites[0].xPos + (globals.sprites[0].imageSet.xSize/2);
        yPos = globals.sprites[0].yPos + globals.sprites[0].imageSet.ySize;
    }


    //Cogemos las velocidades de los arrays
    switch (particle.state)
    {
        case ParticleState.ON:
            particle.xPos = xPos;
            particle.yPos = yPos;
            if(particle.fadeCounter > particle.timeToFade)
            {
                particle.fadeCounter = 0;
                particle.state = ParticleState.FADE;
            }
            break;

        case ParticleState.FADE:
            particle.alpha -= 0.01;

            if (particle.alpha <= 0)
            {
                particle.state = ParticleState.OFF;
            }
            break;

        case ParticleState.OFF:
    //         xInit = 100;
    // const yInit = 100;
                
                // particle.state = ParticleState.ON;
            
            break;

        default:
            //Por completar (?)
    }

    particle.xPos += particle.physics.vx * globals.deltaTime;
    particle.yPos += particle.physics.vy * globals.deltaTime;
}

function actualiceHighScore()
{
    if(Math.floor(globals.metroak/10)*10 > globals.highScore)
    {
        globals.highScore = Math.floor(globals.metroak/10)*10;
    }
}

function updateCamera()
{
    //Centramos la cámara en el player
    // const player = globals.sprites[0];
    globals.camera.y -=10* globals.deltaTime;
    // globals.camera.x = Math.floor(player.xPos) + Math.floor((player.imageSet.xSize - globals.canvas.width) / 2);
    // globals.camera.y = Math.floor(player.yPos) + Math.floor((player.imageSet.ySize - globals.canvas.height) / 2);
}

export function gameMovement()
{
    const player = globals.sprites[0];

    if(player.yPos < globals.camera.y+50)  //70)
    {
        globals.metroak++;
        // player.yPos+= 60 * globals.deltaTime;
        for(let i = 0; i < globals.sprites.length; ++i)
        {
            const sprite = globals.sprites[i];
            sprite.yPos+=40 * globals.deltaTime;
            // if(player.yPos < globals.camera.y)
            // {
            //     sprite.yPos+=10 * globals.deltaTime;
            // }
        }
        //aquí añadir que la pantalla baje
        // globals.camera.y -=30* globals.deltaTime;
    }
}

export function eliminaciónDePlataformas() 
{
    for(let i = 1; i < globals.sprites.length; ++i)
        {
            const sprite = globals.sprites[i];

            if(sprite.yPos > globals.camera.y+globals.canvas.height - 5){
                sprite.state = -1;
                if(sprite.id == SpriteID.PLATAFORM || sprite.id == SpriteID.PLATAFORMN || sprite.id == SpriteID.PLATAFORM_MOVIMIENTO)
                globals.crearNuevasPlataf = true;
            }
        }
}