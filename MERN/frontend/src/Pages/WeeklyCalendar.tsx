// WeeklyCalendar.tsx
import React from 'react';

interface WeeklyCalendarProps {
  startDate: Date;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ startDate }) => {
  const days = [];

  // Generate an array of dates for the week starting from Monday
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }

  return (
    <div className="weekly-calendar">
      {days.map((day, index) => (
        <div key={index} className="calendar-day">
          {day.toLocaleDateString('en-US', { weekday: 'short' })}
          {day.getDate()}
          {/* You can add more content or events here */}
        </div>
      ))}
    </div>
  );
};

export default WeeklyCalendar;
