export default class Frame
{
    constructor(framePerState, speed = 1)
    {
        this.framePerState      = framePerState;    //Número de frames por estados de animación
        this.frameCounter       = 0;                // contador de frames
        this.speed              = speed;            //velocidad de cambio de frame (Mínimo: 1. a mayor número, más lento)
        this.frameChangeCounter = 0;                //Contador de velocidad de cambio de frame
    }
}
