//clase gestora de los sprites
export default class Sprite
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox, hitBox2)
    {
        this.id                                 = id;               //Tipo de sprite
        this.state                              = state;            //estado de animacion del sprite
        this.xPos                               = xPos;             //posición en x en canvas
        this.yPos                               = yPos;             //posición en y en canvas
        this.imageSet                           = imageSet;         //datos de las imagenes del sprite
        this.frames                             = frames;           //datos de los frames de animacion
        this.physics                            = physics;          //datos de las fisicas
        this.hitBox                             = hitBox;           //datos del hitbox
        this.hitBox2                            = hitBox2;          //segunda hitBox para resto de colisiones (que no sean plataformas)
        this.isCollidingWithPlayer              = false;            //Variable que indica si ha habido colisión con el player
        this.isCollidingWithObstacleOnTop       = false;            //Indica si ha habido colisión con un obstáculo hacia ARRIBA           
        this.isCollidingWithObstacleOnLeft      = false;            //Indica si ha habido colisión con un obstáculo hacia la IZQUIERDA
        this.isCollidingWithObstacleOnBottom    = false;            //Indica si ha habido colisión con un obstáculo hacia ABAJO
        this.isCollidingWithObstacleOnRight     = false;            //Indica si ha habido colisión con un obstáculo hacia la DERECHA
        //los últimos 4 no se usan(?)
    }
}

export class Plataformas extends Sprite
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics, platType, hitBox)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);
        this.isCollidingWithPlayer  = false;
        this.platType               = platType;
    }
}

export class PlataformasN extends Plataformas
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics, platType, tiempoDDesap, hitBox)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics, platType, hitBox);
        this.isCollidingWithPlayer  = false;
        this.tiempoDDesap           = tiempoDDesap; //tiempo para que las plataformas tipo nube desaparezcan después del salto
    }
}

