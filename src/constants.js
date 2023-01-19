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
    ARROW: 2,
    CARROT: 3,
    PLATAFORMN: 4
}

//identificador de estado de sprite (direccion)
export const State = {
    // Estados PLAYER
    LEFT:   0,
    RIGHT:  1,
    STILL_LEFT: 2,
    STILL_RIGHT: 3, 

    //Estados PIRATE- PLATAFORMAS, 
    BROKE:   -1,  //para hacer splice
    SOLID:    0,

    //Estados FLECHA (ARROW)
    BROKE_2: -1,
    SOLID_2: 0, //para la flecha también

    //Estados de CARROT
    BROKE_3: -1,
    SOLID_3: 0,

    //estados PLATAFORMASN
    BROKE_4: -1,
    SOLID_4: 0
}

//diferentes tileSets
export const Tile = {
    SIZE_64: 0,
    SIZE_32: 1
}

//id de bloque del mapa
export const Block = {
    EMPTY:      0,
    SKY:        1,
    WOOD:       2,
    CLOUDS:     3,
    WOOD_2:     4,
    CLOUDS_2:   5,
    WOOD_3:     6,
    WOOD_4:     7,
    WOOS_5:     8

}

export const Key = {
    RIGHT:  39,
    LEFT:   37,
    JUMP:   32
}

//aceleración
export const GRAVITY = 80;