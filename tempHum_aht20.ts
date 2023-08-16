/**
 * Grove AHT20 Custom Block
 */

namespace smartfeldSensoren {

    export class AHT20 {

        address: number;
       
        private initialization() {
            const buf = pins.createBuffer(3);
            buf[0] = 0xbe;
            buf[1] = 0x08;
            buf[2] = 0x00;
            pins.i2cWriteBuffer(0x38, buf, false);
            basic.pause(10);
        }

        private triggerMeasurement() {
            const buf = pins.createBuffer(3);
            buf[0] = 0xac;
            buf[1] = 0x33;
            buf[2] = 0x00;
            pins.i2cWriteBuffer(0x38, buf, false);
            basic.pause(80);
        }

        private getState(): { isBusy: boolean, calib: boolean } {
            const buf = pins.i2cReadBuffer(0x38, 1, false);
            const busy = buf[0] & 0x80 ? true : false;
            const calibrated = buf[0] & 0x08 ? true : false;

            return { isBusy: busy, calib: calibrated };
        }

        private read(): { Hum: number, Temp: number } {
            const buf = pins.i2cReadBuffer(0x38, 7, false);

            const crc8 = AHT20.calcCRC8(buf, 0, 6);
            if (buf[6] != crc8) return null;

            const humidity = ((buf[1] << 12) + (buf[2] << 4) + (buf[3] >> 4)) * 100 / 1048576;
            const temperature = (((buf[3] & 0x0f) << 16) + (buf[4] << 8) + buf[5]) * 200 / 1048576 - 50;

            return { Hum: humidity, Temp: temperature };
        }

        private static calcCRC8(buf: Buffer, offset: number, size: number): number {
            let crc8 = 0xff;
            for (let i = 0; i < size; ++i) {
                crc8 ^= buf[offset + i];
                for (let j = 0; j < 8; ++j) {
                    if (crc8 & 0x80) {
                        crc8 <<= 1;
                        crc8 ^= 0x31;
                    }
                    else {
                        crc8 <<= 1;
                    }
                    crc8 &= 0xff;
                }
            }
            return crc8;
        }
    
        private readTempHum(): { Hum: number, Temp: number } {
            
            if (!this.getState().calib) {
                this.initialization();
                if (!this.getState().calib) return null;
            }

            this.triggerMeasurement();
            for (let i = 0; ; ++i) {
                if (!this.getState().isBusy) break;
                if (i >= 500) return null;
                basic.pause(10);
            }

            return this.read();
        }

        /**
         * Read the temperature(°C) from Grove-AHT20(SKU#101990644)
         */

        aht20ReadTemperatureC(): number {


            //const aht20 = new grove.sensors.AHT20();
            const val = this.readTempHum();
            if (val == null) return null;

            return val.Temp;
        }

        aht20ReadHumidity(): number {
            //const aht20 = new grove.sensors.AHT20();
            const val = this.readTempHum();
            if (val == null) return null;

            return val.Hum;
        }
    }
}
