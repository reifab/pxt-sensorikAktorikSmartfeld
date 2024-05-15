/**
 * SEN0322 Custom Block
 */
namespace smartfeldSensoren {

    export class SEN0322 {
        private static readonly SEN0322_ADDRESS = 0x70;         //i2c slave address, 4 addresses are possible
        private static readonly OXYGEN_DATA_REGISTER = 0x03;    //register for oxygen data
        private static readonly USER_SET_REGISTER = 0x08;       //register for users to configure key value manually
        private static readonly AUTO_SET_REGISTER = 0x09;       //register that automatically configure key value
        private static readonly GET_KEY_REGISTER = 0x0A;        //register for obtaining key value

        private address: number;
        private key: number;


        /**
        * Writes data to the specified register via I2C.
        *
        * @param {number} register - The register address to write to.
        * @param {number} value - The value to write to the register.
        */
        private i2cWrite(register: number, value: number) {
            let _registerBuffer = pins.createBuffer(2);
            _registerBuffer[0] = register;
            _registerBuffer[1] = value;

            pins.i2cWriteBuffer(this.address, _registerBuffer, false);
        }

        /**
        * Reads the key value from the sensor.
        */
        private readKey() {
            let value: number = 0;
            pins.i2cWriteNumber(this.address, SEN0322.GET_KEY_REGISTER, NumberFormat.UInt8BE);
            basic.pause(50);
            value = pins.i2cReadNumber(this.address, NumberFormat.UInt8BE);
            if (value == 0) {
                this.key = 20.9 / 120.0;
            }
            else {
                this.key = value / 1000.0;
            }
        }

        /**
         * Calculates the average of numbers in an array.
         *
         * @param { number[] } bArray - The array of numbers.
         * @param { number } len - The length of the array.
         * @returns { number } - The average of the numbers in the array.
         */
        private getAverageNum(bArray: number[], len: number): number {
            const sum = bArray.reduce((a, b) => a + b, 0);
            return sum / len;
        }

        /**
        * Sets the I2C address of the sensor.
        *
        * @param {number} id - The ID of the sensor according to the dip switch, eg. A0 = 1 and A1 = 1 --> id = 3
        */
        setAddress(id: number) {
            if (id > 3) {
                id = 3;
            }

            if (id < 0) {
                id = 0
            }
            this.address = SEN0322.SEN0322_ADDRESS + id;
        }

        /**
        * Calibrate oxygen sensor
        *
        * @param {number} vol - The current concentration of oxygen in the air.
        * @param {number} mv - The value marked on the sensor, Do not use must be assigned to 0.
        *
        * Choose method 1 or method 2 to calibrate the oxygen sensor.
        * 1. Directly calibrate the oxygen sensor by adding two parameters to the sensor.
        * 2. Waiting for stable oxygen sensors for about 10 minutes,
        *    OXYGEN_CONECTRATION is the current concentration of oxygen in the air (20.9%mol except in special cases),
        *    If you not using the first calibration method, the OXYGEN MV must be 0.
        */
        calibrate(vol: number, mv: number) {
            let keyValue = vol * 10;
            if (Math.abs(mv) < 0.000001) {
                this.i2cWrite(SEN0322.USER_SET_REGISTER, keyValue)
            }
            else {
                keyValue = (vol / mv) * 1000;
                this.i2cWrite(SEN0322.AUTO_SET_REGISTER, keyValue)
            }
        }

        /**
        * Gets the average oxygen data from the sensor.
        *
        * @param {number} collectNum - The number of data points to collect.
        * @returns {number} - The average oxygen data.
        */
        getOxygenData(collectNum: number): number {
            let rxbuf = pins.createBuffer(3);
            let j = collectNum;
            rxbuf.fill(0);
            this.readKey();

            let oxygenData: number[] = [];

            if (collectNum > 0) {
                for (j = 0; j < collectNum; j++) {
                    pins.i2cWriteNumber(this.address, SEN0322.OXYGEN_DATA_REGISTER, NumberFormat.UInt8BE);
                    basic.pause(100);
                    rxbuf = pins.i2cReadBuffer(this.address, 3, false);
                    oxygenData.push(this.key * (rxbuf[0] + rxbuf[1] / 10.0 + rxbuf[2] / 100.0));
                }
                return this.getAverageNum(oxygenData, collectNum);
            } else {
                return -1.0;
            }
        }
    }
}