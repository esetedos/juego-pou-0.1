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