//Variables globales
import {Game} from "./constants.js"

export default {

    //Acceso al canvas y context
    canvas: {},
    ctx:    {},
    canvasHUD: {},
    ctxHUD: {},
    ctxHUDHS:   {},

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

    letterTimer: {},

    timerProba: {},

    timerSaltoKop: {},

    //Objeto que guarda el estado de la tecla pulsada
    action: {},

    life: 0,

    saltoKop: 0,

    metroak: 0,

    crearNuevasPlataf: false,

    tileMap: [],
    
    particles: [],

    startParticles: false,

    highScore: 0,

    arrayBD:  [],

    levelOne: false,
    levelTwo: false,
    levelThree: false,
    levelFour: false,
    levelFive: false,

    stopMoving: false,

    kont: 0,

    izena: "",

    score:  0,

    asciCode: -1,

    introducirDatosBD: false,

    dificultad: 0,

    saltoDeNuevo: false,

    maxPlataformas: 15, //siempre habrá un máximo de 5 plataformas en pantalla
//3 plataformas por fila, y 5 filas

    kontPlataforms: 0, //número de plataformas al inicio

    maxPlatAlcanzado: false,

    //sonidos
    sounds: [],

    //current sound play
    currentSound: -1

};