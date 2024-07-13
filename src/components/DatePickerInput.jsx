import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-picker';

function DatePickerInput() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div>
      <input 
        type="text" 
        value={selectedDay ? selectedDay.toLocaleDateString() : ''} 
        readOnly 
      />
      <DatePicker selected={selectedDay} onDayClick={setSelectedDay} />
    </div>
  );
}

export default DatePickerInput;