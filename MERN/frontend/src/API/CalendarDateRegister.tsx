import { buildPath } from "../Variables/expressServer";

const CalendarDateRegister = async function (date: string, TimeFunction: Function){
    try{
        const URL = "http://localhost:5000/api/schedules/getSchedule?date="+date;
        console.log("Date value is "+date);
        const JSON_Obj = JSON.stringify({date: date});
        const response = await fetch(URL,{ method: 'GET', mode: "cors", headers: { 'Content-Type': 'application/json' }})
        const JSON_Text = JSON.parse(await response.text());

        console.log(JSON_Text);
        TimeFunction(JSON_Text.scheduledTimes);
        return JSON_Text.scheduledTimes;
    }
    catch(e){

    }

}

export default CalendarDateRegister;