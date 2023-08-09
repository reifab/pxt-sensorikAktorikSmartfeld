/**
 * Grove 4-digit display
 */

let TubeTab: number[] = [
    0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07,
    0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71
];

namespace smartfeldAktoren {

    export class FourDigitDisplay {

        clkPin: DigitalPin;
        dataPin: DigitalPin;
        brightnessLevel: number;
        pointFlag: boolean;
        buf: Buffer;

        private writeByte(wrData: number) {
            for (let i = 0; i < 8; i++) {
                pins.digitalWritePin(this.clkPin, 0);
                if (wrData & 0x01) pins.digitalWritePin(this.dataPin, 1);
                else pins.digitalWritePin(this.dataPin, 0);
                wrData >>= 1;
                pins.digitalWritePin(this.clkPin, 1);
            }

            pins.digitalWritePin(this.clkPin, 0); // Wait for ACK
            pins.digitalWritePin(this.dataPin, 1);
            pins.digitalWritePin(this.clkPin, 1);
        }

        private start() {
            pins.digitalWritePin(this.clkPin, 1);
            pins.digitalWritePin(this.dataPin, 1);
            pins.digitalWritePin(this.dataPin, 0);
            pins.digitalWritePin(this.clkPin, 0);
        }

        private stop() {
            pins.digitalWritePin(this.clkPin, 0);
            pins.digitalWritePin(this.dataPin, 0);
            pins.digitalWritePin(this.clkPin, 1);
            pins.digitalWritePin(this.dataPin, 1);
        }

        private coding(dispData: number): number {
            let pointData = 0;

            if (this.pointFlag == true) pointData = 0x80;
            else if (this.pointFlag == false) pointData = 0;

            if (dispData == 0x7f) dispData = 0x00 + pointData;
            else dispData = TubeTab[dispData] + pointData;

            return dispData;
        }

        createDisplay(clkPin: DigitalPin, dataPin: DigitalPin): FourDigitDisplay {

            let fourDigitDisplay = new FourDigitDisplay();
            fourDigitDisplay.buf = pins.createBuffer(4);
            fourDigitDisplay.clkPin = clkPin;
            fourDigitDisplay.dataPin = dataPin;
            fourDigitDisplay.brightnessLevel = 0;
            fourDigitDisplay.pointFlag = false;
            fourDigitDisplay.clear();

            return fourDigitDisplay;
    }

        /**
         * Show a 4 digits number on display
         * @param dispData value of number
         */

        //% subcategory="Display" weight=35 
        //% group="4-Digit Display 104030003"
        //% blockId=grove_tm1637_display_number block="%tm1637| zeige Nummer|%dispData"
        //% clkPin.fieldEditor="gridpicker" clkPin.fieldOptions.columns=4
        //% clkPin.fieldOptions.tooltips="false" clkPin.fieldOptions.width="250"
        //% dataPin.fieldEditor="gridpicker" dataPin.fieldOptions.columns=4
        //% dataPin.fieldOptions.tooltips="false" dataPin.fieldOptions.width="250"
        //% tm1637.defl=myDigit
        show(dispData: number) {
            let compare_01: number = dispData % 100;
            let compare_001: number = dispData % 1000;

            if (dispData < 10) {
                this.bit(dispData, 3);
                this.bit(0x7f, 2);
                this.bit(0x7f, 1);
                this.bit(0x7f, 0);
            }
            else if (dispData < 100) {
                this.bit(dispData % 10, 3);
                if (dispData > 90) {
                    this.bit(9, 2);
                } else {
                    this.bit(Math.floor(dispData / 10) % 10, 2);
                }

                this.bit(0x7f, 1);
                this.bit(0x7f, 0);
            }
            else if (dispData < 1000) {
                this.bit(dispData % 10, 3);
                if (compare_01 > 90) {
                    this.bit(9, 2);
                } else {
                    this.bit(Math.floor(dispData / 10) % 10, 2);
                }
                if (compare_001 > 900) {
                    this.bit(9, 1);
                } else {
                    this.bit(Math.floor(dispData / 100) % 10, 1);
                }
                this.bit(0x7f, 0);
            }
            else if (dispData < 10000) {
                this.bit(dispData % 10, 3);
                if (compare_01 > 90) {
                    this.bit(9, 2);
                } else {
                    this.bit(Math.floor(dispData / 10) % 10, 2);
                }
                if (compare_001 > 900) {
                    this.bit(9, 1);
                } else {
                    this.bit(Math.floor(dispData / 100) % 10, 1);
                }
                if (dispData > 9000) {
                    this.bit(9, 0);
                } else {
                    this.bit(Math.floor(dispData / 1000) % 10, 0);
                }
            }
            else {
                this.bit(9, 3);
                this.bit(9, 2);
                this.bit(9, 1);
                this.bit(9, 0);
            }
        }

        /**
         * Set the brightness level of display at from 0 to 7
         * @param level value of brightness light level
         */

        //% subcategory="Display" weight=34 
        //% group="4-Digit Display 104030003"
        //% blockId=grove_tm1637_set_display_level block="%tm1637|Helligkeit auf Level|%level"
        //% level.min=0 level.max=7
        //% tm1637.defl=myDigit
        set(level: number) {
            this.brightnessLevel = level;

            this.bit(this.buf[0], 0x00);
            this.bit(this.buf[1], 0x01);
            this.bit(this.buf[2], 0x02);
            this.bit(this.buf[3], 0x03);
        }

        /**
         * Show a single number from 0 to 9 at a specified digit of Grove - 4-Digit Display
         * @param dispData value of number
         * @param bitAddr value of bit number
         */

        //% subcategory="Display" weight=33
        //% group="4-Digit Display 104030003"
        //% blockId=grove_tm1637_display_bit block="%tm1637|Zeige Ziffer|%dispData|an Stelle|%bitAddr"
        //% dispData.min=0 dispData.max=9
        //% bitAddr.min=0 bitAddr.max=3
        //% tm1637.defl=myDigit
 
        bit(dispData: number, bitAddr: number) {
            if ((dispData == 0x7f) || ((dispData <= 9) && (bitAddr <= 3))) {
                let segData = 0;

                segData = this.coding(dispData);
                this.start();
                this.writeByte(0x44);
                this.stop();
                this.start();
                this.writeByte(bitAddr | 0xc0);
                this.writeByte(segData);
                this.stop();
                this.start();
                this.writeByte(0x88 + this.brightnessLevel);
                this.stop();

                this.buf[bitAddr] = dispData;
            }
        }

        /**
         * Turn on or off the colon point on Grove - 4-Digit Display
         * @param pointEn value of point switch
         */

        //% subcategory="Display" weight=32
        //% group="4-Digit Display 104030003"
        //% blockId=grove_tm1637_display_point block="%tm1637|Zeige Doppelpunkt |%point|"
        //% tm1637.defl=myDigit

        point(point: boolean) {
            this.pointFlag = point;

            this.bit(this.buf[0], 0x00);
            this.bit(this.buf[1], 0x01);
            this.bit(this.buf[2], 0x02);
            this.bit(this.buf[3], 0x03);
        }

        /**
         * Clear the display
         */
        //% subcategory="Display" weight=31
        //% group="4-Digit Display 104030003"
        //% blockId=grove_tm1637_display_clear block="%tm1637|Lösche Displayinhalt"
        //% tm1637.defl=myDigit
        clear() {
            this.bit(0x7f, 0x00);
            this.bit(0x7f, 0x01);
            this.bit(0x7f, 0x02);
            this.bit(0x7f, 0x03);
        }
    }
}
