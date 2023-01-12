//Constants

//Estados del juego
export const Game = {
    INVALID: -1,
    LOADING:  0,
    PLAYING:  1,
    OVER:     2
};

//Velocidad del juego
export const FPS = 30;

//Identificador de tipo de sprite (ID)
export const SpriteID = {
    PLAYER: 0,
    PLATAFORM: 1,
    JOKER: 2,
    KNIGHT: 3
}

//identificador de estado de sprite (direccion)
export const State = {
    // Estados PLAYER
    LEFT:   0,
    RIGHT:  1,

    //Estados PIRATE
    SOLID:    0,

    //Estados JOKER, KNIGHT
    STILL: 0
}

//diferentes tileSets
export const Tile = {
    SIZE_64: 0,
    SIZE_32: 1
}

//id de bloque del mapa
export const Block = {
    EMPTY:      0,
    VINES:      1,
    BROWN_1:    2,
    BROWN_2:    3,
    DARK_1:     4,
    GRAY:       5,
    CRISTAL_1:  6,
    CRISTAL_2:  7

}
