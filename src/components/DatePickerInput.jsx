import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';

function DatePickerInput() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div>
      <input 
        type="text" 
        value={selectedDay ? selectedDay.toLocaleDateString() : ''} 
        readOnly 
      />
      <DayPicker selected={selectedDay} onDayClick={setSelectedDay} />
    </div>
  );
}

export default DatePickerInput;