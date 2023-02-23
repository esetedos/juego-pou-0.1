//clase que gestiona el HitBox de un sprite
export default class HitBox
{
    constructor(xSize, ySize, xOffset, yOffset)
    {
        this.xSize      = xSize;        //tamaño de píxeles del hitbox (X)
        this.ySize      = ySize;        //Tamaño en píxeles del hitbox (Y)
        this.xOffset    = xOffset;      //Offset en X de comienzo de dibujo del HItBOx respecto de xPos
        this.yOffset    = yOffset;      //Offset en X de comienzo de dibujo del HItBOx respecto de yPos
    }
}
