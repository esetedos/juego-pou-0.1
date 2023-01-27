//Variables globales
import {Game} from "./constants.js"

export default {

    //Acceso al canvas y context
    canvas: {},
    ctx:    {},
    canvasHUD: {},
    ctxHUD: {},

    //Estado del juego. Inicializamos o INVALID
    gameState: Game.INVALID,

    //Tiempo de ciclo anterior (ms)
    previousCycleMilliseconds: -1,

    //Tiempo de ciclo de juego real (seconds)
    deltaTime: 0,

    //Tiempo de ciclo objetivo (seconds, constante)
    frameTimeObj: 0,

    //Caja de texto para mostrar datos de depuración
    txtPruebas: {},

    //datos de imagen (tileset). MOdificados por ARRAY
    //tileSet: {},
    tileSets: [],

    //variables para gestionar la carga de activos
    assetsToLoad: [],
    assetsLoaded: 0,

    //Array con datos de los sprites
    sprites: [],

    //datos del nivel
    level: {},

    //temporizacion nivel
    levelTime: {},

    //Objeto que guarda el estado de la tecla pulsada
    action: {},

    life: 0,

    saltoKop: 0,

    metroak: 0,

    crearNuevasPlataf: false,

    tileMap: []
};