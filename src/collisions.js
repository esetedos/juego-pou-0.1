import globals from "./globals.js";

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
export default function detectCollisions()
{
    //clculamos colision del player con cada uno de los sprites
    for(let i = 1; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];
        detectCollisionBetweenPlayerAndSprite(sprite);
    }
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