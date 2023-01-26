import globals from "./globals.js";
import {Block, State, SpriteID} from "./constants.js";
import { Plataformas } from "./Sprite.js";
import Physics from "./Physics.js";

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
        player.physics.vx = 0;
        player.xPos = 0;
    }       
    if(y < 0)
    {
        player.physics.vx = 0;
        player.yPos = 0;
    }      
    if(w > globals.canvas.width)
    {
        player.physics.vx = 0;
        player.xPos = globals.canvas.width - player.imageSet.xSize;
    }     
    //if(h > 200)
    
    //sprite.yPos = globals.canvas.height - sprite.imageSet.ySize;

}


function gameMovement()
{
    const player = globals.sprites[0];

    if(player.yPos < 90)
    {
        globals.metroak++;
        // player.yPos+= 60 * globals.deltaTime;
        for(let i = 0; i < globals.sprites.length; ++i)
        {
            const sprite = globals.sprites[i];
            sprite.yPos+=50 * globals.deltaTime;
        }
    }
}

function eliminaciónDePlataformas()
{
    for(let i = 1; i < globals.sprites.length; ++i)
        {
            const sprite = globals.sprites[i];

            if(sprite.yPos > globals.canvas.height){
                sprite.state = -1;
                if(sprite.id == SpriteID.PLATAFORM || sprite.id == SpriteID.PLATAFORMN || sprite.id == SpriteID.PLATAFORMMOVIMIENTO)
                globals.crearNuevasPlataf = true;
            }
        }
}








//-------------------------------------------------------------------------------------------
// COLISIONES CON EL TILESET

//Devuelve el id del tile del mapa para una posición (xPos, yPos) determinada.
function getMapTileId(xPos, yPos)
{
    const yBrickSize = globals.level.imageSet.yGridSize;
    const xBrickSize = globals.level.imageSet.xGridSize;
    const levelData = globals.level.data;

    const fil = Math.floor(yPos / yBrickSize);
    const col = Math.floor(xPos / xBrickSize);

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
    player.isCollidingWithObstacleOnTheRight = false;

    let xPos;
    let yPos;
    let isCollidingOnPos1;
    //let isCollidingOnPos2;
    let isCollidingOnPos3;
    let isColliding;
    let overlap;

    const xBrickSize = globals.level.imageSet.xGridSize;
    const yBrickSize = globals.level.imageSet.yGridSize;
    const direction = player.state;

    //ID del obstáculo
    const obstacleId = Block.WOOD;

    switch(direction)
    {
        case State.RIGHT:
            //Primera colisión en (xPos + xSize - 1, yPos)
            xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
            yPos = player.yPos + player.hitBox.yOffset;
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

            //Segunda colisión en (xPos + xSize - 1, yPos + brickSize)
            // yPos = player.yPos + player.hitBox.yOffset + brickSize;
            // isCollidingOnPos2 = isCOllidingWithObstacleAt(xPos, yPos, obstacleId);

            //Última colisión en (xPos + xSize - 1, yPos + ySize - 1)
            yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
            isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
            //Habrá colisión si toca alguno de los 3 bloques
            isColliding = isCollidingOnPos1 || isCollidingOnPos3; // || isCollidingOnPos2;

            if(isColliding)
            {
                // player.vx = 0;
                // player.ax = 0;
                //Existe colisión a la derecha
                player.isCollidingWithObstacleOnTheRight = true;

                //AJUSTE: Calculamos soplamiento (overlap) y lo eliminamos moviendo el personaje tantos písxeles como overlap a la izquierda
                overlap = Math.floor(yPos) % yBrickSize +1;
                player.yPos -= overlap;
            }

            break;

            case State.LEFT:
                //Primera colisión en (xPos + xSize - 1, yPos)
                xPos = player.xPos + player.hitBox.xOffset  - 1;
                yPos = player.yPos + player.hitBox.yOffset;
                isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
    
                //Segunda colisión en (xPos + xSize - 1, yPos + brickSize)
                // yPos = player.yPos + player.hitBox.yOffset + brickSize;
                // isCollidingOnPos2 = isCOllidingWithObstacleAt(xPos, yPos, obstacleId);
    
                //Última colisión en (xPos + xSize - 1, yPos + ySize - 1)
                yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
                
                //Habrá colisión si toca alguno de los 3 bloques
                isColliding = isCollidingOnPos1 || isCollidingOnPos3; // || isCollidingOnPos2;
    
                if(isColliding)
                {
                    // player.vx = 0;
                    player.physics.isOnGround = true;
                    //Existe colisión a la derecha
                    player.isCollidingWithObstacleOnTheRight = true;
    
                    //AJUSTE: Calculamos soplamiento (overlap) y lo eliminamos moviendo el personaje tantos písxeles como overlap a la izquierda
                    overlap = Math.floor(yPos) % xBrickSize + 1;
                    player.yPos -= overlap+10;
                    
                    
                }
                break;
        default:
            //Resto de estados. A rellenar
            break;


    }
}