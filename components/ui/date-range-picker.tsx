import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerWithRange = ({ selected, onSelect }) => {
  const [startDate, setStartDate] = useState(selected?.from);
  const [endDate, setEndDate] = useState(selected?.to);

  const handleDateChange = (date, type) => {
    if (type === "from") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }

    if (startDate && endDate) {
      onSelect({ from: startDate, to: endDate });
    }
  };

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={(date) => handleDateChange(date, "from")}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        maxDate={endDate}
        placeholderText="开始日期"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => handleDateChange(date, "to")}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="结束日期"
      />
    </div>
  );
};

export default DatePickerWithRange;
