import { Concert } from "../socket.types"
import console_log from "../../../functions/logging/console_log";

const removePasscode = (currentConcert: Concert, passcode: string) => {
    const activePasscodeIndex = currentConcert.activePasscodes.indexOf(passcode);
    if (activePasscodeIndex > -1) { currentConcert.activePasscodes.splice(activePasscodeIndex, 1); console_log(currentConcert.activePasscodes); }
    else { console_log("Passcoderemovalfailed"); }
}

export { removePasscode };