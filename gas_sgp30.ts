let SGP_I2C_ADR = 0x58;

interface Profile {
    duration_us: number;
    signals: Buffer;
    number_of_signals: number
    adr: number
    cmd: number
}

enum sgp_state_code {
    WAIT_STATE,
    MEASURING_PROFILE_STATE
};

/*
  interface sgp_info {
    serial_id: number
    feature_set_version: number
  }*/

/*interface client_data {
    current_state: sgp_state_code
    info: sgp_info
   //const struct sgp_otp_featureset * otp_features;
    word_buf: Buffer

  }*/

/* command and constants for reading the serial ID */
  let SGP_CMD_GET_SERIAL_ID_DURATION_US = 500;
  let SGP_CMD_GET_SERIAL_ID_WORDS = 3;
  let SGP_CMD_GET_SERIAL_ID_ADR = 0x36;
  let SGP_CMD_GET_SERIAL_ID_CMD = 0x82;

/* command and constants for reading the featureset version */
let SGP_CMD_GET_FEATURESET_DURATION_US = 1000;
let SGP_CMD_GET_FEATURESET_WORDS = 1;
let SGP_CMD_GET_FEATURESET_ADR = 0x20;
let SGP_CMD_GET_FEATURESET_CMD = 0x2f;

/* commands for measurement */
//let PROFILE_NUMBER_IAQ_MEASURE = 1;

function SGP_PROFILE_Serial_ID(): Profile {
    return {
        duration_us: 500,
        signals: null,
        number_of_signals: 9,
        adr: 0x36,
        cmd: 0x82,
    }
}

function SGP_PROFILE_SET_FEATURESET_VERSION(): Profile {
    return {
        duration_us: 1000,
        signals: null,
        number_of_signals: 3,
        adr: 0x20,
        cmd: 0x2f,
    }
}

function SGP_PROFILE_IAQ_INIT(): Profile {
    return {
        duration_us: 10000,
        signals: null,
        number_of_signals: 0,
        adr: 0x20,
        cmd: 0x03,
    }
}

function SGP_PROFILE_IAQ_MEASURE9(): Profile {
    return {
        duration_us: 50000,
        signals: null,
        number_of_signals: 6,
        adr: 0x20,
        cmd: 0x08,
    }
}

function SGP_PROFILE_IAQ_GET_BASELINE(): Profile {
    return {
        duration_us: 10000,
        signals: null,
        number_of_signals: 7,
        adr: 0x20,
        cmd: 0x15,
    }
}

function SGP_PROFILE_IAQ_SET_BASELINE(): Profile {
    return {
        duration_us: 1000,
        signals: null,
        number_of_signals: 0,
        adr: 0x20,
        cmd: 0x1e,
    }
}

function SGP_PROFILE_MEASURE_SIGNALS9(): Profile {
    return {
        duration_us: 20000,
        signals: null,
        number_of_signals: 7,
        adr: 0x20,
        cmd: 0x50,
    }
}

function SGP_PROFILE_SET_ABSOLUTE_HUMIDITY(): Profile {
    return {
        duration_us: 10000,
        signals: null,
        number_of_signals: 0,
        adr: 0x20,
        cmd: 0x61,
    }
}

let SGP_WORD_LEN = 2;
let SGP_COMMAND_LEN = SGP_WORD_LEN;

let STATUS_OK = 0;
let STATUS_FAIL = -1;
let CRC8_LEN = 1;
let CRC8_POLYNOMIAL = 0x31;
let CRC8_INIT = 0xFF;

let crc_flag = 0;

namespace smartfeldSensoren {

    export class SGP30 {

        serialID: Buffer;
        featureSetVersion: number;
        tvoc_ppb: number;
        co2_eq_ppm: number;
        current_state: sgp_state_code;
        word_buf: Buffer;

        private sgp30WriteReg(addr: number, cmd: number) {
            let buf: Buffer = pins.createBuffer(2);

            buf[0] = addr;
            buf[1] = cmd;

            pins.i2cWriteBuffer(SGP_I2C_ADR, buf, false);
        }

        /*private sgp30ReadReg(addr: number): number {
            let buf: Buffer = pins.createBuffer(1);
    
            buf[0] = addr;
            pins.i2cWriteBuffer(SGP_I2C_ADR, buf, false);
            buf = pins.i2cReadBuffer(SGP_I2C_ADR, 1, false);
    
            return buf[0];
          }*/

        private sgp30ReadBytes(dataBytes: number): Buffer {
            let i, j;
            let byteBuf = pins.i2cReadBuffer(SGP_I2C_ADR, dataBytes, false);

            // check the CRC for each byte
            for (i = 0; i < dataBytes; i += SGP_WORD_LEN + CRC8_LEN) {
                if (this.sgp30_check_crc(byteBuf, i, byteBuf[i + SGP_WORD_LEN]) == STATUS_FAIL) {
                    crc_flag = 1;
                }
            }
            return byteBuf;
        }

        private sgp30SleepMicros(timeUs: number) {
            control.waitMicros(timeUs);
        }

        private sgp30_generate_crc(data: Buffer, count: number): number {
            let current_byte;
            let crc = CRC8_INIT;
            let crc_bit;

            // calculates 8-Bit checksum with given polynomial
            for (current_byte = count; current_byte < (count + SGP_WORD_LEN); ++current_byte) {

                //crc ^= (data[current_byte]);
                crc = crc ^ data[current_byte];
                crc = crc % 256;

                for (crc_bit = 8; crc_bit > 0; --crc_bit) {
                    if (crc & 0x80) {
                        crc = (crc << 1) ^ CRC8_POLYNOMIAL;
                        crc = crc % 256;
                    }
                    else crc = (crc << 1);
                }
            }
            return crc;
        }

        private sgp30_check_crc(data: Buffer, count: number, checksum: number): number {
            //serial.writeValue("checksum", checksum)
            let crc = this.sgp30_generate_crc(data, count);
            //serial.writeValue("crc", crc)
            if (crc != checksum)
                return STATUS_FAIL;
            return STATUS_OK;
        }

        /**
          sgp30_readID() - read ID, if found - sensor is present
    
          Return:      if as string with 4 uint8_t
        */
        private sgp30ReadID(): string {

            let profile = SGP_PROFILE_Serial_ID();
            this.sgp30_run_profile(profile);
            this.serialID = this.word_buf;

            if(this.serialID[0] == 0 && this.serialID[1] == 0 && this.serialID[3] == 0 && this.serialID[4] == 0 && this.serialID[5] == 0 && this.serialID[6] == 0 && this.serialID[7] == 0 || crc_flag == 1) {
                return "Gassensor SGP30 not found";
            }

            let str;
            let str1 = "";
            let cnt = 0;
            for (let i = 0; i < profile.number_of_signals; ++i) {
                cnt++;
                str = smarttools.dec2Hex(this.word_buf[i]);
                if (cnt % 3 != 0)  //every third is CRC
                {
                    str1 = str1 + str + " ";
                }
                else cnt = 0;

                //str1 = str1 + str[2] + str[3];  //do only print numbers and not "0x"
            }
            return "Gassensor SGP30 found, Serial ID is " + str1;
        }

        /**
                  sgp30GetFeatureSetVersion() - read feature set version
    
                                  Detail: If product_type is 0 it is a SGP30 gas sensor, if it is 1 it is an SGPC3 gas sensor.
    
                                                  Return:      if as string with type na,e
        */
        private sgp30GetFeatureSetVersion(): string {

            // get feature set version
            let profile = SGP_PROFILE_SET_FEATURESET_VERSION();
            this.sgp30_run_profile(profile);
            
            this.featureSetVersion = this.word_buf[0] >> 4;

            if (this.featureSetVersion == 1) {
                return ", type is SGPC3";
            }
            else if (this.featureSetVersion == 0) {
                return ", type is SGP30";
            }
            else {
                return ", wrong type detected";
            }
        }

        /**
                   sgp_run_profile() - run a profile and read write its return to client_data
                            @profile     A pointer to the profile
    
                                              Return:      STATUS_OK on success, else STATUS_FAIL
        */
        private sgp30_run_profile(profile: Profile): number {
            let duration_us_eff = profile.duration_us + 5;

            this.sgp30WriteReg(profile.adr, profile.cmd);

            this.sgp30SleepMicros(duration_us_eff);

            if (profile.number_of_signals > 0) {
                this.current_state = sgp_state_code.MEASURING_PROFILE_STATE;
                return this.read_measurement(profile)
            }

            return STATUS_OK;
        }

        sgp30_measRead_tVOC(): number {
            this.sgp30_measure_iaq_blocking_read();
            //this.tvoc_ppb = this.word_buf[0] << 8 & this.word_buf[1];
            return this.tvoc_ppb;
        }

        sgp30_measRead_CO2eq(): number {
            let status;
            status = this.sgp30_measure_iaq_blocking_read();
            //this.co2_eq_ppm = this.word_buf[2] << 8 & this.word_buf[3];
            if (status == STATUS_OK) {
                return this.co2_eq_ppm;
            }
            else {
                return 999;
            }
        }

        /**
          sgp_measure_iaq_blocking_read() - Measure IAQ concentrations tVOC, CO2-Eq.
    
          @tvoc_ppb:   The tVOC ppb value will be written to this location
          @co2_eq_ppm: The CO2-Equivalent ppm value will be written to this location
    
          The profile is executed synchronously.
    
          Return:      STATUS_OK on success, else STATUS_FAIL
        */
        sgp30_measure_iaq_blocking_read(): number {

            let profile = SGP_PROFILE_IAQ_MEASURE9();

            if (STATUS_OK == this.sgp30_run_profile(profile)) {
                this.tvoc_ppb = this.word_buf[0] << 8 | this.word_buf[1];
                this.co2_eq_ppm = this.word_buf[3] << 8 | this.word_buf[4]; //letztes bit crc

                return STATUS_OK;
            }
            return STATUS_FAIL;

        }

        /**
                  read_measurement() - reads the result of a profile measurement
    
          Return:  Length of the written data to the buffer. Negative if it fails.
        */
        private read_measurement(profile: Profile): number {
            
            crc_flag = 0;
            switch (this.current_state) {
                case sgp_state_code.MEASURING_PROFILE_STATE:
                    this.word_buf = this.sgp30ReadBytes(profile.number_of_signals);

                    this.current_state = sgp_state_code.WAIT_STATE;

                    return STATUS_OK;

                default:
                    /* No command issued */
                    return STATUS_FAIL;
            }
        }

        private sgp30_iaq_init(): number {

            let profile = SGP_PROFILE_IAQ_INIT();

            if (STATUS_OK == this.sgp30_run_profile(profile)) {
                return STATUS_OK;
            }
            return STATUS_FAIL;
        }


        /**
            Check some registers to get data of SGP30
        */
        init(): string {
            let initString;
            basic.pause(500);
            
            for (let index = 0; index < 3; index++) {
                initString = this.sgp30ReadID();
                initString = initString + this.sgp30GetFeatureSetVersion();
                this.sgp30_iaq_init();
                basic.pause(500);
            }

            basic.pause(200);
            return initString;
        }
    }
}