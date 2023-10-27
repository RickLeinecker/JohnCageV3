import { schedulesAttributes } from "../src/models/schedules";
import console_log from "../../functions/logging/console_log";
const fs = require("fs");

const getPerformerPasscodes = function (schedule: schedulesAttributes): number[] {
    // Does not get maestro's, since that was required to even get here.
    let passcodes: number[] = [];
    if (schedule.User1Passcode) { passcodes.push(schedule.User1Passcode); }
    if (schedule.User2Passcode) { passcodes.push(schedule.User2Passcode); }
    if (schedule.User3Passcode) { passcodes.push(schedule.User3Passcode); }
    if (schedule.User4Passcode) { passcodes.push(schedule.User4Passcode); }
    return passcodes;
}

const storePasscodes = function (passcodes: number[]): boolean {
    passcodes.forEach((passcode, index) => {
        fs.writeFile("./temp/passcode" + (index + 1), passcode.toString(), { flag: 'a' }, (err: any) => {
            if (err) {
                console_log(err.message);
                return false;
            }
        });
    })

    return true
}

// Probably works every time but might need some testing.
// Each code must be unique and there must be exactly the number that is passed.
// Also must be 6 digit, although it shouldn't break anything if it isn't.
const generatePasscodes = function (count: number): number[] {
    let passCodes: number[] = [];
    for (let i = 0; i < count; ++i) {
        let newCode = Math.floor((Math.random() * 800000) + 100000);

        while (passCodes.includes(newCode)) {
            console_log("Duplicate passcode; adding 5 until unique.")
            newCode = newCode + 5;
        }
        passCodes.push(newCode);
    }

    console_log("Passcodes generated: ", passCodes, "\n");
    return passCodes;
}

export { getPerformerPasscodes, storePasscodes, generatePasscodes };