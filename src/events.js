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
    }
}