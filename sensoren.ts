// Gib deinen Code hier ein
/**
 * Organize your blocks in groups
 */

//% color="#0fbc11" icon="\uf185"
namespace smartfeldSensoren {

    const gestureEventId = 3100;
    let lastGesture = GroveGesture.None;
    let paj7620 = new PAJ7620();
    //let bme680 = new BME680();
    let sgp30 = new SGP30();
    let si1151 = new SI1151();
    let tcs34725 = new TCS34725();
    let mpr121 = new MPR121();

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

    //% group="Kraftsensor 101020553"
    //% block="messe Kraft |%pin"
    //% subcategory="Mechanische Sensoren" weight=50
    export function kraftsensorGibKraft(pin: AnalogPin): number {

        let RangeInAnalog = 0;

        RangeInAnalog = pins.analogReadPin(pin);

        basic.pause(50);
        return RangeInAnalog;
    }

    //% group="Mikroschalter 102020143"
    //% block="Taster betätigt |%pin"
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
    //% blockId=ggesture block="Gestik %key"
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
    export function initGas() {
        //if (!sgp30) {
        sgp30.init();
    }

    /**
    * Read tVOC value of gas sensor
    * 
    */
    //% group="Gassensor 101020512"
    //% block="gib tVOC"
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
    //% block="gib CO2eq"
    //% subcategory="Umweltsensoren" weight=40
    export function measReadCO2eq(): number {
        //if (!sgp30) {
        return sgp30.sgp30_measRead_CO2eq();
    }

    //% group="Potentiometer 101020036"
    //% block="Poti Prozentzahl Pin |%pin LED |%led"
    //% pin.defl=AnalogPin.P2 led.defl=AnalogPin.P16
    //% subcategory="Mechanische Sensoren"
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
    //% group="Sonnenlicht Sensor 101020089"
    //% block="init Sonnenlicht Sensor"
    //% subcategory="Optische Sensoren"
    export function initSunlight() {
        //if (!sgp30) {
        si1151.init();
    }

    /**
    * get halfword sunlight
    * 
    */
    //% group="Sonnenlicht Sensor 101020089"
    //% block="gib sichtbares Licht [lm]"
    //% subcategory="Optische Sensoren"
    export function getHalfWord_Visible(): number {
        return Math.round(si1151.ReadHalfWord_VISIBLE());
    }

    /**
    * get halfword sunlight
    * 
    */
    //% group="Sonnenlicht Sensor 101020089"
    //% block="gib IR [lm]"
    //% subcategory="Optische Sensoren"
    export function getHalfWordIR(): number {
        return Math.round(si1151.ReadHalfWord_IR());
    }

    /**
    * start Grove Color sensor
    */
    //% group="Farbsensor 101020341"
    //% blockId="start_colorSensor" block="Start Sensor mit Integrationszeit %atime und Verstärkung %gain"
    //% subcategory="Optische Sensoren"
    export function start(atime: TCS34725_ATIME, gain: TCS34725_AGAIN) {
        tcs34725.start(atime, gain);
    }

    //% group="Farbsensor 101020341"
    //% blockId="getSensorData" block="Gib Farb Daten %colorId"
    //% subcategory="Optische Sensoren"
    export function getSensorData(colorId: RGB): number {
        return tcs34725.getSensorData(colorId);
    }

    /**
    * init HW-837 UV module
    *
    **/
    //% group="HW-837 UV-Sensor"
    //% block="gib UV index [] |%pin"
    //% subcategory="Optische Sensoren"
    export function hw837_getUV(pin: AnalogPin): number {

        let rangeInAnalog = 0;
        let sensorVoltage = 0;
        let uvIndex = 0;

        rangeInAnalog = pins.analogReadPin(pin);
        sensorVoltage = rangeInAnalog / 1024 * 3.3;
        uvIndex = Math.round(sensorVoltage / 0.1 *1000)/1000;

        basic.pause(50);
        return uvIndex;
    }

    //% group="Bodenfeuchtesensor 101020614"
    //% block="gib Bodenfeuchte Pin |%pin"
    //% pin.defl=AnalogPin.P0
    //% subcategory="Umweltsensoren"
    export function bodenfeuchteGibFeuchte(pin: AnalogPin): number {

        let moisture = 0;

        moisture = pins.analogReadPin(pin);

        basic.pause(50);
        return moisture;
    }

    //% group="Berührungssensor 101020872"
    //% blockId="mpr121_touch_is_touch_sensor_touched" block="%CH | wird berührt"
    //% subcategory="Mechanische Sensoren" weight=50
    export function isTouched(sensor: TouchSensor): boolean {
        return mpr121.isTouched(sensor);
    }


    //% group="Berührungssensor 101020872"
    //% blockId=mpr121_touch_on_touch_sensor_down
    //% block="wenn | %sensor | berührt"
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=3
    //% sensor.fieldOptions.tooltips="false"
    //% subcategory="Mechanische Sensoren" weight=65
    export function onTouchSensorTouched(sensor: TouchSensor, handler: () => void) {
        mpr121.onTouchSensorTouched(sensor, handler);
    }

    //% group="Berührungssensor 101020872"
    //% blockId=mpr121_touch_on_touch_sensor_released
    //% block="wenn | %sensor | losgelassen"
    //% subcategory="Mechanische Sensoren" weight=64
    export function onTouchSensorReleased(sensor: TouchSensor, handler: () => void){
        mpr121.onTouchSensorReleased(sensor, handler);
    }

    //% group="Berührungssensor 101020872"
    //% blockId=mpr121_touch_on_touched
    //% block="wenn beliebiger CH berührt"
    //% subcategory="Mechanische Sensoren" weight=60
    export function onAnyTouchSensorTouched(handler: () => void) {
        mpr121.onAnyTouchSensorTouched(handler);
    }

    //% group="Berührungssensor 101020872"
    //% blockId=mpr121_touch_on_released
    //% block="wenn beliebiger CH losgelassen"
    //% subcategory="Mechanische Sensoren" weight=59
    export function onAnyTouchSensorReleased(handler: () => void) {
        mpr121.onAnyTouchSensorReleased(handler);
    }

    //% group="Berührungssensor 101020872"
    //% blockId="mpr121_touch_current_touch_sensor
    //% block="zuletzt berührter CH"
    //% subcategory="Mechanische Sensoren" weight=50
    export function touchSensor(): number {
        return mpr121.touchSensor();
    }
}