class Particle
{
    constructor(id, state, xPos, yPos, radius, alpha, physics)
    {
        this.id             = id;
        this.state          = state;
        this.xPos           = xPos;
        this.yPos           = yPos;
        this.radius         = radius;   //radio de partícula esférica a dibujar
        this.alpha          = alpha;    //valor de transparencia de la partícula
        this.physics        = physics;
    }
}

export default class ExplosionParticle extends Particle
{
    constructor(id, state, xPos, yPos, radius, alpha, physics, timeToFade)
    {
        super(id, state, xPos, yPos, radius, alpha, physics);

        this.fadeCounter    = 0;
        this.timeToFade     = timeToFade;
    }
}