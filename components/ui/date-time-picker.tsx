import React from "react";
import ReactDatePicker from "react-datepicker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
}

const defaultProps: Partial<DateTimePickerProps> = {
  minDate: new Date(),
};

export function DateTimePicker({
  value,
  onChange,
  minDate = defaultProps.minDate,
}: DateTimePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? value.toLocaleString() : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <ReactDatePicker
          selected={value}
          onChange={(date) => onChange(date)}
          minDate={minDate}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          inline
        />
      </PopoverContent>
    </Popover>
  );
}
