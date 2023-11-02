type scheduleArgs = {
    title: string;
    tags: string[];
    description: string;
    date: string;
    time: string;
    identifier: string;
    password: string;
    setterFunc?:Function;
}

export default scheduleArgs;