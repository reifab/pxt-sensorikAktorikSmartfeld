/**
 * Custom blocks
 */
//% color="#FF33B2" icon="\uf085"
namespace smartfeldAktoren {


    let strip = new neopixel.Strip();

    /**
    * Spins the motor in one direction at full speed
    * @param pin Which pin the motor is on
    */
    //% subcategory="Servo" weight=100 color=#2699BF
    //% group="360° Servo 114992423"
    //% blockId=spin_one_way 
    //% block="spin one way pin %pin"
    export function spin_one_way(pin = AnalogPin.P1): void {
        pins.servoWritePin(pin, 180)
    }

    /**
    * Spins the motor in other direction at full speed
    * @param pin Which pin the motor is on
    */
    //% subcategory="Servo" weight=80 color=#2699BF
    //% group="360° Servo 114992423"
    //% blockId=spin_other_way 
    //% block="spin other way pin %pin"
    export function spin_other_way(pin = AnalogPin.P2): void {
        pins.servoWritePin(pin, 0)
    }

    /**
    * Spins the motor in one direction, with a speed from 0 to 100
    * @param pin Which pin the motor is on
    * @param speed Speed from 0 to 100
    */
    //% subcategory="Servo" weight=60 color=#2699BF
    //% group="360° Servo 114992423"
    //% blockId=spin_one_way_with_speed
    //% block="spin one way pin %pin | with speed %speed"
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
    //% subcategory="Servo" weight=40 color=#2699BF
    //% group="360° Servo 114992423"
    //% blockId=spin_other_way_with_speed
    //% block="spin other way pin %pin | with speed %speed"
    //% speed.min=0 speed.max=100
    export function spin_other_way_with_speed(pin = AnalogPin.P2, speed = 50): void {
        let spin = 90 - (speed * 90) / 100
        pins.servoWritePin(pin, spin)
    }

    /**
    * Turns off the motor at this pin
    * @param pin Which pin the motor is on
    */
    //% subcategory="Servo" weight=20 color=#2699BF
    //% group="360° Servo 114992423"
    //% blockId=turn_off_motor 
    //% block="turn off motor at pin %pin"
    export function turn_off_motor(pin = DigitalPin.P1): void {
        pins.digitalWritePin(pin, 0)
    }


//--------------------------------------------------------------------------------------------------------


    //% subcategory="LED" weight=100 color=#2699BF
    //% group="RGB Strip 104020131"
    //% block="erstelle Strip " block="NeoPixel at pin %pin|with %numleds|leds as %mode"
    //% parts="neopixel"
    //% trackArgs=0,2
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
    //% strip.defl=neopixel_set_strip_rainbow
    //% blockSetVariable=range
    export function range(start: number, length: number): neopixel.Strip {
        return strip.range(start, length);
    }

    /**
     * Shows all LEDs to a given color (range 0-255 for r, g, b).
     * @param rgb RGB color of the LED
     */
    //% subcategory="LED" weight=95
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_set_strip_color" block="%strip|show color %rgb=neopixel_colors"
    //% strip.defl=strip
    export function showColor(rgb: number) {
        return strip.showColor(rgb);
    }


    //% subcategory="LED" weight=90 color=#2699BF
    //% group="RGB Strip 104020131" 
    //% block="setze RGB Wert " block="red %red|green %green|blue %blue" 
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
    //% strip.defl=strip
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
    //% strip.defl=strip
    //% icon="\uf080"
    export function showBarGraph(value: number, high: number): void {
        return strip.showBarGraph(value, high);
    }


    /**
     * Send all the changes to the strip.
     */
    //% subcategory="LED" weight=79
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_show" block="%strip|show" blockGap=8
    //% strip.defl=strip
    export function show() {
        return strip.show();
    }

    /**
     * Turn off all LEDs.
     * You need to call ``show`` to make the changes visible.
     */
    //% subcategory="LED" weight=76
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_clear" block="%strip|clear"
    //% strip.defl=strip
    export function clear(): void {
        strip.clear();
        strip.show();
    }

    /**
     * Shift LEDs forward and clear with zeros.
     * You need to call ``show`` to make the changes visible.
     * @param offset number of pixels to shift forward, eg: 1
    */
    //% subcategory="LED" weight=40
    //% group="RGB Strip 104020131"
    //% blockId="neopixel_shift" block="%strip|shift pixels by %offset" blockGap=8
    //% strip.defl=strip
    export function shift(): void {
        strip.shift();
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

}
