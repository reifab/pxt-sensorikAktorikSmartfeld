// Gib deinen Code hier ein

namespace format {

    export function formatConverter(num: number, format: NumberFormat): number {
        let temp;

        if (NumberFormat.Int8LE == format) {
            temp = num & 0xFF;
            if (temp >> 7 == 1) {
                temp = -0x80 + (num & 0x7F)
            }
        }
        else if (NumberFormat.UInt8LE == format) {
            temp = num & 0xFF;
        }
        else if (NumberFormat.Int16LE == format) {
            temp = num & 0xFFFF;
            if (temp >> 15 == 1) {
                temp = -0x8000 + (num & 0x7FFF)
            }
        }
        else if (NumberFormat.UInt16LE == format) {
            temp = num & 0xFFFFFFFF;
        }
        else if (NumberFormat.Int32LE == format) {
            temp = num & 0xFFFFFFFF;
            if (temp >> 31 == 1) {
                temp = -0x80000000 + (num & 0x7FFFFFFF)
            }
        }
        else if (NumberFormat.UInt32LE == format) {
            temp = num & 0xFFFFFFFF;
        }


        else {
            temp = num
        }

        return temp

    } 
    export function formatConverterINT4(num: number): number {
        let temp;

        temp = num & 0xF;
        if (temp >> 3 == 1) {
            temp = -0x8 + (num & 0x7)
        }
        return temp

    }
}
