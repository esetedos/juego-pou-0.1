export default class Time
{
    constructor(value, timeChangeValue)
    {
        this.value              = value;            //valor del temporizador
        this.timeChangeCounter  = 0;                //temporizador para cambiar valor (seconds)
        this.timeChangeValue   = timeChangeValue;   //tiempo para cambiar valor (seconds)
    }
}