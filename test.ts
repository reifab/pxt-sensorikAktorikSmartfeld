let testSen0322 = true;

if(testSen0322){
    smartfeldSensoren.init_sauerstoff(3)

    while (true) {
        let sensorValueAverage: number;
        sensorValueAverage = 0;
        let sensorValueSingle: number;
        sensorValueSingle = 0;

        sensorValueAverage = smartfeldSensoren.lese_sauerstoff(10);
        serial.writeValue("Value Avg", sensorValueAverage);

        sensorValueSingle = smartfeldSensoren.lese_sauerstoff(1);
        serial.writeValue("Value Single", sensorValueSingle);
    }
}


