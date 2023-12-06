    /**
     * SCD30 block
     */

namespace smartfeldSensoren {

    export class SCD30 {

        temperature: number;
        humidity: number;
        co2: number;

        // Protokollbeschreibung des Sensors
        // https://www.sensirion.com/fileadmin/user_upload/customers/sensirion/Dokumente/9.5_CO2/Sensirion_CO2_Sensors_SCD30_Interface_Description.pdf

        //let data = pins.createBuffer(2)
        //data[0] = 0xBE
        //data[1] = 0xEF
        //hier muss die Dezimalzahl 146 rauskommen!
        //    CRC(0xBEEF) = 0x92
        //data[0] ist immer das höchste Byte!
        //console.log("::"+crc(data)+"-"+0x92)
        private crc(data: Buffer, offset: number = 0): number {
            let current_byte;
            let crc = pins.createBuffer(1)
            crc.setNumber(NumberFormat.UInt8LE, 0, 0xFF)
            let crc_bit;

            //calculates 8-Bit checksum with given polynomial 
            for (current_byte = offset; current_byte < offset + 2; ++current_byte) {
                crc.setNumber(NumberFormat.UInt8LE, 0, crc.getNumber(NumberFormat.UInt8LE, 0) ^ data.getNumber(NumberFormat.UInt8LE, current_byte))
                for (crc_bit = 8; crc_bit > 0; --crc_bit) {
                    if (crc.getNumber(NumberFormat.UInt8LE, 0) & 0x80)
                        crc.setNumber(NumberFormat.UInt8LE, 0, (crc.getNumber(NumberFormat.UInt8LE, 0) << 1) ^ 0x31)
                    else
                        crc.setNumber(NumberFormat.UInt8LE, 0, (crc.getNumber(NumberFormat.UInt8LE, 0) << 1))
                }
            }
            return crc.getNumber(NumberFormat.UInt8LE, 0);
        }


        /*control.inBackground(() => {
            enableContinuousMeasurement()
            while (true) {
                readMeasurement()
                basic.pause(2000)
            }
        })*/

        enableContinuousMeasurement(): void {
            let commandBuffer = pins.createBuffer(5)

            //command
            commandBuffer[0] = 0x00
            commandBuffer[1] = 0x10
            //pressure in mBar
            //200m = 987mBar = 0x03DB
            commandBuffer[2] = 0x03 //MSB 
            commandBuffer[3] = 0xDB //LSB
            commandBuffer[4] = this.crc(commandBuffer, 2)

            pins.i2cWriteBuffer(0x61, commandBuffer, false)
        }

        /**
         * Calibrates sensor to 400ppm
         */
        setCalibration400ppm(): void {
            let commandBuffer = pins.createBuffer(5)

            //command
            commandBuffer[0] = 0x52
            commandBuffer[1] = 0x04
            //pressure in mBar
            //200m = 987mBar = 0x03DB
            commandBuffer[2] = 0x01 //MSB 
            commandBuffer[3] = 0x90 //LSB
            commandBuffer[4] = this.crc(commandBuffer, 2)

            pins.i2cWriteBuffer(0x61, commandBuffer, false)
        }

        /**
         * read calibration reference value 
         * this should always return 400 which is the ideal calibration
         * value for outdoor calibration
         */
        getCalibrationRefValue(): number {
            let buf = pins.createBuffer(3)
            pins.i2cWriteNumber(0x61, 0x5204, NumberFormat.UInt16BE, false)
            basic.pause(10)
            buf = pins.i2cReadBuffer(0x61, 3, false)
            let res = (buf[0] << 8) + buf[1]
            return res
        }
        /**
         * read sensor version
         */
        getVersion(): string {
            let buf = pins.createBuffer(3)
            pins.i2cWriteNumber(0x61, 0xD100, NumberFormat.UInt16BE, false)
            basic.pause(10)
            buf = pins.i2cReadBuffer(0x61, 3, false)
            let res = "" + buf[0] + "." + buf[1]
            return res
        }

        private readReady(): boolean {
            let buf = pins.createBuffer(3)
            pins.i2cWriteNumber(0x61, 0x0202, NumberFormat.UInt16BE, false)
            basic.pause(10)
            buf = pins.i2cReadBuffer(0x61, 3, false)
            let res = (buf[0] << 8) + buf[1]

            if (buf[1] == 1) {
                return true
            } else {
                return false
            }
        }

        readMeasurement(): void {
            while (this.readReady() == false) {
                basic.pause(10)
                //serial.writeLine("waiting in: readMeasurement()")
            }
            let buf = pins.createBuffer(18)
            let tbuf = pins.createBuffer(4)
            pins.i2cWriteNumber(0x61, 0x0300, NumberFormat.UInt16BE, false)
            basic.pause(10)
            buf = pins.i2cReadBuffer(0x61, 18, false)

            //co2
            tbuf.setNumber(NumberFormat.Int8LE, 0, buf.getNumber(NumberFormat.UInt8LE, 0))
            tbuf.setNumber(NumberFormat.Int8LE, 1, buf.getNumber(NumberFormat.UInt8LE, 1))
            tbuf.setNumber(NumberFormat.Int8LE, 3, buf.getNumber(NumberFormat.UInt8LE, 3))
            tbuf.setNumber(NumberFormat.Int8LE, 4, buf.getNumber(NumberFormat.UInt8LE, 4))
            this.co2 = tbuf.getNumber(NumberFormat.Float32BE, 0)
            this.co2 = Math.round(this.co2 * 100) / 100

            //temperature
            tbuf.setNumber(NumberFormat.Int8LE, 0, buf.getNumber(NumberFormat.UInt8LE, 6))
            tbuf.setNumber(NumberFormat.Int8LE, 1, buf.getNumber(NumberFormat.UInt8LE, 7))
            tbuf.setNumber(NumberFormat.Int8LE, 3, buf.getNumber(NumberFormat.UInt8LE, 9))
            tbuf.setNumber(NumberFormat.Int8LE, 4, buf.getNumber(NumberFormat.UInt8LE, 10))
            this.temperature = tbuf.getNumber(NumberFormat.Float32BE, 0)
            this.temperature = Math.round(this.temperature * 100) / 100

            //humidity
            tbuf.setNumber(NumberFormat.Int8LE, 0, buf.getNumber(NumberFormat.UInt8LE, 12))
            tbuf.setNumber(NumberFormat.Int8LE, 1, buf.getNumber(NumberFormat.UInt8LE, 13))
            tbuf.setNumber(NumberFormat.Int8LE, 3, buf.getNumber(NumberFormat.UInt8LE, 15))
            tbuf.setNumber(NumberFormat.Int8LE, 4, buf.getNumber(NumberFormat.UInt8LE, 16))
            this.humidity = tbuf.getNumber(NumberFormat.Float32BE, 0)
            this.humidity = Math.round(this.humidity * 100) / 100
        }

        /**
         * Reads CO2
         */
        readCO2(): number {
            return this.co2
        }

        /**
         * Reads Temperature
         */
        readTemperature(): number {
            return this.temperature
        }

        /**
         * Reads Humidity
         */
        readHumidity(): number {
            return this.humidity
        }
    }
}
