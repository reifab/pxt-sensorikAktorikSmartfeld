input.onButtonPressed(Button.A, function () {
    laeuft = 0
    OLED.clear()
    smartfeldAktoren.electromagnetAus(DigitalPin.P2)
    led.unplot(0, 0)
})
let laeuft = 0
OLED.init(128, 64)
led.plot(0, 0)
smartfeldAktoren.electromagnetEin(DigitalPin.P2)
basic.forever(function () {
    led.plot(0, 0)
    smartfeldAktoren.electromagnetEin(DigitalPin.P2)
    basic.pause(2000)
    led.unplot(0, 0)
    smartfeldAktoren.electromagnetAus(DigitalPin.P2)
    basic.pause(2000)
})
basic.forever(function () {
    if (laeuft) {
        basic.pause(1000)
        OLED.writeString("UV: ")
        OLED.writeNumNewLine(smartfeldSensoren.hw837_getUV(AnalogPin.P0))
    }
})
