export class Level
{
    constructor(data, imageSet)
    {
        this.data       = data;     //Array bidimensional de datos del mapa
        this.imageSet   = imageSet; //Datos de las imagenes del mapa
    }
}

//Data del nivel 1
export const level1 =
[
    [1,3,1,1,5,1,1,2],
    [3,1,5,1,1,3,1,4],
    [1,1,1,3,1,1,1,4],
    [1,5,1,1,1,1,3,2],
    [3,1,1,1,3,5,1,4],
    [1,1,3,1,1,1,1,2]

];