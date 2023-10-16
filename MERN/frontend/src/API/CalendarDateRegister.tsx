import { buildPath } from "../Variables/expressServer";

const CalendarDateRegister = async function (date: string){
    try{
        const URL = "http://localhost:5000/api/schedules/getSchedule?date=";
        const JSON_Obj = JSON.stringify({date: date});
        

    }
    catch(e){

    }

}

export default CalendarDateRegister;