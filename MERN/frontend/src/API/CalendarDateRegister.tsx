import { buildPath } from "../Variables/expressServer";

const CalendarDateRegister = async function (date: string){
    try{
        const URL = "http://localhost:5000/api/schedules/getSchedule?date=";
        const JSON_Obj = JSON.stringify({date: date});
        const response = await fetch(URL,{ method: 'GET', mode: "cors", headers: { 'Content-Type': 'application/json' },body: JSON_Obj})
        const JSON_Text = JSON.parse(await response.text());

        console.log(JSON_Text);
        return JSON_Text.scheduledTimes;
    }
    catch(e){

    }

}

export default CalendarDateRegister;