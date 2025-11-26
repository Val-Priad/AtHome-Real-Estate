"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);

  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="readyDate" className="px-1">
        Ready Date
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="readyDate"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            modifiers={{
              disabled: { before: today, after: nextYear },
            }}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              onChange(selectedDate);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
