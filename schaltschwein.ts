
/**
* Nutze diese Datei für benutzerdefinierte Funktionen und Blöcke.
* Weitere Informationen unter https://makecode.microbit.org/blocks/custom
*/

enum MyEnumPlugLabel {
    //% block="Nase"
    K1,
    //% block="Seite"
    K2
}

enum MyEnumState {
    //% block="Ein"
    ON,
    //% block="Aus"
    OFF
}

enum MyEnumGroupIDs {
    Nif = 51,
    Naf = 52,
    Nuf = 53,
    Babe = 54,
    Oli = 55,
    Fiedler = 56,
    Schlau = 57,
    Pfeiffer = 58
}


namespace smartfeldAktoren {


    export class Switchpig {


        init(): void {
            pins.digitalWritePin(DigitalPin.P1, 1)
        }

        /**
         * Setze diese Funktion beim Start ein, um den Empfänger zu programmieren. 
         * @param rfGroupID Schweinchenname
         */
        //% block="Taufe das Schwein auf den Namen %rfGroupID"
        //% group="Prog. Empfängerschwein"
        programReceiver(rfGroupID: MyEnumGroupIDs): void {
            basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            . . . . .
            . . . . .
            `)
            radio.setGroup(rfGroupID)
            radio.onReceivedValue(function (name, status) {
                if (name == "K1") {
                    if (status == 1) {
                        pins.digitalWritePin(DigitalPin.P0, 1)
                        basic.showNumber(1)
                    } else {
                        pins.digitalWritePin(DigitalPin.P0, 0)
                        basic.clearScreen()
                    }
                }
                if (name == "K2") {
                    if (status == 1) {
                        pins.digitalWritePin(DigitalPin.P1, 1)
                        basic.showNumber(2)
                    } else {
                        pins.digitalWritePin(DigitalPin.P1, 0)
                        basic.clearScreen()
                    }
                }
            })
        }
        
        /**
         * Schaltet eine Steckdose des Schweinchens ein oder aus.
         * @param ch Steckdose, welcher geschaltet werden soll
         * @param state Zustand der Steckdose (Ein oder Aus)
         */
        //% block="Schalte Steckdose auf der %ch %state"
        //% group="Prog. Fernsteuerung"
        switchPlug(ch: MyEnumPlugLabel, state: MyEnumState): void {
            // Add code 
            if (state == MyEnumState.ON) {
                if (ch == MyEnumPlugLabel.K1) {
                    radio.sendValue("K1", 1);
                } else if (ch == MyEnumPlugLabel.K2) {
                    radio.sendValue("K2", 1);
                }
            } else {
                if (ch == MyEnumPlugLabel.K1) {
                    radio.sendValue("K1", 0);
                } else if (ch == MyEnumPlugLabel.K2) {
                    radio.sendValue("K2", 0);
                }
            }
        }

        /**
         * Wählt ein Schweinchen mit dem entsprechenden Namen aus.
         * Es genügt, die Auswahl einmalig beim Start des Programms vorzunehmen.
         * @param rfGroupID Wahl des Schweinchens, das bedient werden soll.
         */
        //% block="Wähle Schweinchen mit dem Namen %rfGroupID"
        //% group="Prog. Fernsteuerung"
        selectRfGroupID(rfGroupID: MyEnumGroupIDs): void {
            radio.setGroup(rfGroupID);
        }
    }
}