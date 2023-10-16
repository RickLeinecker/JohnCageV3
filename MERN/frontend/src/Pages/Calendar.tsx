import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Style/CalendarStyle.css';
import CalendarDateRegister from '../API/CalendarDateRegister';

const CalendarPage: React.FC = () => {
    const testTimes = ['02:00 AM', '05:40 PM', '08:20 AM', '07:20 PM', '05:00 PM', '05:20 PM', ]//delete later but for testing purposes of how select works
    let takenTimes: string[] = [];

    const initialValues = {
        eventName: "",
        eventTime: "",
        eventTags: "",
        Collaborators: "",
    }
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [event, setEvent] = useState(initialValues);
    const timeOptions = [];//variable for calculating time blocks

    const calendarStyle = {
        display: showForm ? 'none' : 'block',
    }

    const handleDateClick = (date: Date) => {
        console.log("in date click, Date: " + date.toISOString().split('T')[0]);
        
        setSelectedDate(date);
        setShowForm(true);

        const takenTimes = CalendarDateRegister(date.toISOString().split('T')[0])

    };

    const closeForm = () => {
        setSelectedDate(null);
        setShowForm(false);
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
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
          timeOptions.push(formattedTime);
        }
      }
    //makes an array that includes all the available time slots
    const filteredTimeOptions = timeOptions.filter((time) => !testTimes.includes(time));

    const handleTimeChange = (event : React.ChangeEvent<HTMLSelectElement>) =>{
        const newTime = event.target.value;
        setSelectedTime(newTime);
    }

    const useSelectedTime = () =>{
        console.log('Selected Time' + selectedTime);
        event.eventTime = selectedTime;
        closeForm();
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

            {showForm && (
                <div className='popup-overlay'>
                    <div className='popup-form'>
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
                                style={{
                                    display:'block',
                                    padding: '10px',
                                    width:'100%',
                                    borderRadius: '1em',
                                }}
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
                                style={{
                                    display: 'block',
                                    padding: '10px',
                                    width:'100%',
                                    borderRadius: '1em',
                                }}
                            />
                            <label htmlFor='Collaborators' style={{fontSize: 'calc(5px + 2vmin)'}}>Collaborators</label>
                            <input
                                type='text'
                                name='eventCollaborators'
                                id='event-collaborators'
                                onChange={handleChange}
                                value={event.Collaborators}
                                style={{
                                    display: 'block',
                                    padding: '10px',
                                    width:'100%',
                                    borderRadius: '1em',
                                }}
                            />  
                        </div>
                        <div className='popup-btns'>
                            <button onClick={useSelectedTime} className='form-btn'>Book Appointment</button>
                            <button onClick={closeForm} className='form-btn'>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
