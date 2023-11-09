// Floors time to nearest 20 minute interval.
const floorTime = function (time: string): string {
    let hms: string[] = time.split(':')
    if (hms.length < 3) { return "00:00:00"; }
    let minutes: string | undefined = hms.at(1);
    if (minutes) { minutes = (Math.floor(parseInt(minutes) / 20) * 20).toString(); }
    if (minutes?.length == 1) { minutes = "0" + minutes; }

    return hms.at(0) + ":" + minutes + ":" + "00";
}

// Gets UTC date in YYYY-MM-DD string format.
const getDateUTC = function (): string {
    let object = new Date();
    let year: string = object.getUTCFullYear().toString();
    let month: string = (object.getUTCMonth() + 1).toString();
    if (month.length == 1) { month = "0" + month; }
    let day: string = object.getUTCDate().toString();
    if (day.length == 1) { day = "0" + day; }

    return year + "-" + month + "-" + day;
}

// Gets UTC time in HH:MM:SS format.
const getTimeUTC = function (): string {
    let object = new Date();
    let second = object.getUTCSeconds();
    let minute = object.getUTCMinutes();
    let hour = object.getUTCHours();

    let seconds = second.toString();
    let minutes = minute.toString();
    let hours = hour.toString();

    if (hours.length == 1) { hours = "0" + hours; }
    if (minutes.length == 1) { minutes = "0" + minutes; }
    if (seconds.length == 1) { seconds = "0" + seconds; }

    return hours + ":" + minutes + ":" + seconds;
}

// Concerts timestamp to YYYY-MM-DDTHH:MM:SS Date Time string format.
// Not tested extensively.
const formatDateTime = function (timestamp: number): string {
    let object = new Date(timestamp);
    var year = object.getFullYear().toString();
    var month = (object.getMonth() + 1).toString();
    var day = (object.getDate()).toString();
    var hours = (object.getHours()).toString();
    var minutes = (object.getMinutes()).toString();
    var seconds = (object.getSeconds()).toString();

    if (month.length == 1) { month = "0" + month; }
    if (day.length == 1) { day = "0" + day; }
    if (hours.length == 1) { hours = "0" + hours; }
    if (minutes.length == 1) { minutes = "0" + minutes; }
    if (seconds.length == 1) { seconds = "0" + seconds; }

    return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
}

// Concerts timestamp to YYYY-MM-DDTHH:MM:SS Date Time string format.
// Not tested extensively.
const validDate = function (date: string): boolean {
    if (isNaN(Date.parse(date))) { return false; }
    return true;
}


const minutesToMilliseconds = function (minutes: number): number {
    const msPerMinute = 60000;
    const msPerInterval = minutes * msPerMinute;
    return msPerInterval;
}

const getNextTimeslot = function (milliseconds: number): number {
    const object = new Date();
    const currentTimestamp = object.getTime();
    const nextPurgeTimestamp = Math.floor((object.getTime() + milliseconds) / milliseconds) * milliseconds;
    const msUntilNextCall = nextPurgeTimestamp - currentTimestamp;

    console.log(new Date(currentTimestamp), new Date(nextPurgeTimestamp), msUntilNextCall);

    return msUntilNextCall;
}

export { getTimeUTC, getDateUTC, floorTime, formatDateTime, validDate, minutesToMilliseconds, getNextTimeslot };