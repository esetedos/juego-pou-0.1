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
    }
}