//clase que gestiona el tileSet de un sprite
export default class imageSet
{
    constructor (initFil, initCol, xSize, ySize, xGridSize, yGridSize, xOffset, yOffset)
    {
        this.initFil    = initFil;      //Fila de inicio de nuestro ImageSet
        this.initCol    = initCol;      //Columna de inicio de nuestro ImageSet
        this.xSize      = xSize;        //Tamaño de pixeles de la imagen (X)
        this.ySize      = ySize;        //Tamaño de pixeles de la imagen (y)
        this.xOffset    = xOffset;      //Offset en X de comienzo de dibujo del personaje respecto de la rejilla
        this.yOffset    = yOffset;      //Offset en y de comienzo de dibujo del personaje respecto de la rejilla
        this.xGridSize   = xGridSize;     //tamaño de pixeles de la rejilla contenedora de la imagen (X e Y)
        this.yGridSize   = yGridSize;     //tamaño de pixeles de la rejilla contenedora de la imagen (X e Y)
    }
}