// Gib deinen Code hier ein
/**
 * Organize your blocks in groups
 */

//% color="#FF33B2" icon="\uf185"
namespace sensoren {

    const gestureEventId = 3100;
    let lastGesture = GroveGesture.None;
    let paj7620 = new PAJ7620();
    //let bme680 = new BME680();
    let sgp30 = new SGP30();
    let si1151 = new SI1151();

    //% group="Ultraschallsensor 101020010"
    //% block="Distanz in cm |%pin"
    //% subcategory="Optische Sensoren" weight=100
    export function measureInCentimetersV2(pin: DigitalPin): number {
        let distanceBackup: number = 0;
        let duration = 0;
        let RangeInCentimeters = 0;

        pins.digitalWritePin(pin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(20);
        pins.digitalWritePin(pin, 0);
        duration = pins.pulseIn(pin, PulseValue.High, 50000); // Max duration 50 ms

        RangeInCentimeters = duration * 153 / 44 / 2 / 100;

        if (RangeInCentimeters > 0) distanceBackup = RangeInCentimeters;
        else RangeInCentimeters = distanceBackup;

        basic.pause(50);
        return RangeInCentimeters;
    }

    //% group="Bewegungsmelder 101020617"
    //% block="erkenne Bewegung |%pin"
    //% subcategory="Optische Sensoren" weight=50
    export function motionDetected(pin: DigitalPin): number {

        let motionDetected;

        motionDetected = pins.digitalReadPin(pin);

        basic.pause(50);
        return motionDetected;
    }

    //% group="Magnetschalter 101020038"
    //% block="erkenne Magnetfeld |%pin"
    //% subcategory="Mechanische Sensoren" weight=50
    export function fieldDetected(pin: DigitalPin): number {

        let fieldDetected;

        fieldDetected = pins.digitalReadPin(pin);

        basic.pause(50);
        return fieldDetected;
    }

    //% group="Kraftsensor 101020004"
    //% block="messe Kraft |%pin"
    //% subcategory="Mechanische Sensoren" weight=50
    export function kraftsensorGibKraft(pin: AnalogPin): number {

        let RangeInAnalog = 0;

        RangeInAnalog = pins.analogReadPin(pin);

        basic.pause(50);
        return RangeInAnalog;
    }

    //% group="Lichtschranke 101020004"
    //% block="Taster betaetigt |%pin"
    //% subcategory="Mechanische Sensoren"
    export function microswitchActuated(pin: DigitalPin): number {

        let actuationDetected;

        actuationDetected = pins.digitalReadPin(pin);

        basic.pause(50);
        return actuationDetected;
    }

    //% group="Lichtschranke 101020174"
    //% block="Objekt in Lichtschranke erkannt |%pin"
    //% subcategory="Optische Sensoren"
    export function reflectiveLightsensorObjectDetected(pin: DigitalPin): number {

        let objectDetected;

        objectDetected = pins.digitalReadPin(pin);

        basic.pause(50);
        return objectDetected;
    }

    /**
    * init Grove Gesture modules
    * 
    */
    //% group="Gestensensor 101020083"
    //% blockId=grove_initgesture block="Gestensensor initialisieren"
    //% subcategory="Optische Sensoren"
    export function initGesture() {
        if (!paj7620) {
            paj7620.init();
        }
    }

    /**
     * get Grove Gesture model
     * 
     */
    //% group="Gestensensor 101020083"
    //% blockId=grove_getgesture block="gib Gestikmuster"
    //% subcategory="Optische Sensoren"
    export function getGestureModel(): number {
        return paj7620.read();
    }

    /**
      * Converts the gesture name to a number
      * Useful for comparisons
      */
    //% group="Gestensensor 101020083"
    //% blockId=ggesture block="%key"
    //% subcategory="Optische Sensoren"
    export function ggesture(g: GroveGesture): number {
        return g;
    }

    /**
     * Do something when a gesture is detected by Grove - Gesture
     * @param gesture type of gesture to detect
     * @param handler code to run
     */
    //% group="Gestensensor 101020083"
    //% blockId=grove_gesture_create_event block="bei Gestik|%gesture"
    //% subcategory="Optische Sensoren"
    export function onGesture(gesture: GroveGesture, handler: () => void) {
        control.onEvent(gestureEventId, gesture, handler);
        paj7620.init();
        control.inBackground(() => {
            while (true) {
                const gesture = paj7620.read();
                if (gesture != lastGesture) {
                    lastGesture = gesture;
                    control.raiseEvent(gestureEventId, lastGesture);
                }
                basic.pause(50);
            }
        })
    }

    /**
    * init Grove Gas module
    * 
    */
    //% group="Gassensor 101020512"
    //% block="init Gassensor"
    //% subcategory="Umweltsensoren" weight=100
    export function initGas(): string {
        //if (!sgp30) {
        return sgp30.init();
    }

    /**
    * Read tVOC value of gas sensor
    * 
    */
    //% group="Gassensor 101020512"
    //% block="messe tVOC"
    //% subcategory="Umweltsensoren" weight=60
    export function measReadtVOC(): number {
        //if (!sgp30) {
        return sgp30.sgp30_measRead_tVOC();
    }

    /**
    * Read CO2eq value of gas sensor
    * 
    */
    //% group="Gassensor 101020512"
    //% block="messe CO2eq"
    //% subcategory="Umweltsensoren" weight=40
    export function measReadCO2eq(): number {
        //if (!sgp30) {
        return sgp30.sgp30_measRead_CO2eq();
    }

    //% group="Potentiometer 101020036"
    //% block="Prozentzahl |%pin |%led"
    //% pin.defl=AnalogPin.P2 led.defl=AnalogPin.P16
    //% subcategory="Restliche Sensoren"
    export function potentiometerGibProzent(pin: AnalogPin, led: AnalogPin): number {

        let duration = 0;
        let RangeInCentimeters = 0;
        let RangeInPercent = 0;

        RangeInCentimeters = pins.analogReadPin(pin);
        pins.analogWritePin(led, RangeInCentimeters); //setze LED auf Poti-Board
        RangeInPercent = RangeInCentimeters * 100 / 1023;

        basic.pause(50);
        return RangeInPercent;
    }

    /**
    * init Grove Sunlight module
    * 
    */
    //% group="SunlightSensor 101020089"
    //% block="init sunlight sensor"
    //% subcategory="Optische Sensoren"
    export function initSunlight(): string {
        //if (!sgp30) {
        if (si1151.init()) {
            return "Yes";
        }
        return "No";
    }

    /**
    * get halfword sunlight
    * 
    */
    //% group="SunlightSensor 101020089"
    //% block="gib UV index [ ]"
    //% subcategory="Optische Sensoren"
    export function getHalfWordUV(): number {
        return si1151.ReadHalfWord_UV();
    }

    /**
    * get halfword sunlight
    * 
    */
    //% group="SunlightSensor 101020089"
    //% block="gib sichtbares Licht [lm]"
    //% subcategory="Optische Sensoren"
    export function getHalfWord_Visible(): number {
        return si1151.ReadHalfWord_VISIBLE();
    }

    /**
    * get halfword sunlight
    * 
    */
    //% group="SunlightSensor 101020089"
    //% block="gib IR [lm]"
    //% subcategory="Optische Sensoren"
    export function getHalfWordXXX(): number {
        return si1151.ReadHalfWord();
    }

    /**
    * init HW-837 UV module
    *
    **/
    //% group="HW-837 UV-Sensor"
    //% block="gib UV index [ ] HW-837 |%pin"
    //% subcategory="Optische Sensoren"
    export function hw837_getUV(pin: AnalogPin): number {

        let RangeInAnalog = 0;
        let sensorVoltage = 0;
        let uvIndex = 0;

        RangeInAnalog = pins.analogReadPin(pin);
        sensorVoltage = RangeInAnalog / 1024 * 3.3;
        uvIndex = Math.round(sensorVoltage / 0.1 *1000)/1000;

        basic.pause(50);
        return uvIndex;
    }
}