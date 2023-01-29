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
    [1,3,1,1,5,1,1,1],
    [3,1,5,1,1,3,1,3],
    [1,1,1,3,1,1,1,1],
    [1,5,1,1,1,1,3,1],
    [3,1,1,1,3,5,1,1],
    [1,1,3,1,1,1,1,2],
    [1,1,3,1,1,1,1,2]       //esta fila se queda fuera de la pantalla

];