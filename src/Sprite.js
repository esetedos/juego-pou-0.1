//clase gestora de los sprites
export default class Sprite
{
    constructor(id, state, xPos, yPos, imageSet, frames)
    {
        this.id         = id;           //Tipo de sprite
        this.state      = state;        //estado de animacion del sprite
        this.xPos       = xPos;         //posición en x en canvas
        this.yPos       = yPos;         //posición en y en canvas
        this.imageSet   = imageSet;     //datos de las imagenes del sprite
        this.frames     = frames;       //datos de los frames de animacion

    }
}