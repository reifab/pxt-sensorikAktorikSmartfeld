/**
 * Custom blocks
 */
//% color="#FF33B2" icon="\uf085"
namespace smartfeldAktoren {

    let strip = new neopixel.Strip();
    let chain = new smartfeldAktoren.Chain();

//--------------------------------------------------------------------------------------------------------

    /**
    * Spins the motor in one direction at full speed
    * @param pin Which pin the motor is on
    */
    //% subcategory="Servo" weight=100 
    //% group="360° Servo 114992423"
    //% blockId=spin_one_way 
    //% block="Drehe in eine Richtung auf Pin %pin"
    export function spin_one_way(pin = AnalogPin.P1): void {
        pins.servoWritePin(pin, 180)
    }

    /**
    * Spins the motor in other direction at full speed
    * @param pin Which pin the motor is on
    */
    //% subcategory="Servo" weight=80 
    //% group="360° Servo 114992423"
    //% blockId=spin_other_way 
    //% block="Drehe in andere Richtung auf Pin %pin"
    export function spin_other_way(pin = AnalogPin.P2): void {
        pins.servoWritePin(pin, 0)
    }

    /**
    * Spins the motor in one direction, with a speed from 0 to 100
    * @param pin Which pin the motor is on
    * @param speed Speed from 0 to 100
    */
    //% subcategory="Servo" weight=60 
    //% group="360° Servo 114992423"
    //% blockId=spin_one_way_with_speed
    //% block="Drehe in eine Richtung auf Pin %pin | mit Geschwindigkeit %speed"
    //% speed.min=0 speed.max=100
    export function spin_one_way_with_speed(pin = AnalogPin.P1, speed = 50): void {
        let spin = (speed * 90) / 100 + 90
        pins.servoWritePin(pin, spin)
    }

    /**
    * Spins the motor in the other direction, with a speed from 0 to 100
    * @param pin Which pin the motor is on
    * @param speed Speed from 0 to 100
    */
    //% subcategory="Servo" weight=40 
    //% group="360° Servo 114992423"
    //% blockId=spin_other_way_with_speed
    //% block="Drehe in andere Richtung auf Pin  %pin | mit Geschwindigkeit %speed"
    //% speed.min=0 speed.max=100
    export function spin_other_way_with_speed(pin = AnalogPin.P2, speed = 50): void {
        let spin = 90 - (speed * 90) / 100
        pins.servoWritePin(pin, spin)
    }

    /**
    * Turns off the motor at this pin
    * @param pin Which pin the motor is on
    */
    //% subcategory="Servo" weight=20 
    //% group="360° Servo 114992423"
    //% blockId=turn_off_motor 
    //% block="Schalte Servo auf Pin %pin aus"
    export function turn_off_motor(pin = DigitalPin.P1): void {
        pins.digitalWritePin(pin, 0)
    }

//--------------------------------------------------------------------------------------------------------

    //% subcategory="LED" weight=100 
    //% group="RGB Strip 104020131"
    //% block="erstelle Strip " block="NeoPixel auf Pin %pin|mit %numleds|LEDs als %mode"
    //% parts="neopixel"
    //% trackArgs=0,2
    //% numleds.defl=60
    //% blockSetVariable=strip
    export function create(pin: DigitalPin, numleds: number, mode: NeoPixelMode): neopixel.Strip {
        return neopixel.create(pin, numleds, mode);
    }

    /**
 * Create a range of LEDs.
 * @param start offset in the LED strip to start the range
 * @param length number of LEDs in the range. eg: 4
 */
    //% subcategory="LED" weight=99 
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_range" block="%strip|range from %start|with %length|leds"
    //% blockSetVariable=Bereich
    export function rangeInAnalog(start: number, length: number): neopixel.Strip {
        return strip.range(start, length);
    }

    /**
     * Shows all LEDs to a given color (range 0-255 for r, g, b).
     * @param rgb RGB color of the LED
     */
    //% subcategory="LED" weight=95 
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_set_strip_color" block="%strip|show color %rgb=neopixel_colors"
    export function showColor(rgb: number) {
        return strip.showColor(rgb);
    }

    //% subcategory="LED" weight=90 
    //% group="RGB Strip 104020131" 
    //% block="setze RGB Wert " block="rot %red|grün %green|blau %blue"
    export function rgb(red: number, green: number, blue: number): number {
        return neopixel.rgb(red, green, blue);
    }

    /**
     * Shows a rainbow pattern on all LEDs.
     * @param startHue the start hue value for the rainbow, eg: 1
     * @param endHue the end hue value for the rainbow, eg: 360
     */
    //% subcategory="LED" weight=85 
    //% group="RGB Strip 104020131" 
    //% blockId="neopixel_set_strip_rainbow" block="%strip|show rainbow from %startHue|to %endHue"
    export function showRainbow(startHue: number = 1, endHue: number = 360) {
        return strip.showRainbow(startHue, endHue);
    }

    /**
     * Displays a vertical bar graph based on the `value` and `high` value.
     * If `high` is 0, the chart gets adjusted automatically.
     * @param value current value to plot
     * @param high maximum value, eg: 255
     */
    //% subcategory="LED" weight=84 
    //% group="RGB Strip 104020131"
    //% blockId=neopixel_show_bar_graph block="%strip|show bar graph of %value|up to %high"
    export function showBarGraph(value: number, high: number): void {
        return strip.showBarGraph(value, high);
    }

    /**
     * Send all the changes to the strip.
     */
    //% subcategory="LED" weight=82 
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_show" block="%strip|show" blockGap=8
    export function show() {
        return strip.show();
    }

    /**
     * Turn off all LEDs.
     * !!!You need to call ``show`` to make the changes visible!!!
     */
    //% subcategory="LED" weight=76 
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_clear" block="%strip|clear"
    export function clear(): void {
        strip.clear();
    }

    /**
     * Sets the number of pixels in a matrix shaped strip
     * @param width number of pixels in a row
     */
    //% subcategory="LED" weight=70 
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_set_pixel_color" block="%strip|set pixel color at %pixeloffset|to %rgb=neopixel_colors"
    export function setPixelColor(pixeloffset: number, rgb: number): void {
        strip.setPixelColor(pixeloffset, rgb);
    }

    /**
     * Shift LEDs forward and clear with zeros.
     * !!!You need to call ``show`` to make the changes visible!!!
     * @param offset number of pixels to shift forward, eg: 1
    */
    //% subcategory="LED" weight=40 
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_shift" //% block="%strip|shift pixels by %offset" blockGap=8
    export function shift(): void {
        strip.shift();
    }

    /**
     * Set the brightness of the strip. 
     * !!!This flag only applies to future operation!!!
     * @param brightness a measure of LED brightness in 0-255. eg: 255
     */
    //% subcategory="LED" weight=40 
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_set_brightness" block="%strip|set brightness %brightness" blockGap=8
    export function setBrightness(brightness: number): void {
        strip.setBrightness(brightness);
    }

//--------------------------------------------------------------------------------------------------------

    /**
    * Erstelle eine RGB Kette
    */
    //% subcategory="LED" weight=90 
    //% group="Verkettbare RGB 104020048"
    //% block="Verkettbare RGB bei Clock Pin %clkPin|und Daten Pin %dataPin|mit  %numberOfLeds RGBs"
    //% trackArgs=0,2
    //% blockSetVariable=Kette
    //% clkPin.defl=DigitalPin.P0 dataPin.defl=DigitalPin.P14 numberOfLeds.defl=1
    export function createChain(clkPin: DigitalPin, dataPin: DigitalPin, numberOfLeds: number = 1): Chain {
        return chain.init(clkPin, dataPin, numberOfLeds) 
    }

    //% subcategory="LED" weight=89 
    //% group="Verkettbare RGB 104020048"
    export function setOneRGB(numberOfLED: number, red: number, green: number, blue: number) {
        return chain.setColorJustOne(numberOfLED, red, green, blue);
    }

    //% subcategory="LED" weight=88 
    //% group="Verkettbare RGB 104020048"
    export function setColorWholeChain(red: number, green: number, blue: number) {
        return chain.setColorChain(red, green, blue);
    }

//--------------------------------------------------------------------------------------------------------

    /**
     * Activate electromagnet
    */
    //% subcategory="Elektromagnet" weight=31 
    //% group="Elektromagnet 101020073"
    //% block="Elektromagnet ein |%pin"
    export function electromagnetEin(pin: DigitalPin) {

        pins.digitalWritePin(pin, 1);
        basic.pause(50);
    }
    /**
     * Deactivate electromagnet
    */
    //% subcategory="Elektromagnet" weight=30 
    //% group="Elektromagnet 101020073"
    //% block="Elektromagnet aus |%pin"
    export function electromagnetAus(pin: DigitalPin) {

        pins.digitalWritePin(pin, 0);
        basic.pause(50);
    }

//--------------------------------------------------------------------------------------------------------

    /**
     * Activate relay
    */
    //% subcategory="Relais" weight=29 
    //% group="Relais 103020005 "
    //% block="Relais ein |%pin"
    export function relaisEin(pin: DigitalPin) {

        pins.digitalWritePin(pin, 1);
        basic.pause(50);
    }
    /**
     * Deactivate relay
    */
    //% subcategory="Relais" weight=28 
    //% group="Relais 103020005 "
    //% block="Relais aus |%pin"
    export function relaisAus(pin: DigitalPin) {

        pins.digitalWritePin(pin, 0);
        basic.pause(50);
    }

    //--------------------------------------------------------------------------------------------------------

    //% subcategory="Display" weight=20 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="init Display Breite %width Höhe %height"
    //% width.defl=128
    //% height.defl=64
    export function displayInit(width: number, height: number){
        return OLED.init(width, height);
    }

    //% subcategory="Display" weight=19 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="schreibe String %str"
    export function displayWriteStr(str: string){
        return OLED.writeString(str);
    }

    //% subcategory="Display" weight=18 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="schreibe Nummer %num"
    export function displayWriteNum(num: number) {
        return OLED.writeNum(num);
    }

    //% subcategory="Display" weight=17 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="schreibe String und Zeilenumbruch %str"
    export function displayWriteStrNewLine(str: string) {
        return OLED.writeStringNewLine(str);
    }

    //% subcategory="Display" weight=16 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="schreibe Nummer und Zeilenumbruch %num"
    export function displayWriteNumNewLine(num: number) {
        return OLED.writeNumNewLine(num);
    }

    //% subcategory="Display" weight=15 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="Zeilenumbruch"
    export function displayNewLine() {
        return OLED.newLine();
    }

    //% subcategory="Display" weight=14 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="Lösche Displayinhalt"
    export function displayClear(){
        return OLED.clear();
    }

    //% subcategory="Display" weight=13 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="zeichne Ladebalken bei %percent Prozent"
    export function displayLoadingBar(percent: number){
        return OLED.drawLoading(percent);
    }

    //% subcategory="Display" weight=12 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="zeichne Linie von:|x: %x0 y: %y0 bis:| x: %x1 y: %y1""
    export function displayDrawLine(x0: number, y0: number, x1: number, y1: number)  {
        return OLED.drawLine(x0,y0,x1,y1);
    }

    //% subcategory="Display" weight=11 
    //% group="OLED Display 0.96'', SSD1306"
    //% block="zeichne Rechteck von:|x: %x0 y: %y0 bis:| x: %x1 y: %y1""
    export function displaydrawRectangle(x0: number, y0: number, x1: number, y1: number) {
        return OLED.drawRectangle(x0, y0, x1, y1);
    }

}