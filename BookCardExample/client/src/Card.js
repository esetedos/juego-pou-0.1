//  Contendrá la clase Card, que nos servirá para crear las tarjetas.

export default class Card
{
    constructor(xPos, yPos, userkod, izena, score)
    {
        this.xPos       = xPos;     //posición inicial en X
        this.yPos       = yPos;     // Posición inicial en Y
        this.userkod       = userkod;
        this.izena      = izena;
        this.score       = score;
        // this.author     = author;
        // this.category   = category;
    }
}