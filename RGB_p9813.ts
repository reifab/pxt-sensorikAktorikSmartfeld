let P9813_CLK_PULSE_DELAY_US = 20;
let HIGH = 1;
let LOW = 0;

let CL_RED = 0
let CL_GREEN = 1
let CL_BLUE = 2



namespace smartfeldAktoren {

    export class Chain {

        clk_pin: DigitalPin;
        data_pin: DigitalPin;
        number_of_leds: number;
        led_state: Buffer;


        init(clkPin: DigitalPin, dataPin: DigitalPin, numberOfLeds: number): Chain {

            let chain = new Chain();
            chain.clk_pin = clkPin;
            chain.data_pin = dataPin;
            chain.number_of_leds = numberOfLeds;
            chain.led_state = pins.createBuffer(numberOfLeds*3)

            let i;
            for (i = 0; i < chain.number_of_leds; i++)
                chain.setColorRGB(i, 255, 255, 0);

            return chain;
        }


        setColorRGB(ledNumber: number, red: number, green: number, blue: number){
        // Send data frame prefix (32x "0")
        this.sendByte(0x00);
        this.sendByte(0x00);
        this.sendByte(0x00);
        this.sendByte(0x00);

        let i;
        // Send color data for each one of the leds
        for ( i = 0; i < this.number_of_leds; i++)
        {
            if (i == ledNumber) {
                this.led_state[i * 3 + CL_RED] = red;
                this.led_state[i * 3 + CL_GREEN] = green;
                this.led_state[i * 3 + CL_BLUE] = blue;
            }

            this.sendColor(
                this.led_state[i * 3 + CL_RED],
                this.led_state[i * 3 + CL_GREEN],
                this.led_state[i * 3 + CL_BLUE]);
        }

        // Terminate data frame (32x "0")
        this.sendByte(0x00);
        this.sendByte(0x00);
        this.sendByte(0x00);
        this.sendByte(0x00);
        }
        
        //% subcategory="LED" weight=83 
        //% group="Verkettbare RGB 104020048"
        //% blockID="chain_set_all" block="%chain|setze alle RGBs der Kette auf rot %red|grün %green|blau %blue"
        //% chain.defl=Kette
        setColorChain(red: number, green: number, blue: number) {
            let i;
            for (i = 0; i < this.number_of_leds; i++) {
                this.setColorRGB(i, red, green, blue);
            }
        }
        
        //% subcategory="LED" weight=83 
        //% group="Verkettbare RGB 104020048"
        //% blockID="chain_set_one" block="%chain|setze RGB Nummer %numberOfRGB| auf RGB rot %red|grün %green|blau %blue"
        //% chain.defl=Kette
        setColorJustOne(numberOfRGB: number, red: number, green: number, blue: number) {
            this.setColorRGB(numberOfRGB, red, green, blue);
        }

        //% subcategory="LED" weight=84 
        //% group="Verkettbare RGB 104020048"
        //% blockId ="chain_set_one" block="%chain|setze nur eine der Kette auf RGB red %red|green %green|blue %blue"
        //% chain.defl=Kette
        setColorOneRGB(red: number, green: number, blue: number) {
            this.setColorRGB(0, red, green, blue);
        }

        sendColor(red: number, green: number, blue: number)
        {
            // Start by sending a byte with the format "1 1 /B7 /B6 /G7 /G6 /R7 /R6"
            let prefix = 0b11000000;
            if ((blue & 0x80) == 0) prefix |= 0b00100000;
            if ((blue & 0x40) == 0) prefix |= 0b00010000;
            if ((green & 0x80) == 0) prefix |= 0b00001000;
            if ((green & 0x40) == 0) prefix |= 0b00000100;
            if ((red & 0x80) == 0) prefix |= 0b00000010;
            if ((red & 0x40) == 0) prefix |= 0b00000001;
            this.sendByte(prefix);

            // Now must send the 3 colors
            this.sendByte(blue);
            this.sendByte(green);
            this.sendByte(red);
        }

        sendByte(b: number) {
            // Send one bit at a time, starting with the MSB
            let i;
            for (i = 0; i < 8; i++)
            {
                // If MSB is 1, write one and clock it, else write 0 and clock
                if ((b & 0x80) != 0)
                    pins.digitalWritePin(this.data_pin, HIGH);
                else
                    pins.digitalWritePin(this.data_pin, LOW);
                this.clk();

                // Advance to the next bit to send
                b <<= 1;
            }
        }

        clk()
        {
            pins.digitalWritePin(this.clk_pin, LOW);
            control.waitMicros(P9813_CLK_PULSE_DELAY_US);
            pins.digitalWritePin(this.clk_pin, HIGH);
            control.waitMicros(P9813_CLK_PULSE_DELAY_US);
        }



    }
}