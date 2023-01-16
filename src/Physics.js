export default class Physics
{
    constructor(vLimit, aLimit = 0, friction = 1, jumpForce)
    {
        this.vx         = 0;            //valor actual de la velocidad en el eje X (pixels / second)
        this.vy         = 0;            //valor actual de la velocidad en el eje Y (pixels / second)
        this.vLimit     = vLimit;        //Velocidad máxima en la que puede ir el sprite
        this.ax         = 0;            //aceleracion del eje X
        this.ay         = 0;            //aceleración del eje Y
        this.aLimit     = aLimit;       //Aceleracion limite (Por defecto 0. No hay aceleración)
        this.friction   = friction;     //fuerza de fricción (valor entre 0 y 1. Por defecto valdrá 1 - No fricción)
        this.jumpForce  = jumpForce;    //fuerza de salto (debe ser negativa. Por defecto = 0)
        this.isOnGround  = false;        //variable que se pone a true si estamos en el suelo
    }
}