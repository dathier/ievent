import React from "react";
import ReactDatePicker from "react-datepicker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  minDate,
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
          onChange={onChange}
          minDate={minDate}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          inline
        />
      </PopoverContent>
    </Popover>
  );
}
