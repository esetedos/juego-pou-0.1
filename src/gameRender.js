import globals from "./globals.js";
import { Game, ParticleState, Tile, ParticleID, SpriteID } from "./constants.js";


//Función que renderiza los gráficos
export default function render()
{
    //Change what the game is doing based on the game state
    switch(globals.gameState)
    {
        case Game.LOADING:
            //Draw loading spinner
            renderTextAndBar();
            break;

        case Game.NEW_GAME:
            renderNewGame();
            break;
        
        case Game.PLAYING:
            drawGame();
            break;

        case Game.GAME_OVER:
            renderGameOver();
            break;

        case Game.HIGH_SCORE:
            renderHigh_Score();
            break;

        case Game.HISTORY:
            renderHistory();
            break;
        
        default:
            console.error("Error: Game State invalid");
    }
}

function  drawGame()
{
    //Borramos la pantalla entera
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);

    //Movemos la cámara
    moveCamera();

    //dibujamos el mapa (nivel)
    renderMap();

    //dibujamos los elementos
    renderSprites(); //antes ponía drawSprites

    //dibujamos las partículas
    renderParticles();

    //restauramos la cámara
    restoreCamera();

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
        if(sprite.id != SpriteID.CARROT)  
            renderSprite(sprite);
        // drawHitBox(sprite);
    }
    for(let i = 0; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];  
        if(sprite.id == SpriteID.CARROT)  
            renderSprite(sprite);
    }

    // drawHitBox2(globals.sprites[0]); //dibujo de la segunda HitBox del player n
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
    const score = Math.floor(globals.metroak/10)*10;
    const highScore = globals.highScore;
    const life = globals.life;
    const time = globals.levelTime.value;

    //Draw score
    globals.ctxHUD.font = '8px emulogic';
    globals.ctxHUD.fillStyle = 'lightgreen';
    globals.ctxHUD.fillText("score", 5, 8);
    globals.ctxHUD.fillText("|", 50, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText( globals.score, 15, 16);

    //Draw high score
    globals.ctxHUD.fillStyle = 'lightgreen';
    globals.ctxHUD.fillText("HS", 75, 8);
    // globals.ctxHUD.fillText("SCORE", 104, 8);
    globals.ctxHUD.fillText("|", 106, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText(" " + globals.fakeHS, 54, 16);
    // globals.ctxHUD.fillText(" " + globals.timerSaltoKop.value, 120, 16);

    // Draw life
    globals.ctxHUD.fillStyle = 'lightgreen';
    globals.ctxHUD.fillText("Life", 118, 8);
    globals.ctxHUD.fillText("|", 156, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText(" " + life, 120, 16);

    //draw time
    
    globals.ctxHUD.fillStyle = 'lightgreen';
    globals.ctxHUD.fillText("LEVEL", 168, 8);
    globals.ctxHUD.fillText("|", 210, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText(globals.dificultad, 185, 16);
    
    
    globals.ctxHUD.fillStyle = 'lightgreen';
    globals.ctxHUD.fillText("TIME", 220, 8);
    globals.ctxHUD.fillStyle = 'lightgray';
    globals.ctxHUD.fillText(time, 230, 16);
    // globals.ctxHUD.fillText("|", 190, 8);
    
    
    //round corners. (remove 1 pixel per corner)
    globals.ctxHUD.fillStyle = 'black';
    globals.ctxHUD.fillRect(168, 9, 1, 1);
    globals.ctxHUD.fillRect(168, 15, 1, 1);
    globals.ctxHUD.fillRect(168 + life - 1, 9, 1, 1);
    globals.ctxHUD.fillRect(168 + life - 1, 15, 1, 1);

}



function renderNewGame()
{
    globals.ctxHUD.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    // reiniciaCameraHS(); //no va
    // globals.ctx.drawImage(new_game,0,0);
    globals.ctx.drawImage(
        globals.tileMap[0],
        0, 0,                       //the source x and y position
        256, globals.canvas.width,               //the source height and width
        0, 0,                         //the destination x and y position
        256, globals.canvas.width                     //the destination height and width
                    
    );
}

function renderGameOver()
{
    

    
    globals.ctxHUD.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctx.drawImage(
        globals.tileMap[1],
        0, 0,                       //the source x and y position
        256, globals.canvas.width,               //the source height and width
        0, 0,                         //the destination x and y position
        256, globals.canvas.width                     //the destination height and width
                    
    );
    globals.ctxHUD.font = '8px emulogic';
    globals.ctx.fillStyle = 'white';
    globals.ctx.fillText("name:", 75, 120);
    globals.ctx.fillStyle = 'lightgray';
    globals.ctx.fillText(globals.izena, 135, 120);

}

function renderHigh_Score()
{
    renderHudHighScore();
   
}

function renderHistory()
{
    globals.ctxHUD.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctx.drawImage(
        globals.tileMap[3],
        0, 0,                       //the source x and y position
        256, globals.canvas.width,               //the source height and width
        0, 0,                         //the destination x and y position
        256, globals.canvas.width                     //the destination height and width
                    
    );
}


function renderParticles()
{
    for(let i = 0; i < globals.particles.length; ++i)
    {
        const particle = globals.particles[i];
        renderParticle(particle);
    }
}

function renderParticle(particle)
{
    const type = particle.id;
    switch (type)
    {
        //caso del jugador
        case ParticleID.EXPLOSION:
            renderExplosionParticle(particle);
            break;

        default:
            break;
    }
}

function renderExplosionParticle(particle)
{
    if(particle.state != ParticleState.OFF)
    {
        globals.ctx.fillStyle = 'brown';
        globals.ctx.globalAlpha = particle.alpha; // Set alpha
        globals.ctx.beginPath();
        globals.ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, 2 * Math.PI);
        globals.ctx.fill();
        globals.ctx.globalAlpha = 1.0; //Restore alpha
    }
}

function moveCamera() //Función que nos desplazará el origen de coordenadas a la posición nueva. Se llamará antes de dibujar los elementos en el canvas
{
    const xTranslation = -globals.camera.x;
    const yTranslation = -globals.camera.y;

    globals.ctx.translate(xTranslation, yTranslation);
}

function restoreCamera() //Función que restaurará la cámara (el origen de coordenadas) a su posición inicial, para dejarla lista para el siguiente ciclo de ejecución.
{
    globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
}



function renderHudHighScore()
{
    globals.ctxHUD.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    // globals.ctxHUDHS.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);
    globals.ctx.font = '16px emulogic';
    globals.ctx.fillText("HIGH SCORES", 35, 16);
    globals.ctx.font = '7px emulogic';
    globals.ctx.fillText("B tekla atzera bueltatzeko", 30, 180);
    globals.ctx.font = '8px emulogic';
    globals.ctx.fillStyle = 'white';

    moveCameraHS(); 
    
    for(let i = 0; i < globals.arrayBD.length; i++)
    {
        let y = 60+i*17;
        if(y - globals.cameraHS.y >40 && y - globals.cameraHS.y <160)
        {
            globals.ctx.fillText(i+1, 50, y)
            globals.ctx.fillText(globals.arrayBD[i].izena, 80, y);
            globals.ctx.fillText(globals.arrayBD[i].score, 150, y);
        }
    }
    restoreCameraHS();

    if(globals.cameraHS.y > globals.arrayBD.length*17) //8
    {
            globals.cameraHS.y = 70-globals.canvas.height;
    }
    
}


function moveCameraHS()
{
    const yTranslation = -globals.cameraHS.y;

    globals.ctx.translate(0, yTranslation);
}

function restoreCameraHS()
{
    globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
}



function renderTextAndBar()
{
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctx.fillStyle = 'white';

    globals.ctx.fillRect(35, 100, globals.assetsLoaded *(180/globals.assetsToLoad.length), 16);

    if(globals.assetsLoaded *(180/globals.assetsToLoad.length) === 180)
    {
        globals.ctx.font    = '12px emulogic';
        globals.ctx.fillStyle   = 'white';
        globals.ctx.fillText("B tekla sakatu", 40, 60);
    }

}