import globals from "./globals.js";
import { Game } from "./constants.js";
import {Tile} from "./constants.js";
import Timer from "./Timer.js"; //lo he puesto yo (no está en los tutoriales)

//Función que renderiza los gráficos
export default function render()
{
    //Change what the game is doing based on the game state
    switch(globals.gameState)
    {
        case Game.LOADING:
            //Draw loading spinner
            break;
        
        case Game.PLAYING:
            drawGame();
            break;
        
        default:
            console.error("Error: Game State invalid");
    }
}

function drawGame()
{
    //Borramos la pantalla entera
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);

    /*//Pintamos los FPS en pantalla
    globals.ctx.fillText("FPS: " + 1 / globals.deltaTime, 30, 30);
    */

    //dibujamos el mapa (nivel)
    renderMap();

    //dibujamos los elementos
    renderSprites(); //antes ponía drawSprites

    //dibujamos el HUD
    renderHUD();
}

function renderSprite(sprite)
{
    //calculamos la posicion del tile de inicio
    const xPosInit = sprite.imageSet.initCol * sprite.imageSet.xGridSize;
    const yPosInit = sprite.imageSet.initFil * sprite.imageSet.yGridSize;

    //Calculamos la posicion en el tiempo a dibujar
    const xTile = xPosInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
    const yTile = yPosInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    //Dibujamos el nuevo fotograma de sprite en la posicion adecuada
    globals.ctx.drawImage(
        globals.tileSets[Tile.SIZE_64],                                //the image file
        xTile, yTile,                                   //the source x and y position
        sprite.imageSet.xSize, sprite.imageSet.ySize,   //the source height and width
        xPos, yPos,                                     //the destination x and y position
        sprite.imageSet.xSize, sprite.imageSet.ySize    //the destination height and width
    );
}

//Crearemos la función drawSprites() que recorrerá el array sprites y llamará para cada uno de ellos a renderSprite()
function renderSprites() //o drawSprites (que era como estaba)
{
    for(let i = 0; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];

        //TEST: DIbuja un rectangulo alrededor del sprite
        // drawSpriteRectangle(sprite);     
        renderSprite(sprite);
        drawHitBox(sprite);
       
    }
    const player = globals.sprites[0]; 
    drawHitBox2(player); //dibujo de la segunda HitBox del player n
}

function drawSpriteRectangle(sprite)
{
    //datos del sprite
    const  x1 = Math.floor(sprite.xPos);
    const  y1 = Math.floor(sprite.yPos);
    const w1 = sprite.imageSet.xSize;
    const h1 = sprite.imageSet.ySize;

    globals.ctx.fillStyle= "green";
    globals.ctx.fillRect(x1, y1, w1, h1);
}

function drawHitBox(sprite)
{
    //datos del sprite
    const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.hitBox.xOffset);
    const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.hitBox.yOffset);
    const w1 = sprite.hitBox.xSize;
    const h1 = sprite.hitBox.ySize;

    globals.ctx.strokeStyle = "red";
    globals.ctx.strokeRect(x1, y1, w1, h1);
}

function drawHitBox2(sprite)
{
    //datos del sprite
    const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.hitBox2.xOffset);
    const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.hitBox2.yOffset);
    const w1 = sprite.hitBox2.xSize;
    const h1 = sprite.hitBox2.ySize;

    globals.ctx.strokeStyle = "red";
    globals.ctx.strokeRect(x1, y1, w1, h1);
}

function renderMap()
{
    const brickSize = globals.level.imageSet.xGridSize;
    const levelData = globals.level.data;

    //dibujamos el mapa
    const num_fil = levelData.length;
    const num_col = levelData[0].length;

    for(let i = 0; i<num_fil; ++i)
    {
        for(let j = 0; j<num_col ; ++j)
        {
            const xTile = (levelData[i][j] - 1)* brickSize;
            const yTile = 0;
            const xPos = j * brickSize;
            const yPos = i * brickSize;

            //dibujamos el nuevo fotograma del sprite en la posicion adecuada
            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_32],     //the image file
                xTile, yTile,                       //the source x and y position
                brickSize, brickSize,               //the source height and width
                xPos, yPos,                         //the destination x and y position
                brickSize, brickSize                //the destination height and width
            );
        }
    }
}

function renderHUD() //el texto que aparecerá mostrando la puntuación y tal
{
    //TEST: datos metidos en bruto
    const score = 1500;
    const highScore = 130000;
    const life = 40;
    const time = globals.levelTime.value;

    //Draw score
    globals.ctxHUD.font = '8px emulogic';
    globals.ctxHUD.fillStyle = 'lightgreen';
    globals.ctxHUD.fillText("METROAK", 8, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText(" " + globals.life, 8, 16);

    //Draw high score
    globals.ctxHUD.fillStyle = 'lightgreen';
    globals.ctxHUD.fillText("HIGH SCORE", 90, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText(" " + globals.saltoKop, 100, 16);

    //Draw life
    // globals.ctxHUD.fillStyle = 'lightgreen';
    // globals.ctxHUD.fillText("BIZITZA", 168, 8);
    // globals.ctxHUD.fillStyle = 'lightgray';
    // globals.ctxHUD.fillRect(168, 9, life, 8);

    //round corners. (remove 1 pixel per corner)
    globals.ctxHUD.fillStyle = 'black';
    globals.ctxHUD.fillRect(168, 9, 1, 1);
    globals.ctxHUD.fillRect(168, 15, 1, 1);
    globals.ctxHUD.fillRect(168 + life - 1, 9, 1, 1);
    globals.ctxHUD.fillRect(168 + life - 1, 15, 1, 1);

    //draw time
    globals.ctxHUD.fillStyle = 'lightgreen';
    globals.ctxHUD.fillText("DENBORA", 190, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText(time, 215, 16);
}