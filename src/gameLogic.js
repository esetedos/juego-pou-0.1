import globals from "./globals.js";
import { Game, State, SpriteID, GRAVITY, ParticleState, ParticleID, Sound} from "./constants.js";
import callDetectCollisions from "./collisions.js";
import { Plataformas, PlataformasN} from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import { initParticles, initSprites } from "./initialize.js";
import { Level, level1 } from "./Level.js";
import {collisionPlataform} from "./collisions.js";
import {postHighScores} from "./events.js";





let contadorPrueba = 0; //? h
let suelo = globals.canvas.height;

export default function update()
{
    //Change what the game is doing based on the game state
    switch(globals.gameState)
    {
        case Game.LOADING:
            console.log("Loading assets...");
            inicioNEW_GAME();

            break;
        
        case Game.NEW_GAME:
            updateNewGame(); 
            break;

        case Game.PLAYING:
            playGame(); //120 segundos de demo
            break;

        case Game.GAME_OVER:
            updateGame_over();
            break;

        case Game.HIGH_SCORE:
            
            updateHighScore();
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

//actualización de la cámara
    updateCamera();

    // actualización de la lógica del juego
    updateLevelTime();

    createPlataforms();

    gameEnd();

    actualiceHighScore();

    levelInGame();

   restoreCamera();

   updateTimerSaltoKop();

//    reiniciaCameraHS();

    contadorDePlataformas();

    playSound();

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
    updateSaltoKop(sprite);

    const isLeftOrRightPressed = globals.action.moveLeft || globals.action.moveRight;

    if(globals.action.moveLeft || globals.action.moveRight)
    {
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
            globals.currentSound = Sound.JUMP;
            // asignamos velocidad inicial al salto
            if(globals.saltoDeNuevo)
            {
                sprite.physics.vy = -1;
                sprite.physics.vy += (sprite.physics.jumpForce);
                globals.saltoDeNuevo =false;
            }
            else
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
   
    }

    //Actualizamos la animación
    updateAnimationFrame(sprite);
    



     //cuando hace colisión con una plataforma:
    //  const player = globals.sprites[0];
     if(sprite.isCollidingWithObstacleOnTheBottom)
        sprite.physics.isOnGround = true;


    
}

function updateSaltoKop(sprite)
{
    if(sprite.physics.isOnGround == true && globals.timerSaltoKop.value > 0)
    {
         globals.saltoKop++;
         globals.timerSaltoKop.value = 0;
    }
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
    updateValuesAfterCollision(sprite);
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

function updateValuesAfterCollision(sprite) 
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
        globals.life --; //quita dos de vida //updateLife
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
    for(let i = 1; i < globals.sprites.length; ++i)
    {
        const sprite = globals.sprites[i];
        if((sprite.id == SpriteID.PLATAFORM || sprite.id == SpriteID.PLATAFORMN || sprite.id == SpriteID.PLATAFORM_MOVIMIENTO) && globals.crearNuevasPlataf == true)   
        {
            let a = 3;
            for(let i = 0; i < a ; i++){
                let option = Math.floor(Math.random()*100+1); // Número aleatorio:(0,100]
                if(globals.levelTwo == true) //para qeu se creen 2 plataformas por fila en vez de tres
                {
                    // a = 2;
                }
                if(globals.levelOne == true)       
                {
                    if(globals.levelThree == true)   //cuando pasen dos minutos
                    {
                        if(globals.levelFour == true)
                        {
                            //flechas
                            
                        }
                    
                        if(option<15){
                            //create plataformas de movimiento
                            createMovingPlataforms();
                        }   
                        else if(option<30)
                        {
                            //create plataformas que desaparecen
                            createDisappearPlataforms();
                        }
                        else{
                            createRegularPlataforms();
                        }
                        
                    }
                    else //cuando pase un minuto
                    {                   
                        if(option<20){
                            //create plataformas de movimiento
                            createMovingPlataforms();
                        }   
                        else{
                            createRegularPlataforms();
                        }
                    }   
                }
                else
                    createRegularPlataforms();            
            }
            globals.crearNuevasPlataf = false;
        }
    }
}

function createRegularPlataforms()
{
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

function createMovingPlataforms()
{
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
    const imageSet = new ImageSet(2, 1, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

    //creamos los datos de la animacion. 8 framesn / state
    const frames = new Frames(1, 5);

    //creamos nuestro objeto physics con vLimit = 40 pixels/second
    const physics = new Physics(20, 0, 0); //velocidad de las plataformas

    //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
    const hitBox = new HitBox(30, 4, 0, 0)

    //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
    const plataforma = new Plataformas(SpriteID.PLATAFORM_MOVIMIENTO, State.SOLID_5, Math.floor(Math.random() * 200), globals.camera.y, imageSet, frames, physics, Math.floor(Math.random() * 3), hitBox, Math.random()*30+1);

    //añadimos el pirate al array de sprites
    globals.sprites.push(plataforma);
}

function createDisappearPlataforms()
{
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
    const imageSet = new ImageSet(2, 2, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

    //creamos los datos de la animacion. 8 framesn / state
    const frames = new Frames(1, 5);

    //creamos nuestro objeto physics con vLimit = 40 pixels/second
    const physics = new Physics(1, 0); //velocidad de las plataformas

    //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
    const hitBox = new HitBox(30, 4, 0, 0)

    //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
    const plataformaN = new PlataformasN(SpriteID.PLATAFORMN, State.SOLID, Math.floor(Math.random()*150+30), globals.camera.y, imageSet, frames, physics, 2, 5, hitBox);

    //añadimos el pirate al array de sprites
    globals.sprites.push(plataformaN);

    //and

    //plataforma nube extra ;)
    //creamos las propiedades de las imagenes: initFil, initCOl, xSize, ySize, xgridSize, yGridsize, xOffset, yOffset
     imageSet = new ImageSet(2, 2, 30, 6, 30, 27, 0, 6); //se supone que grid side sería 30, y yOffset 12

    //creamos los datos de la animacion. 8 framesn / state
     frames = new Frames(1, 5);

    //creamos nuestro objeto physics con vLimit = 40 pixels/second
     physics = new Physics(1, 0); //velocidad de las plataformas

    //Creamos nuestro objeto HitBox con xSize, ySize, xOffset, yOffset
     hitBox = new HitBox(30, 4, 0, 0)

    //creamos nuestro sprite  aqui se pondrá la posición inicial también (xPos e yPos)
     plataformaN = new PlataformasN(SpriteID.PLATAFORMN, State.SOLID, 400, globals.camera.y, imageSet, frames, physics, 2, 5, hitBox);

    //añadimos el pirate al array de sprites
    globals.sprites.push(plataformaN);
}



function updateNewGame()
{
    // console.log("entra");
    // if (globals.action.jump === true) //to do quitar el if, que lo haga directamente (son las cosas que van a inicializar)
    //reiniciamos valores
    //reinicio
        globals.metroak = 0;
        globals.life = 3;
        globals.izena = "";
        globals.levelTime.value = 0;
        globals.camera.y = (level1.length-6)*32;
        globals.levelOne = false;
        globals.levelTwo = false;
        globals.levelThree = false;
        globals.levelFour = false;
        globals.levelFive = false;
        globals.maxPlataformas = 15;
        globals.maxPlatAlcanzado = false;
        globals.saltoKop = 0;
        initSprites;
        
      
        
        

    if(globals.action.jump){     //uwu
        globals.gameState = Game.PLAYING;
        //reproducimos GAME_MUSIC a un volumen inferior
        globals.sounds[Sound.GAME_MUSIC].play();
        globals.sounds[Sound.GAME_MUSIC].volume = 0.4;
    }
    if (globals.action.G === true)
    {
        // postHighScores();
        globals.gameState = Game.HIGH_SCORE;
    }
    if (globals.action.H === true)
    {
        globals.gameState = Game.HISTORY;
    }

}

function gameEnd()
{
    if(globals.life <= 0) // || globals.levelTime.value == 120) //porque el tiempo va a x0.5, asi q para que sean 120s, pues serían 240 aquí
    {     
        globals.sprites.splice(0); 
        initSprites();
        globals.sounds[Sound.GAME_MUSIC].pause();
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
    globals.score=Math.floor(globals.metroak/10)*10;

    if(Math.floor(globals.metroak/10)*10 > globals.highScore)
    {
        globals.highScore = Math.floor(globals.metroak/10)*10;
    }
}

function updateCamera()
{
    //Centramos la cámara en el player
    // const player = globals.sprites[0];
    if(globals.levelFive == true)
    {
        globals.camera.y -=2* globals.deltaTime;
    }
    globals.camera.y -=10* globals.deltaTime;
    // globals.camera.x = Math.floor(player.xPos) + Math.floor((player.imageSet.xSize - globals.canvas.width) / 2);
    // globals.camera.y = Math.floor(player.yPos) + Math.floor((player.imageSet.ySize - globals.canvas.height) / 2);
}

function restoreCamera()
{
    if(globals.camera.y < 5){
        // let a = (level1.length-6)*32-globals.camera.y;
         globals.camera.y += (level1.length-6)*32-32;
         for(let i = 0; i<globals.sprites.length; i++)
         {
            globals.sprites[i].yPos += (level1.length-6)*32-32;
         }
         
    }
   
}

export function gameMovement()
{
    const player = globals.sprites[0];

    globals.score = Math.floor(globals.metroak/10)*10;
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

        if(sprite.yPos > globals.camera.y+globals.canvas.height ){
            sprite.state = -1;
            // if(sprite.id == SpriteID.PLATAFORM || sprite.id == SpriteID.PLATAFORMN || sprite.id == SpriteID.PLATAFORM_MOVIMIENTO)
            globals.crearNuevasPlataf = true;
        }
    }
}

function contadorDePlataformas()
{
    globals.kontPlataforms = 0;
    for(let i = 1; i < globals.sprites.length; ++i)
    {
        const sprite = globals.sprites[i];
        if((sprite.id == SpriteID.PLATAFORM || sprite.id == SpriteID.PLATAFORMN || sprite.id == SpriteID.PLATAFORM_MOVIMIENTO) && sprite.xPos<300 )   
            globals.kontPlataforms++;
    }
    if(globals.kontPlataforms > globals.maxPlataformas)
        globals.maxPlatAlcanzado = true;
    else
    globals.maxPlatAlcanzado = false;
}

function updateHighScore()
{
    updateCameraHS();  
    updateGame_over4High_Score4History();
    updateTimerProba();
    

    if(globals.timerProba.value > 5)
    {
        // console.log("entra");
        // reiniciaCameraHS(); 
    }
}

function updateCameraHS()
{
    //to do: aqui ponemos que al pulsar los botones de las flechas, sube o baja
    globals.cameraHS.y += 10* globals.deltaTime;
    // console.log("high_scores camera dentro");
}

// function reiniciaCameraHS()
// {
//     globals.cameraHS.y = 0;
// }


function levelInGame()
{
    if( globals.levelTime.value > 30){
        globals.levelOne = true;
        globals.dificultad = 1;
    }
    if( globals.levelTime.value > 90){
        globals.levelTwo = true;
        globals.dificultad = 2;
    }
    if( globals.levelTime.value > 150){
        globals.levelThree = true;
        globals.dificultad = 3;
    }
    if( globals.levelTime.value > 210){
        globals.levelFour = true;
        globals.dificultad = 4;
    }
    if( globals.levelTime.value > 270){
        globals.levelFive = true;
        globals.dificultad = 5;
    }
        
    // globals.levelTime.value = 0;
}

function saveName()
{
// dfg
}

function typeName()
{
    // console.log(globals.asciCode);
    let insertchar = String.fromCharCode(globals.asciCode);

    if(globals.asciCode > 64 && globals.asciCode < 91)
    {
        // console.log("entra");
        // console.log(insertchar);
        // console.log(globals.letterTimer.value);

        //meter un timer para que se mantenga pulsada la tecla
        if(globals.letterTimer.value > 1)
        {
            //aquí no entra
            // console.log("entra2");
            
            globals.izena += insertchar;
            globals.letterTimer.value = 0;

            if(globals.izena.length > 2)
            {
                postHighScores();
                // findScore(objectToSend);
                globals.gameState = Game.HIGH_SCORE;
                
            }
        
            // postHighScore();
        }
    }
}


// function findScore (objectToSend)
// {
//     // for(let i = 0; i < globals.arrayBD.length; i++)
//     { 
//         // if(globals.score > globals.arrayBD[i].score)
//         {
//             // console.log("entra14");
//             globals.arrayBD.splice(globals.arrayBD.length+1,0,objectToSend);

//             // i = globals.arrayBD.length;
//         }
//     }
//     console.log(globals.arrayBD);
// }

function updateGame_over()
{
    updateletterTimer();
    typeName();
    
}

function updateletterTimer()
{
    //incrementamos el ocntador de cambio de valor
    globals.letterTimer.timeChangeCounter += globals.deltaTime;

    //Si ha pasado el tiempo necesario, cambiamos el valor del timer
    if(globals.letterTimer.timeChangeCounter > globals.letterTimer.timeChangeValue){    // && globals.levelTime.value != 0){ //lo segundo es para que cuando llegue a 0, el tiempo no siga bajando
        globals.letterTimer.value++;

        //reseteamos timeChangeCounter
        globals.letterTimer.timeChangeCounter = 0;
    }
    
}

function updateTimerProba()
{
    //incrementamos el contador de cambio de valor
    globals.timerProba.timeChangeCounter += globals.deltaTime;

    // Si ha pasado el tiempo necesario, cambiamos el valor del timer
    if(globals.timerProba.timeChangeCounter > globals.timerProba.timeChangeValue){    // && globals.levelTime.value != 0){ //lo segundo es para que cuando llegue a 0, el tiempo no siga bajando
        globals.timerProba.value++;

        //reseteamos timeChangeCounter
        globals.timerProba.timeChangeCounter = 0;
        // console.log(globals.timerProba.value);
    }
    
}

function updateTimerSaltoKop()
{
    //incrementamos el contador de cambio de valor
    globals.timerSaltoKop.timeChangeCounter += globals.deltaTime;

    // Si ha pasado el tiempo necesario, cambiamos el valor del timer
    if(globals.timerSaltoKop.timeChangeCounter > globals.timerSaltoKop.timeChangeValue){    // && globals.levelTime.value != 0){ //lo segundo es para que cuando llegue a 0, el tiempo no siga bajando
        globals.timerSaltoKop.value++;

        //reseteamos timeChangeCounter
        globals.timerSaltoKop.timeChangeCounter = 0;
        // console.log(globals.timerProba.value);
    }
    
}

function inicioNEW_GAME() //uwu
{
    // if(globals.action.B && globals.arrayBD !== null && globals.assetsLoaded === globals.assetsToLoad.length)
    {
        globals.gameState = Game.NEW_GAME;
    }
}


function playSound()
{
    //Reproducimos el sonido que ha sido involucrado
    if(globals.currentSound != Sound.NO_SOUND)
    {
        //Reproducimos el sonido correspondiente
        globals.sounds[globals.currentSound].currentTime = 0;
        globals.sounds[globals.currentSound].play();

        //Reseteamos current sound
        globals.currentSound = Sound.NO_SOUND;
    }
}