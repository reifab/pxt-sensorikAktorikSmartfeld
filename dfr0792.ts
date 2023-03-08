
let adcResolution = 10;   //ADC resoltuion
let maxValue = 2 ** adcResolution;  //Resolution corresponding value
let precision = 10;   //Admissible error 

let resValue = [0, 3, 6.2, 9.1, 15, 24, 33, 51, 100, 220];  //Resistor resistance 


namespace smartfeldSensoren {

    export class DFR0792 {

        adcKeyVal: Buffer;
        analogPin: AnalogPin;

        init(pin: AnalogPin): DFR0792 {
            
            //music.playTone(Note.C, music.beat(BeatFraction.Whole))
            let dfr0792 = new DFR0792();
            dfr0792.analogPin = pin;


            return dfr0792;
        }

        getPushedNumber(): number {

            this.adcKeyVal = pins.createBuffer(10);
            let j;
            for (j = 0; j < 10; j++) {
                this.adcKeyVal[j] = resValue[j] / (resValue[j] + 22) * maxValue;
            }

            let adcKeyIn = 0;
            adcKeyIn = pins.analogReadPin(this.analogPin);
            serial.writeValue("x", this.adcKeyVal[1])
            //serial.writeValue("x", this.adcKeyVal[1])
            if (adcKeyIn < (maxValue - precision))
            {
                let i;
                for (i = 0; i < 10; i++) {
                    if (adcKeyIn > this.adcKeyVal[i]) {
                        if ((adcKeyIn - this.adcKeyVal[i]) < precision) {
                            return i;
                        }
                    } else {
                        if ((this.adcKeyVal[i] - adcKeyIn) < precision) {
                            return i;
                        }
                    }
                }
                return -1;
            }
            else
            {
                return -2;
            }
        }
    }
}