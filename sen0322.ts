/**
 * SEN0322 Custom Block
 */

const SEN0322_ADDRESS = 0x70;
const OXYGEN_DATA_REGISTER = 0x03;
const USER_SET_REGISTER = 0x08;
const AUTUAL_SET_REGISTER = 0x09;
const GET_KEY_REGISTER = 0x0A;

namespace smartfeldSensoren {
    export class SEN0322 {
        private address: bigint;
        private key: number;

        private function i2cWrite(register: number, value: number) {
            let _registerBuffer = pins.createBuffer(2);
            _registerBuffer[0] = register;
            _registerBuffer[1] = value;
            pins.i2cWriteBuffer(this.address, _registerBuffer, false);
        }

        private function readFlash() {
            let value: number = 0;
            pins.i2cWriteNumber(this.address, GET_KEY_REGISTER, NumberFormat.UInt8BE);
            basic.pause(50);
            value = pins.i2cReadBuffer(this.address, 1, false);
            if (value == 0) {
                this.key = 20.9 / 120.0;
            }
            else {
                this.key = value / 1000.0;
            }
        }

        private function getAverageNum(bArray: number[], len: number): number {
            let i = 0;
            let bTemp = 0;
            for (i = 0; i < len; i++) {
                bTemp += bArray[i];
            }
            return bTemp / len;
        }

        function setAddress(id: bigint) {
            this.address = this.SEN0322_ADDRESS + id;
        }
    
        function calibrate(vol: number, mv: number) {
            let keyValue = vol * 10;
            if (mv < 0.000001 && mv > -0.000001) {
                this.i2cWrite(USER_SET_REGISTER, keyValue)
            }
            else {
                keyValue = (vol / mv) * 1000;
                this.i2cWrite(AUTUAL_SET_REGISTER, keyValue)
            }
        }
        
        function getOxygenData(collectNum: number): number {
            let rxbuf = pins.createBuffer(3);
            let j = 0;
            rxbuf.fill(0);
            this.readFlash();
            let oxygenData: Array<number>(collectNum);
            oxygenData.fill(0.0);
            if (collectNum > 0) {
                for (j = collectNum - 1; j > 0; j--) {
                    pins.i2cWriteNumber(this.address, OXYGEN_DATA_REGISTER, NumberFormat.UInt8BE);
                    basic.pause(100);
                    rxbuf = pins.i2cReadBuffer(this.address, 3, false);
                    oxygenData[j] = this.key * (rxbuf[0] + rxbuf[1] / 10.0 + rxbuf[2] / 100.0);
                }
                return this.getAverageNum(oxygenData, collectNum);
            }
            else {
                return -1.0;
            }
        }
    }
}