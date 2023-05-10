
let adcResolution = 10;   //ADC resoltuion
let maxValue = 2 ** adcResolution;  //Resolution corresponding value
let precision = 50;   //Admissible error 

let resValue = [0, 3, 6.2, 9.1, 15, 24, 33, 51, 100, 220];  //Resistor resistance 


namespace smartfeldSensoren {

    export class DFR0792 {

        adcKeyVal: Buffer;
        analogPin: AnalogPin;

        init(pin: AnalogPin): DFR0792 {
            
            let dfr0792 = new DFR0792();
            this.analogPin = pin;

            return dfr0792;
        }

        numberIsPushed(): boolean {
            let adcKeyIn = pins.analogReadPin(this.analogPin);
            if(adcKeyIn < (maxValue-precision)){
                return true;
            }
            else{
                return false;
            }
        }

        getPushedNumber(): number {
            this.adcKeyVal = pins.createBuffer(2*10);
            let j;
            for (j = 0; j < 10; j++) {
                this.adcKeyVal.setNumber(NumberFormat.UInt16LE, j*2, resValue[j] / (resValue[j] + 22) * maxValue)
            }

            let adcKeyIn = 0;
            adcKeyIn = pins.analogReadPin(this.analogPin);
            
            let i;
            for (i = 0; i < 10; i++) {
                if (adcKeyIn > this.adcKeyVal.getNumber(NumberFormat.UInt16LE, i*2)) {
                    if ((adcKeyIn - this.adcKeyVal.getNumber(NumberFormat.UInt16LE, i*2)) < precision) {
                        return i;
                    }
                } else {
                    if ((this.adcKeyVal.getNumber(NumberFormat.UInt16LE, i*2) - adcKeyIn) < precision) {
                        return i;
                    }
                }
            }
            return -1;
        }
    }
}