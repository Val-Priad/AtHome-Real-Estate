"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export type CheckboxOption =
  | string
  | {
      value: string;
      label: string;
    };

type CheckboxGroupProps = {
  label?: string;
  options: CheckboxOption[];
  fieldValue: string[];
  onChange: (updated: string[]) => void;
};

export default function CheckboxGroup({
  label,
  options,
  fieldValue,
  onChange,
}: CheckboxGroupProps) {
  function getOptionValue(option: CheckboxOption): string {
    return typeof option === "string" ? option : option.value;
  }

  function getOptionLabel(option: CheckboxOption): string {
    return typeof option === "string" ? option : option.label;
  }

  function handleToggle(value: string) {
    if (fieldValue.includes(value)) {
      onChange(fieldValue.filter((v) => v !== value));
    } else {
      onChange([...fieldValue, value]);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {label && <h3 className="font-semibold">{label}</h3>}

      <div className="flex flex-wrap gap-4">
        {options.map((option) => {
          const value = getOptionValue(option);
          const displayLabel = getOptionLabel(option);
          const checked = fieldValue.includes(value);

          return (
            <div
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm"
              onClick={() => handleToggle(value)}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => handleToggle(value)}
              />
              <span>{displayLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
