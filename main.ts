smartfeldSensoren.initGas()
basic.pause(1000)
basic.forever(function () {
    basic.pause(1000)
    serial.writeValue("tVOC", smartfeldSensoren.measReadtVOC())
    basic.pause(1000)
    serial.writeValue("CO2eq", smartfeldSensoren.measReadCO2eq())
})
