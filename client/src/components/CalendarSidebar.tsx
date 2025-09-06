import React, { useState } from 'react';

interface CalendarSidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  collapsed: boolean;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ 
  selectedDate, 
  onDateSelect,
  collapsed 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendarDay calendarDayEmpty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(
        <button
          key={day}
          className={`calendarDay ${isToday(date) ? 'calendarDayToday' : ''} ${isSelected(date) ? 'calendarDaySelected' : ''}`}
          onClick={() => onDateSelect(date)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (collapsed) return null;

  return (
    <div className="calendarSidebar">
      <div className="calendarHeader">
        <button className="calendarNavButton" onClick={() => navigateMonth('prev')}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3 className="calendarTitle">{formatMonth(currentMonth)}</h3>
        <button className="calendarNavButton" onClick={() => navigateMonth('next')}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="calendarWeekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="calendarWeekday">{day}</div>
        ))}
      </div>

      <div className="calendarGrid">
        {renderCalendar()}
      </div>

      <div className="calendarActions">
        <button 
          className="todayButton"
          onClick={() => {
            const today = new Date();
            setCurrentMonth(today);
            onDateSelect(today);
          }}
        >
          <i className="fas fa-calendar-day"></i>
          Today
        </button>
      </div>
    </div>
  );
};

export default CalendarSidebar;