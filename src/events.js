import {Key} from "./constants.js";
import globals from "./globals.js";

export function keydownHandler(event)
{
    switch(event.keyCode)
    {
        case Key.LEFT:
            globals.action.moveLeft = true;
            break;
        
        case Key.RIGHT:
            globals.action.moveRight = true;
            break;

        case Key.JUMP:
            globals.action.jump = true;
            break;

        case Key.H:
            globals.action.H = true;
            break;

        case Key.B:
            globals.action.B = true;
            break;

        case Key.G:
            globals.action.G = true;
            break;
    }   
}

export function keyupHandler(event)
{
    switch(event.keyCode)
    {
        case Key.LEFT:
            globals.action.moveLeft = false;
            break;
        
        case Key.RIGHT:
            globals.action.moveRight = false;
            break;   

        case Key.JUMP:
            globals.action.jump = false;
            break;

        case Key.H:
            globals.action.H = false;
            break;

        case Key.B:
            globals.action.B = false;
            break;

        case Key.G:
            globals.action.G = false;
            break;
    }
}

export function initBaseDeDatos()
{


//get
    //ruta o absoluta o relativa al fichero que hace la petición (html)
    const url = "http://localhost:8080/juego/CarpetaDelJuego(git)/server/routes/getAllClassic.php/";    //   https://2223arcadetalde3.aegcloud.pro/serverEstitxu/server/routes/getAllClassic.php";
    const request = new XMLHttpRequest();

    request.onreadystatechange = function()
    {
        
        if(this.readyState == 4)
        {
            
            //console.log( this.status);
            if (this.status == 200)
            {console.log("entra");
                console.log(this.responseText);
                // console.log(this.responseText === null);
                if(this.responseText != null)
                {
                    // console.log(this.responseText);
                    const resultJSON = JSON.parse(this.responseText);
                    // console.log(resultJSON);
                    // console.log(this.responseText);

                    ///Inicializamos los datos del juego
                    // initGame(resultJSON);
                    globals.arrayBD = resultJSON;
                    console.log(globals.arrayBD);
                }
                else
                    alert("Communication error: No data recived");
            }
            else 
                alert("Communication error: " + this.statusText);
        }
    }

    request.open('GET', url, true);
    request.responseType = "text";
    request.send();

}