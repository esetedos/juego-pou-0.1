export default class Frame
{
    constructor(framePerState)
    {
        this.framePerState = framePerState;     //Número de frames por estados de animación
        this.frameCounter  = 0;                 // contador de frames
    }
}
