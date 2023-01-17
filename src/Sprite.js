//clase gestora de los sprites
export default class Sprite
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics)
    {
        this.id             = id;               //Tipo de sprite
        this.state          = state;            //estado de animacion del sprite
        this.xPos           = xPos;             //posición en x en canvas
        this.yPos           = yPos;             //posición en y en canvas
        this.imageSet       = imageSet;         //datos de las imagenes del sprite
        this.frames         = frames;           //datos de los frames de animacion
        this.physics        = physics;          //datos de las fisicas
        
    }
}

export class Plataformas extends Sprite
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics, platType)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics);
        this.platType       = platType;
    }
}

export class PlataformasN extends Plataformas
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics, platType, tiempoDDesap)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics, platType);
        this.tiempoDDesap   = tiempoDDesap; //tiempo para que las plataformas tipo nube desaparezcan después del salto
    }
}