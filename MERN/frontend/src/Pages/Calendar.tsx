import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Style/CalendarStyle.css';
import CalendarDateRegister from '../API/CalendarDateRegister';
import schedule from '../API/scheduleAPI';
import scheduleArgs from '../Types/scheduleArgs';

const CalendarPage: React.FC = () => {
    const testTimes = ['02:00 AM', '05:40 PM', '08:20 AM', '07:20 PM', '05:00 PM', '05:20 PM', ]//delete later but for testing purposes of how select works
    let takenTimes: string[] = [];

    const initialValues = {
        eventName: "",
        eventTime: "",
        eventTags: "",
        Collaborators: "",
        identifier: "",
        password: ""
    }

    const inputData:scheduleArgs = {
        title: "",
        tags: ["Wookie","Cookie"],
        description: "thisi s a test",
        date: "",
        time: "",
        identifier: "",
        password: ""
    }

    const inputFieldStyle:React.CSSProperties = {
        display:'block',
        padding: '10px',
        width:'100%',
        borderRadius: '1em',
    }

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [event, setEvent] = useState(initialValues);
    const [takenTimesList,setTakenTime] = useState(takenTimes);
    const [maestroID,setMaestroID] = useState(1);
    const [scheduleData,setScheduleData] = useState(inputData);

    const timeOptions = [];//variable for calculating time blocks

    const calendarStyle = {
        display: showForm ? 'none' : 'block',
    }

    function ReadTakenTimes(timesTable:string[])
    {
        console.log("Time slot takens for the day are ",timesTable);
        timesTable.forEach(element => {
            takenTimesList.push(element);
        });
    }

    const handleDateClick = (date: Date) => {
        console.log("in date click, Date: " + date.toISOString().split('T')[0]);
        
        setSelectedDate(date);
        // setShowForm(true);

        const takenTimes = CalendarDateRegister(date.toISOString().split('T')[0],ReadTakenTimes)

    };

    const closeForm = () => {
        // setSelectedDate(null);
        // setShowForm(false);
        setSelectedTime('');
    };

    const handleChange =(e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        console.log("in handle Change " + e.target);
        setEvent({...event, [name]:value});
    } 

    for (let hours = 1; hours <= 24; hours++) {
        for (let minutes = 0; minutes < 60; minutes += 20) {
          const formattedHours = hours > 12 ? hours - 12 : hours;
          const ampm = (hours >= 12 && hours != 24) ? 'PM' : 'AM';
          const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
          timeOptions.push(formattedTime);
        }
      }
    //makes an array that includes all the available time slots
    const filteredTimeOptions = timeOptions.filter((time) => !takenTimesList.includes(time));

    const handleTimeChange = (event : React.ChangeEvent<HTMLSelectElement>) =>{
        const newTime = event.target.value;
        setSelectedTime(newTime);
    }

     function monthString(mon:string){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
     }

     function formattedUTCString(timeString:string,dateString:string):string[]
     {
        dateString = dateString.replace(/-/gi,"/");
        console.log("Passing in time: "+timeString+" and date: "+dateString);
        const utcString:string[] = (new Date(dateString+" "+timeString)).toUTCString().split(" ");
        const reformmatedDateString:string = utcString[3]+"-"+monthString(utcString[2])+"-"+utcString[1];
        console.log("reformattedDate string is "+utcString);
        const utcTimeString = utcString[4];
        const utcFinalString:string[] = [reformmatedDateString,utcTimeString];
        console.log("Final string content "+utcFinalString)

        return utcFinalString;
     }

    const useSelectedTime = () =>{
        console.log('Selected Time' + selectedTime);
        event.eventTime = selectedTime;
        setMaestroID(maestroID + 1);
        if (selectedDate && selectedTime)
        {
            console.log("Sending in schedule data");
            const dateString:string = selectedDate.toISOString().split('T')[0];
            const convertedTimeArr:string[] = formattedUTCString(selectedTime,dateString);
            console.log("Returning time "+convertedTimeArr);
            scheduleData.title = event.eventName;
            scheduleData.date = convertedTimeArr[0];
            scheduleData.time = convertedTimeArr[1];
            scheduleData.identifier = event.identifier;
            scheduleData.password = event.password;
            schedule(scheduleData);
        }
    }


    return (
        <div className='calendar-page-container'>
            <div className='calendar-container' style={calendarStyle}>
                <Calendar
                    className='calendar'
                    onClickDay={handleDateClick}
                    value={selectedDate || new Date()}
                /> 
            </div>

            
                <div className=''>
                    <div className=''>
                        <h2>Event form for {selectedDate?.toLocaleDateString()}</h2>
                        <div>

                            <label htmlFor='event' style={{fontSize: 'calc(5px + 2vmin)'}}>
                                Song Title
                            </label>
                            <input 
                                type='text'
                                name='eventName'    
                                id='event-name'
                                onChange={handleChange}
                                value={event.eventName}
                                style={inputFieldStyle}
                            />

                            <label htmlFor='time' style={{fontSize: 'calc(5px + 2vmin)'}}>Time Slots</label>
                            <br/>
                            <select value={selectedTime} onChange={handleTimeChange}>
                                <option value="" disabled>
                                    -- Select a time --
                                </option>
                                {filteredTimeOptions.map((time, index) =>(
                                    <option key={index} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            <br/>
                            <label htmlFor='tags' style={{fontSize: 'calc(5px + 2vmin)'}}>Tags</label>
                            <input 
                                type='text'
                                name='eventTags'
                                id='event-tags'
                                onChange={handleChange}
                                value={event.eventTags}
                                style={inputFieldStyle}
                            />
                            <label htmlFor='Collaborators' style={{fontSize: 'calc(5px + 2vmin)'}}>Collaborators</label>
                            <input
                                type='text'
                                name='Collaborators'
                                id='event-collaborators'
                                onChange={handleChange}
                                value={event.Collaborators}
                                style={inputFieldStyle}
                            />  
                            <label htmlFor='event' style={{fontSize: 'calc(5px + 2vmin)'}}>
                                Username
                            </label>
                            <input 
                                type='text'
                                name='identifier'    
                                id='event-Ident'
                                onChange={handleChange}
                                value={event.identifier}
                                style={inputFieldStyle}
                            />
                            <label htmlFor='event' style={{fontSize: 'calc(5px + 2vmin)'}}>
                                Password
                            </label>
                            <input 
                                type='text'
                                name='password'    
                                id='event-Pass'
                                onChange={handleChange}
                                value={event.password}
                                style={inputFieldStyle}
                            />
                        </div>
                        <div className='popup-btns'>
                            <button onClick={useSelectedTime} className='form-btn'>Book Appointment</button>
                        </div>
                    </div>
                </div>
            
        </div>
    );
};

export default CalendarPage;
