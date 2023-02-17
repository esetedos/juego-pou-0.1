import globals from "./globals.js";
import {Block, State, SpriteID} from "./constants.js";
import { Plataformas } from "./Sprite.js";
import Physics from "./Physics.js";
import { initParticles } from "./initialize.js";
import { gameMovement, eliminaciónDePlataformas } from "./gameLogic.js";

export default function callDetectCollisions()
{
    detectCollisions();
    collisionWBorders();
    gameMovement();
    eliminaciónDePlataformas();

    //calculamos colision del player con los obstáculos del mapa
    detectCollisionBetweenPlayerAndMapObstacles();
}

//función  que calcula si 2 rectángulos interseccionan
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)
{
    let isOverlap;

    //Check x and y for overlap
    if(x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2)
    {
        isOverlap = false;
    }
    else
        isOverlap = true;

    return isOverlap;
}


//Se encargará de llamar a todas las funciones para el cálculo de colisiones. 
//Exportaremos dicha función.
function detectCollisions()
{
    //calculamos colision del player con cada uno de los sprites
    for(let i = 1; i < globals.sprites.length; ++i)
    {
        const sprite = globals.sprites[i];
        detectCollisionBetweenPlayerAndSprite(sprite);
        detectCollisionBetweenPlayerAndSprite2(sprite);
    }

    //Calculamos colision de player con los obstaculos del mapa
    //detectCollisionBetweenPlayerAndMapObstacles(); no va
}


//Calculará si existe colisión entre el player y uno de los sprites, 
//que recibirá como argumento. Si existe colisión, pondrá la variable 
//isCollidingWithPlayer del sprite a true.
function detectCollisionBetweenPlayerAndSprite(sprite)
{
    //Reset collision state
    sprite.isCollidingWithPlayer = false;
    //Nuestro player está en la posición 0
    const player = globals.sprites[0];

    //Datos del player
    const x1 = player.xPos + player.hitBox.xOffset;
    const y1 = player.yPos + player.hitBox.yOffset;
    const w1 = player.hitBox.xSize;
    const h1 = player.hitBox.ySize;

    //Datos del otro sprite
    const x2 = sprite.xPos + sprite.hitBox.xOffset;
    const y2 = sprite.yPos + sprite.hitBox.yOffset;
    const w2 = sprite.hitBox.xSize;
    const h2 = sprite.hitBox.ySize;

    const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)
    if(isOverlap)
    {
        //Existe colisión
        sprite.isCollidingWithPlayer = true;
    }
}









//-------------------------------------------------------------------------------------------
// HHITBOX2 (PARA LAS COLISIOES CON EL CONEJO ENTERO)


//Calculará si existe colisión entre el player y uno de los sprites, 
//que recibirá como argumento. Si existe colisión, pondrá la variable 
//isCollidingWithPlayer del sprite a true.
function detectCollisionBetweenPlayerAndSprite2(sprite)
{
    //Reset collision state
    sprite.isCollidingWithPlayer2 = false;
    //Nuestro player está en la posición 0
    const player = globals.sprites[0];

    //Datos del player
    const x1 = player.xPos + player.hitBox2.xOffset;
    const y1 = player.yPos + player.hitBox2.yOffset;
    const w1 = player.hitBox2.xSize;
    const h1 = player.hitBox2.ySize;

    //Datos del otro sprite
    const x2 = sprite.xPos + sprite.hitBox.xOffset;
    const y2 = sprite.yPos + sprite.hitBox.yOffset;
    const w2 = sprite.hitBox.xSize;
    const h2 = sprite.hitBox.ySize;

    const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)
    if(isOverlap)
    {
        //Existe colisión
        sprite.isCollidingWithPlayer2 = true;
    }
}


//-------------------------------------------------------------------------------------------
// COLISIONES CON LOS LÍMITES DEL MAPA

function collisionWBorders()
{
    const player = globals.sprites[0];

    const x = player.xPos; //punto izquiero del player
    const y = player.yPos; //punto alto del player
    const w = player.xPos + player.imageSet.xSize; //punto derecho del player
    const h = player.hitBox2.ySize; //punto bajo del player

    if(x < 0)
    {
        // player.physics.vx = 0;
        player.xPos = globals.canvas.width - player.imageSet.xSize;
    }       
    if(y < 0)
    {
        player.physics.vx = 0;
        player.yPos = 0;
    }      
    if(w > globals.canvas.width)
    {
        // player.physics.vx = 0;
        player.xPos = 0;
    }     
    //if(h > 200)
    
    //sprite.yPos = globals.canvas.height - sprite.imageSet.ySize;

}













//-------------------------------------------------------------------------------------------
// COLISIONES CON EL TILESET

//Devuelve el id del tile del mapa para una posición (xPos, yPos) determinada.
function getMapTileId(xPos, yPos)
{
    const brickSize = globals.level.imageSet.yGridSize;
    const levelData = globals.level.data;

    const fil = Math.floor(yPos / brickSize);
    const col = Math.floor(xPos / brickSize);

    return levelData[fil][col];
}

//Devuelve true si hay colisión con un obstáculo determinado (obstacleId) en la posición (xPos, yPos). Si existe colisión devolverá false
function isCollidingWithObstacleAt(xPos, yPos, obstacleId) 
{
    let isColliding;

    const id = getMapTileId(xPos, yPos);

    //calculamos colision con bloque de cristal
    if(id === obstacleId)
        isColliding = true;
    else
        isColliding = false;

    return isColliding;
}

// Detectará si existe colisión entre el player y algún obstáculo del mapa, en función de la dirección en la que se mueva. Para ello, seguiremos los pasos anteriores 
// descritos en los apartados “Colisión con bloque” y “Overlap (Solapamiento)”. 
// Nota: se deja al alumno la tarea de completar la función para el resto de las direcciones de movimiento.
function detectCollisionBetweenPlayerAndMapObstacles()
{
    const player = globals.sprites[0];

    //Reset collision state
    // player.isCollidingWithObstacleOnTheTop = false;

    let xPos;
    let yPos;
    let isCollidingOnPos1;
    let isCollidingOnPos2;
    let isCollidingOnPos3;
    let isCollidingOnPos4;
    let isCollidingOnPos5;
    let isCollidingOnPos6;
    let isCollidingOnPos7;
    let isCollidingOnPos8;
    let isColliding;
    let overlap;

    const brickSize = globals.level.imageSet.xGridSize-0;
    // const direction = player.state;

    //ID del obstáculo
    const obstacleId = Block.WOOD;

    //Reset collisisons state
    player.isCollidingWithObstacleOnTheBottom = false;
    player.isCollidingWithObstacleOnTheRight = false;
    player.isCollidingWithObstacleOnTheLeft = false;
    player.isCollidingWithObstacleOnTheTop = false;
    
    //Colisiones (6 puntos posibles)
    // 6------------1   //vamos a quitar todos los puntos, menos 4 y 3 (que serán para la colisión hacia abajo)
    // --------------
    // --------------
    // 5------------2   en mi caso, el conejo no tiene los puntos 5 y 2
    // --------------
    // --------------
    // 7------------8   //estos son los puntos nuevos
    // 4------------3

    let overlapX;
    let overlapY;

    //calculamos colisiones en los 6 puntos
//calculamos unos puntos que vayan 1poco + arriba q los .'s de de abajo del todo del player (4 y 3), y que si estos también tocan esta id, entonces que NO salte
//Recordar sobre player: y=15 & x=15
    if(player.physics.vy>0) //player.physics.vx > 0) //Movimiento derecha
    {
        //PUNTO 4
        //colision en (xPos, yPos + ySize - 1)
        xPos = player.xPos + player.hitBox.xOffset +2;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        //PUNTO 3
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1 -2;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        //PUNTO 7
        xPos = player.xPos + player.hitBox.xOffset +2;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1 -5;
        isCollidingOnPos7 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        //PUNTO 8
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1 -2;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1 -5;
        isCollidingOnPos8 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // if(isCollidingOnPos4 || isCollidingOnPos3)
        // {
        //     player.physics.vy = 0;
        // }

        if((isCollidingOnPos4  && isCollidingOnPos7 == false) || (isCollidingOnPos3 && isCollidingOnPos8 == false)) //hay colision en punto 4
        {
            // console.log("4");
            //calculamos overap sólo en Y
            // player.physics.vy= 0;
            overlapY = 1; //Math.floor(yPos) % (brickSize) + 1;

            //Colisión en eje Y
            player.yPos -= overlapY;
            // player.isCollidingWithObstacleOnTheBottom = true;
           
            globals.saltoDeNuevo = true;
            player.physics.isOnGround = true;
            console.log(globals.saltoDeNuevo);
            console.log("salto");
            console.log("4: " + isCollidingOnPos4);
            console.log("3: " + isCollidingOnPos3);
            console.log("7: " + isCollidingOnPos7);
            console.log("8: " + isCollidingOnPos8);
           
        }
        // else if(globals.saltoDeNuevo)
        {
            // player.physics.vy= 0;
            // player.isCollidingWithPlayer = true;
           
            // globals.saltoDeNuevo = false;
            
        }


    }

}


export function collisionPlataform(sprite) //colisión entre jugador y plataforma
{ 
    const player = globals.sprites[0];

    if(player.xPos+player.hitBox.xOffset+(player.hitBox.xSize/2) < sprite.xPos+sprite.hitBox.xOffset+sprite.hitBox.xSize && player.xPos+player.hitBox.xOffset > sprite.xPos+sprite.hitBox.xOffset || player.xPos+player.hitBox.xOffset+player.hitBox.xSize/2 > sprite.xPos+sprite.hitBox.xOffset && player.xPos+player.hitBox.xOffset+player.hitBox.xSize < sprite.xPos+sprite.hitBox.xOffset+sprite.hitBox.xSize){

        if(sprite.isCollidingWithPlayer && player.physics.vy >= 0)
        {
            if(sprite.id == SpriteID.PLATAFORM_MOVIMIENTO-1)//sprite.SpriteID == SpriteID.PLATAFORM_MOVIMIENTO)
            {   
                sprite.kontMovimiento = globals.levelTime.value;
                sprite.disappear = true;
            }

            player.yPos = sprite.yPos - sprite.imageSet.ySize;

            //Si hay colisión reducimos las vida
            // globals.life--;
            let suelo = player.yPos;
            if(player.yPos > suelo - player.imageSet.ySize) //189
            {
                player.physics.isOnGround = true;
                initParticles();
                player.yPos = suelo - player.imageSet.ySize;
                player.physics.vy = 0;
                player.frames.frameCounter=0;
               
               
            }

            
        }
    }

}