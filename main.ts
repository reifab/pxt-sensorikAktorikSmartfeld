input.onButtonPressed(Button.A, function () {
    laeuft = 0
    OLED.clear()
})
let laeuft = 0
OLED.init(128, 64)
laeuft = 1
let strip = neopixel.create(DigitalPin.P2, 10, NeoPixelMode.RGB)
let range = strip.range(0, 8)
basic.forever(function () {
    if (laeuft) {
        basic.pause(1000)
        OLED.writeString("UV: ")
        OLED.writeNumNewLine(smartfeldSensoren.hw837_getUV(AnalogPin.P0))
    }
})
basic.forever(function () {
    if (laeuft) {
        strip.showColor(smartfeldAktoren.rgb(54, 255, 220))
        basic.pause(1000)
        range.showRainbow(1, 360)
        basic.pause(1000)
        strip.clear()
        basic.pause(5000)
    }
})
