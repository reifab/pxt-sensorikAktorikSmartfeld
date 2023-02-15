smartfeldSensoren.initGas()
basic.forever(function () {
    serial.writeValue("CO2", smartfeldSensoren.measReadCO2eq())
    serial.writeValue("tVOC", smartfeldSensoren.measReadtVOC())
    if (smartfeldSensoren.measReadCO2eq() < 50) {
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.Happy)
    }
    basic.pause(1000)
})
