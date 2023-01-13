export default class Physics
{
    constructor(vLimit)
    {
        this.vx     = 0;        //valor actual de la velocidad en el eje X (pixels / second)
        this.vy     = 0;        //valor actual de la velocidad en el eje Y (pixels / second)
        this.vLimit =vLimit;    //Velocidad máxima en la que puede ir el sprite
    }
}