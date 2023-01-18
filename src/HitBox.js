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

// caso del conejo
// ySize: 14
// xSize:13
// yOffset: 1
// xOffset: 2
// 13, 14, 2, 1