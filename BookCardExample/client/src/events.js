// Contiene los eventos asociados a los botones interactivos. 

// events.js: La función btnStartDown() es la encargada de hacer la petición AJAX a la base de datos y recuperar toda la lista de libros. Los datos se reciben en formato string JSON a través de la variable responseText. 

// Nota: En la variable url pondremos la ruta absoluta o relativa del fichero getAllClassic.php

import globals from "./globals.js";
import {initGame} from "./initialize.js";

export function btnStartDown(event)
{
    //console.log("OK");

    //ocultamos el boton START
    globals.buttonStart.style.visibility = "hidden";

    document.getElementById('divCanvas').style.display = "block";



    //get
    //ruta o absoluta o relativa al fichero que hace la petición (html)
    const url = "http://localhost/BookCardExample/server/routes/getAllClassic.php";
    const request = new XMLHttpRequest();

    request.onreadystatechange = function()
    {
        if(this.readyState == 4)
        {
            //console.log( this.status);
            if (this.status == 200)
            {
                console.log(this.responseText)
                // console.log(this.responseText === null);
                if(this.responseText != null)
                {
                    // console.log(this.responseText);
                    const resultJSON = JSON.parse(this.responseText);
                    // console.log(resultJSON);
                    // console.log(this.responseText);

                    ///Inicializamos los datos del juego
                    initGame(resultJSON);
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

export function btnStartOver(event)
{
    //cambiamos el texto
    document.getElementById("btnStart").innerHTML = "OVER";
}

export function btnStartOut(event)
{
    //recuperamos el texto original
    document.getElementById("btnStart").innerHTML = "START";
}

export function btnAddDown(event)
{
    
    console.log("Add button pressed");

    //Generamos isbn aleatorio
    const userkod = Math.floor(Math.random() * 20+10);

    //Send data
    const objectToSend = {
        izena:     "XG Erudite",
        score:       "1974",
        userkod:       userkod
    }

    //String data to send
    const dataToSend =  'izena=' + objectToSend.izena + '&score=' + objectToSend.score +
                        '&userkod=' + objectToSend.userkod;

    // console.log(dataToSend);


 //post
    //Ruta relativa al fichero que hace la petición (testAjax.php)
    const url = "http://localhost/BookCardExample/server/routes/postClassic.php";
    const request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function()
    {
        // console.log(this.readyState);
        if(this.readyState == 4)
        {
            if(this.status == 200)
            {
                if(this.responseText != null)
                {
                    console.log(this.responseText);
                    const resultJSON = JSON.parse(this.responseText);
                    //console.log(resultJSON);

                    //Metemos los datos en un array, ya que lo que nos devuelve la ruta es un Objeto.
                    const arrayResult = [resultJSON];

                    //Iniciamos los datos
                    initGame(arrayResult);
                }
                else
                    alert("Comunication error: No data recived");
            }
            else
                alert("Comunication error: " + this.statusText);
        }
    }

    request.responseType = "text";
    request.send(dataToSend);
}












