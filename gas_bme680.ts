/**
 * makecode BME680 digital pressure and humidity sensor Package.
 * From microbit/micropython Chinese community.
 * http://www.micropython.org.cn
 */

enum BME680_I2C_ADDRESS {
    //% block="0x76"
    ADDR_0x76 = 0x76,
    //% block="0x77"
    ADDR_0x77 = 0x77
}

enum BME680_T {
    //% block="C"
    T_C = 0,
    //% block="F"
    T_F = 1
}

enum BME680_P {
    //% block="Pa"
    Pa = 0,
    //% block="hPa"
    hPa = 1
}


let BME680_I2C_ADDR = BME680_I2C_ADDRESS.ADDR_0x76

let par_t1 = 0;
let par_t2 = 0;
let par_t3 = 0;

let par_p1 = 0;
let par_p2 = 0;
let par_p3 = 0;
let par_p4 = 0;
let par_p5 = 0;
let par_p6 = 0;
let par_p7 = 0;
let par_p8 = 0;
let par_p9 = 0;
let par_p10 = 0;

let par_h1 = 0;
let par_h2 = 0;
let par_h3 = 0;
let par_h4 = 0;
let par_h5 = 0;
let par_h6 = 0;
let par_h7 = 0;

let par_g1 = 0;
let par_g2 = 0;
let par_g3 = 0;

let res_heat_range = 0;
let res_heat_val = 0;
let range_switching_error = 0; //range_sw_er

let amb_temp = 25;

let T = 0
let P = 0
let H = 0
let H1 = 0
let R = 0
let IAQ = 0

let BME68X_VARIANT_GAS_LOW = 0;
let BME68X_VARIANT_GAS_HIGH = 1;
let gas_variant_id = BME68X_VARIANT_GAS_LOW;

let flagGasMeasOn = 0;

/**
 * BME680 class
 */
namespace sensoren {

    export class BME680 {
        private bme680Setreg(reg: number, dat: number): void {
            let buf = pins.createBuffer(2);
            buf[0] = reg;
            buf[1] = dat;
            pins.i2cWriteBuffer(BME680_I2C_ADDR, buf);
        }

        private bme680Getreg(reg: number): number {
            pins.i2cWriteNumber(BME680_I2C_ADDR, reg, NumberFormat.UInt8BE);
            return pins.i2cReadNumber(BME680_I2C_ADDR, NumberFormat.UInt8BE);
        }

        private bme680GetInt8LE(reg: number): number {
            pins.i2cWriteNumber(BME680_I2C_ADDR, reg, NumberFormat.UInt8BE);
            return pins.i2cReadNumber(BME680_I2C_ADDR, NumberFormat.Int8LE);
        }

        private bme680GetUInt16LE(reg: number): number {
            pins.i2cWriteNumber(BME680_I2C_ADDR, reg, NumberFormat.UInt8BE);
            return pins.i2cReadNumber(BME680_I2C_ADDR, NumberFormat.UInt16LE);
        }

        private bme680GetInt16LE(reg: number): number {
            pins.i2cWriteNumber(BME680_I2C_ADDR, reg, NumberFormat.UInt8BE);
            return pins.i2cReadNumber(BME680_I2C_ADDR, NumberFormat.Int16LE);
        }

        /**
         * power on
         */
        //% blockId="BME680_POWER_ON" block="Power On"
        //% weight=22 blockGap=8
        private PowerOn() {
            this.bme680Setreg(0x74, 0x2F)
        }

        /**
         * power off
         */
        //% blockId="BME680_POWER_OFF" block="Power Off"
        //% weight=21 blockGap=8
        private PowerOff() {
            this.bme680Setreg(0x74, 0)
        }

        /**
        * measure all parameters except gas
        */
        private measureTempHumPress() {


            let eas_status_0 = this.bme680Getreg(0x1D)
            let new_data_0 = eas_status_0 >> 7;              // get new_data_0 bit
            //let measuring = (eas_status_0 & 0x20) >> 5;      //check measuring bit
            //let gas_measuring = (eas_status_0 & 0x40) >> 6; //check gas_measuring bit

            if (0 == new_data_0) //only measure when no new data has to be checked
            {

                let register = this.bme680Getreg(0x71);
                register = register & ~(1 << 4)            //all bits bitwise and 1 except run_gas bitwise
                this.bme680Setreg(0x71, register)          //disable gas measurement
                this.bme680Setreg(0x74, 0x55)              //rewrite oversampling, start one measurement
            }

        }
        /**
        * measure all parameters gas
        */
        private measureTempHumPressGas() {

            let register = this.bme680Getreg(0x71);
            register = register | (1 << 4)              //all bits bitwise 1 except run_gas bit
            register = register & 0xF0                  //set last 4 bits (nb_conv<3:0>) to zero to select previous heater settings
            this.bme680Setreg(0x71, register)           //enable gas measurement

            /*let test0 = this.bme680Getreg(0x70);
            let test1 = this.bme680Getreg(0x71);

            serial.writeString("MyTest0 bit 3 must be 0:  ");
            serial.writeNumber(test0);
            serial.writeString("\n");

            serial.writeString("MyTest1 bit 4 must be 1: ");
            serial.writeNumber(test1);
            serial.writeString("\n");*/

            let eas_status_0 = this.bme680Getreg(0x1D)
            let new_data_0 = eas_status_0 >> 7;              // get new_data_0 bit
            let measuring = (eas_status_0 & 0x20) >> 5;      //check measuring bit
            let gas_measuring = (eas_status_0 & 0x40) >> 6; //check gas_measuring bit

            if(0 == new_data_0) //only measure when no new data has to be checked
            {

                /*serial.writeString("eas_status_0 before ");
                serial.writeNumber(eas_status_0);
                serial.writeString("\n"); //check gas_measuring bit

                serial.writeString("new_data_0 before ");
                serial.writeNumber(new_data_0);
                serial.writeString("\n"); //check gas_measuring bit

                serial.writeString("measuring before ");
                serial.writeNumber(measuring);
                serial.writeString("\n");

                serial.writeString("gas_measuring before ");
                serial.writeNumber(gas_measuring);
                serial.writeString("\n");*/

                /*let check_heaterOnTime = this.bme680Getreg(0x64)
                let check_heaterTemp = this.bme680Getreg(0x5A)

                serial.writeString("check_heaterOnTime right before ");
                serial.writeNumber(check_heaterOnTime);
                serial.writeString("\n");

                serial.writeString("check_heaterTemp right before ");
                serial.writeNumber(check_heaterTemp);
                serial.writeString("\n");*/


                this.bme680Setreg(0x74, 0x55)              //rewrite oversampling, start one measurement

                eas_status_0 = this.bme680Getreg(0x1D)
                new_data_0 = eas_status_0 >> 7;              // get new_data_0 bit
                measuring = (eas_status_0 & 0x20) >> 5;      //check measuring bit
                gas_measuring = (eas_status_0 & 0x40)  >> 6; //check gas_measuring bit

                /*serial.writeString("eas_status_0 right after ");
                serial.writeNumber(eas_status_0);
                serial.writeString("\n"); //check gas_measuring bit

                serial.writeString("new_data_0 right after ");
                serial.writeNumber(new_data_0);
                serial.writeString("\n"); //check gas_measuring bit

                serial.writeString("measuring right after ");
                serial.writeNumber(measuring);
                serial.writeString("\n");

                serial.writeString("gas_measuring right after ");
                serial.writeNumber(gas_measuring);
                serial.writeString("\n");*/
                
                //while(gas_measuring == 1)
                //let time1 = input.runningTimeMicros();
                while (gas_measuring == 0)
                {
                    eas_status_0 = this.bme680Getreg(0x1D)
                    gas_measuring = (eas_status_0 & 0x40) >> 6; //check gas_measuring bit
                    //serial.writeString("while0");
                }

                //let time2 = input.runningTimeMicros();
                while (gas_measuring == 1)
                {
                    eas_status_0 = this.bme680Getreg(0x1D)
                    gas_measuring = (eas_status_0 & 0x40) >> 6; //check gas_measuring bit
                    //serial.writeString("while1");
                }

                /*let time3 = input.runningTimeMicros();

                let deltaTillGasMeasuringIs1 = time2-time1;

                serial.writeString("deltaTillGasMeasuringIs1 ");
                serial.writeNumber(deltaTillGasMeasuringIs1);
                serial.writeString("\n");


                let deltaTillGasMeasuringIs0 = time3 - time2;

                serial.writeString("deltaTillGasMeasuringIs0 ");
                serial.writeNumber(deltaTillGasMeasuringIs0);
                serial.writeString("\n");


                serial.writeString("eas_status_0 after while ");
                serial.writeNumber(eas_status_0);
                serial.writeString("\n"); //check gas_measuring bit

                serial.writeString("new_data_0 after while ");
                serial.writeNumber(new_data_0);
                serial.writeString("\n"); //check gas_measuring bit

                serial.writeString("measuring after while ");
                serial.writeNumber(measuring);
                serial.writeString("\n");

                serial.writeString("gas_measuring after while ");
                serial.writeNumber(gas_measuring);
                serial.writeString("\n");*/
            }


        }

        /* This internal API is used to calculate the gas resistance value in float */
        private calc_gas_resistance_high(gas_res_adc: number, gas_range: number) {
            let calc_gas_res;
            let var1 = 262144 >> gas_range;
            let var2 = gas_res_adc - 512;

            var2 *= 3;
            var2 = 4096 + var2;

            calc_gas_res = 1000000.0 * var1 / var2;

            return calc_gas_res;
        }

        /* This internal API is used to calculate the gas resistance low value in float */
        //% block="Gas Widerstand tief"
        //% weight=60 blockGap=8
        private calc_gas_resistance_low(gas_res_adc: number, gas_range: number): number {
            let calc_gas_res;
            let var1;
            let var2;
            let var3;
            let gas_res_f = gas_res_adc;
            let gas_range_f = (1 << gas_range); /*lint !e790 / Suspicious truncation, integral to float */
            //const let lookup_k1_range[16] = {
            const lookup_k1_range = [0.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, -0.8, 0.0, 0.0, -0.2, -0.5, 0.0, -1.0, 0.0, 0.0]
            const lookup_k2_range = [0.0, 0.0, 0.0, 0.0, 0.1, 0.7, 0.0, -0.8, -0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

            var1 = (1340.0 + (5.0 * range_switching_error));
            var2 = (var1) * (1.0 + lookup_k1_range[gas_range] / 100.0);
            var3 = 1.0 + (lookup_k2_range[gas_range] / 100.0);
            calc_gas_res = 1.0 / (var3 * (0.000000125) * gas_range_f * (((gas_res_f - 512.0) / var2) + 1.0));

           /* serial.writeString("XXgas_res_adc ");
            serial.writeNumber(gas_res_adc);
            serial.writeString("\n");
            serial.writeString("XXgas_range ");
            serial.writeNumber(gas_range);
            serial.writeString("\n");
            serial.writeString("XXvar1 ");
            serial.writeNumber(var1);
            serial.writeString("\n");
            serial.writeString("XXvar2 ");
            serial.writeNumber(var2);
            serial.writeString("\n");
            serial.writeString("XXvar3 ");
            serial.writeNumber(var3);
            serial.writeString("\n");
            serial.writeString("XXcalc_gas_res ");
            serial.writeNumber(calc_gas_res);
            serial.writeString("\n");*/

            return calc_gas_res;
        }

        /* This internal API is used to calculate the heater resistance value */
        private calc_res_heat(temp: number): number {
            let var1;
            let var2;
            let var3;
            let var4;
            let var5;
            let res_heat;

            if (temp > 400) /* Cap temperature */ {
                temp = 400;
            }

            var1 = ((par_g1 / (16.0)) + 49.0);
            var2 = (((par_g2 / (32768.0)) * (0.0005)) + 0.00235);
            var3 = (par_g3 / (1024.0));
            var4 = (var1 * (1.0 + (var2 * temp)));
            var5 = (var4 + (var3 * amb_temp));
            res_heat = (3.4 * ((var5 * (4 / (4 + res_heat_range)) *
                (1 / (1 + (res_heat_val * 0.002)))) - 25));

            res_heat = format.formatConverter(res_heat, NumberFormat.UInt8LE)

           /* serial.writeString("par_g1 ");
            serial.writeNumber(par_g1);
            serial.writeString("\n");
            serial.writeString("par_g2 ");
            serial.writeNumber(par_g2);
            serial.writeString("\n");
            serial.writeString("par_g3 ");
            serial.writeNumber(par_g3);
            serial.writeString("\n");

            serial.writeString("var1 ");
            serial.writeNumber(var1);
            serial.writeString("\n");
            serial.writeString("var2 ");
            serial.writeNumber(var2);
            serial.writeString("\n");
            serial.writeString("var3 ");
            serial.writeNumber(var3);
            serial.writeString("\n");
            serial.writeString("var4 ");
            serial.writeNumber(var4);
            serial.writeString("\n");
            serial.writeString("var5 ");
            serial.writeNumber(var5);
            serial.writeString("\n");
            serial.writeString("res_heat ");
            serial.writeNumber(res_heat);
            serial.writeString("\n");*/

            return res_heat;
        }

        /* This internal API is used to calculate the gas wait */
        private calc_gas_wait(dur: number): number {
            let factor = 0;
            let durval;

            if (dur >= 0xfc0) {
                durval = 0xff; /* Max duration*/
            }
            else {
                while (dur > 0x3F) {
                    dur = dur / 4;
                    factor += 1;
                }

                durval = dur + (factor * 64);   //conv to int8_t
            }

            return durval;
        }

        private bme680Init() {
            this.PowerOn();
            par_t1 = this.bme680GetUInt16LE(0xE9)
            par_t2 = this.bme680GetInt16LE(0x8A)
            par_t3 = this.bme680Getreg(0x8C)

            par_p1 = this.bme680GetUInt16LE(0x8E)
            par_p2 = this.bme680GetInt16LE(0x90)
            par_p3 = this.bme680Getreg(0x92)
            par_p4 = this.bme680GetInt16LE(0x94)
            par_p5 = this.bme680GetInt16LE(0x96)
            par_p6 = this.bme680Getreg(0x99)
            par_p7 = this.bme680Getreg(0x98)
            par_p8 = this.bme680GetInt16LE(0x9C)
            par_p9 = this.bme680GetInt16LE(0x9E)
            par_p10 = this.bme680Getreg(0xA0)

            //let bla = bme680Getreg(0xE2)
            //let bla_lsb = bla >> 4;
            par_h1 = (this.bme680Getreg(0xE3) << 4) + (this.bme680Getreg(0xE2) & 0x0F)
            par_h2 = (this.bme680Getreg(0xE1) << 4) + (this.bme680Getreg(0xE2) >> 4)
            par_h3 = this.bme680Getreg(0xE4)
            par_h4 = this.bme680Getreg(0xE5)
            par_h5 = this.bme680Getreg(0xE6)
            par_h6 = this.bme680Getreg(0xE7)
            par_h7 = this.bme680Getreg(0xE8)

            /* Gas heater related coefficients */
            par_g1 = this.bme680GetInt8LE(0xED)
            //create in16_t by reading both registers as uint8_t and convert afterwards
            let temp = (this.bme680Getreg(0xEC) << 8) + this.bme680Getreg(0xEB)
            par_g2 = format.formatConverter(temp, NumberFormat.Int16LE)
            par_g3 = this.bme680GetInt8LE(0xEE)

            /* Other coefficients */
            res_heat_range = (this.bme680Getreg(0x02) & 0x30) >> 4;       //0x02 <5:4> 
            res_heat_val = this.bme680GetInt8LE(0x00)

           /* serial.writeString("res_heat_val ");
            serial.writeNumber(res_heat_val);
            serial.writeString("\n");
            serial.writeString("res_heat_range ");
            serial.writeNumber(res_heat_range);
            serial.writeString("\n");
            serial.writeString("range_switching_error ");
            serial.writeNumber(range_switching_error);
            serial.writeString("\n");*/

            this.bme680Setreg(0x72, 0x01)     //disable spi int, set humidity oversampling to 1x
            //this.bme680Setreg(0x74, 0x57)   //set temp oversampling to 2x and press oversampling to 16x and set auto mode
            //auto mode seems to exist even datasheet doesn't tells us
            this.bme680Setreg(0x74, 0x55)     //set temp oversampling to 2x and press oversampling to 16x and set forced mode
            this.bme680Setreg(0x75, 0x0C)     //disable 3-wire spi, set iir filter to coeff 7

            let register = this.bme680Getreg(0x70);
            register = register & ~(1 << 3) // bitwise and 1 to all except bit 3
            this.bme680Setreg(0x70, register);



            gas_variant_id = this.bme680Getreg(0xF0);
           /* serial.writeString("gas_variant_id ");
            serial.writeNumber(gas_variant_id);
            serial.writeString("\n");*/


        }


        /**
         * Create a new driver of Grove - Gesture
         */
        init() {
            this.bme680Init();
            basic.pause(200);
        }

        getTempHumPress(): number {

            /*let temp_adc = 498446;
            let par_t1 = 26354;
            let par_t2 = 26423;
            let par_t3 = 3;*/

            this.measureTempHumPress();

            let adc_T = (this.bme680Getreg(0x22) << 12) + (this.bme680Getreg(0x23) << 4) + (this.bme680Getreg(0x24) >> 4)

            let var1 = (adc_T >> 3) - (par_t1 << 1);
            let var2 = (var1 * par_t2) >> 11;
            let var3 = ((var1 >> 1) * (var1 >> 1)) >> 12;
            var3 = ((var3) * (par_t3 << 4)) >> 14;
            let t = (var2 + var3);
            //T = Math.idiv((t * 5 + 128) >> 8, 100) // int, ohne Nachkommastellen
            T = ((t * 5 + 128) >> 8) / 100 // 2 Nachkommastellen

            var1 = (t >> 1) - 64000
            var2 = (((var1 >> 2) * (var1 >> 2)) >> 11) * par_p6  //BASA evtl noch alles >>2
            var2 = var2 + ((var1 * par_p5) << 1)
            var2 = (var2 >> 2) + (par_p4 << 16)
            var1 = (((par_p3 * ((var1 >> 2) * (var1 >> 2)) >> 13) >> 3) + (((par_p2) * var1) >> 1)) >> 18
            var1 = ((32768 + var1) * par_p1) >> 15
            if (var1 == 0)
                return 404; // avoid exception caused by division by zero
            let adc_P = (this.bme680Getreg(0x1F) << 12) + (this.bme680Getreg(0x20) << 4) + (this.bme680Getreg(0x21) >> 4)
            let _p = ((1048576 - adc_P) - (var2 >> 12)) * 3125
            _p = Math.idiv(_p, var1) * 2;
            var1 = (par_p9 * (((_p >> 3) * (_p >> 3)) >> 13)) >> 12
            var2 = (((_p >> 2)) * par_p8) >> 13
            P = _p + ((var1 + var2 + par_p7) >> 4)


            let adc_H = (this.bme680Getreg(0x25) << 8) + this.bme680Getreg(0x26)

            let temp_scaled = ((t * 5) + 128) >> 8;
            var1 = (adc_H - ((par_h1 * 16))) -
                (((temp_scaled * par_h3) / (100)) >> 1);
            var2 =
                (par_h2 *
                    (((temp_scaled * par_h4) / (100)) +
                        (((temp_scaled * ((temp_scaled * par_h5) / (100))) >> 6) / (100)) +
                        (1 << 14))) >> 10;
            var3 = var1 * var2;
            let var4 = par_h6 << 7;
            var4 = ((var4) + ((temp_scaled * par_h7) / (100))) >> 4;
            let var5 = ((var3 >> 14) * (var3 >> 14)) >> 10;
            let var6 = (var4 * var5) >> 1;
            // H = Math.idiv((((var3 + var6) >> 10) * (1000)) >> 12, 1000); // int, ohne Nachkommastellen
            H = ((((var3 + var6) >> 10) * (1000)) >> 12) / 1000;           // 3 Nachkommastellen
            if (H > 100000) /* Cap at 100%rH */ {
                H = 100000;
            }
            else if (H < 0) {
                H = 0;
            }

            let temp_comp = ((t) / 5120);
            var1 = (adc_H) - ((par_h1 * 16) + ((par_h3 / 2) * temp_comp));
            var2 = var1 * (((par_h2 / 262144) * (1 + ((par_h4 / 16384) * temp_comp) + ((par_h5 / 1048576) * temp_comp * temp_comp))));
            var3 = par_h6 / 16384;
            var4 = par_h7 / 2097152;
            H1 = var2 + ((var3 + (var4 * temp_comp)) * var2 * var2)

            /*let adc_H = (bme680Getreg(0x25) << 8) + bme680Getreg(0x26)
            var1 = t - 76800
            var2 = (((adc_H << 14) - (par_h4 << 20) - (par_h5 * var1)) + 16384) >> 15
            var1 = var2 * (((((((var1 * par_h6) >> 10) * (((var1 * par_h3) >> 11) + 32768)) >> 10) + 2097152) * par_h2 + 8192) >> 14)
            var2 = var1 - (((((var1 >> 15) * (var1 >> 15)) >> 7) * par_h1) >> 4)
            if (var2 < 0) var2 = 0
            if (var2 > 419430400) var2 = 419430400
            H = (var2 >> 12) >> 10*/

            return 1
        }

        getGas(): number {

            flagGasMeasOn = 1;
            let res_heat_reg = this.calc_res_heat(200); //calc register value of 200 °C     
            
            //BASA: later, use calc_gas_wait, 0x59 is from datasheet
            this.bme680Setreg(0x64, 0x59);              //100ms heat up
            this.bme680Setreg(0x65, 0x59);              //100ms heat up
            this.bme680Setreg(0x66, 0x59);              //100ms heat up
            this.bme680Setreg(0x67, 0x59);              //100ms heat up
            this.bme680Setreg(0x68, 0x59);              //100ms heat up
            this.bme680Setreg(0x69, 0x59);              //100ms heat up
            this.bme680Setreg(0x6A, 0x59);              //100ms heat up
            this.bme680Setreg(0x6B, 0x59);              //100ms heat up
            this.bme680Setreg(0x6C, 0x59);              //100ms heat up
            this.bme680Setreg(0x6D, 0x59);              //100ms heat up
            this.bme680Setreg(0x5A, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x5B, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x5C, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x5D, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x5E, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x5F, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x60, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x61, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x62, res_heat_reg);      //set temperature to 200 °C
            this.bme680Setreg(0x63, res_heat_reg);      //set temperature to 200 °C


            this.measureTempHumPressGas();

            let adc_gas_res_low = (this.bme680Getreg(0x2A) << 2) + (this.bme680Getreg(0x2B) >> 6)
            let adc_gas_res_high = (this.bme680Getreg(0x2C) << 2) + (this.bme680Getreg(0x2D) >> 6)
            let gas_range_l = (this.bme680Getreg(0x2B) & 0x0F)
            let gas_range_h = (this.bme680Getreg(0x2D) & 0x0F)

            /*serial.writeString("IST adc_gas_res_low=");
            serial.writeNumber(adc_gas_res_low);
            serial.writeString("\n");

            serial.writeString("IST gas_range_l=");
            serial.writeNumber(gas_range_l);
            serial.writeString("\n");*/

            let temp = (this.bme680Getreg(0x04) & 0xF0) >> 4;
            range_switching_error = format.formatConverterINT4(temp);

            /*serial.writeString("range_switching_error nach Messung ");
            serial.writeNumber(range_switching_error);
            serial.writeString("\n");*/

            if (gas_variant_id == BME68X_VARIANT_GAS_HIGH)  //is normally BME68X_VARIANT_GAS_LOW, hardware defined
            {
                R = this.calc_gas_resistance_high(adc_gas_res_high, gas_range_h);
            }
            else {
                R = this.calc_gas_resistance_low(adc_gas_res_low, gas_range_l);
            }

            flagGasMeasOn = 0;

            return 1
        }
    }
}

