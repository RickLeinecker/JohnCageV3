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
    let minutes = object.getUTCMinutes().toString();
    let hours = object.getUTCHours().toString();
    let seconds = object.getUTCSeconds().toString();
    if (hours.length == 1) { hours = "0" + hours; }
    if (minutes.length == 1) { minutes = "0" + minutes; }
    if (seconds.length == 1) { seconds = "0" + seconds; }

    return hours + ":" + minutes + ":" + seconds;
}

export { getTimeUTC, getDateUTC, floorTime };