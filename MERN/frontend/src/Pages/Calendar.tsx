import Calendar from 'react-calendar';
import { useState } from 'react';


export default function CalendarPage() {

    type ValuePiece = Date | null;
    type Value = ValuePiece | [ValuePiece, ValuePiece];

    const [date, setDate] = useState<Value>(new Date());

    return (
        <div className="app">
            <h1 className='header'>React Calendar</h1>
            <div className='calendar-container'>
                <Calendar onChange={(e) => { setDate(e); console.log(date) }} value={date} />
            </div>
            <div className='text-center'>
                <h1>Select a date</h1>
            </div>
        </div>
    )
}