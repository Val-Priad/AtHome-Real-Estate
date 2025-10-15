import { ChangeEvent } from "react";
import { SearchFormData } from "../page";
import { CheckboxOption, toCamelCase } from "./options";
import Section from "./Section";

function SectionWithCheckboxes({
  sectionName,
  handleInputChange,
  isChecked,
  options,
}: Readonly<{
  sectionName: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isChecked: (fieldName: keyof SearchFormData, value: string) => boolean;
  options: CheckboxOption[];
}>) {
  const fieldName = toCamelCase(sectionName);
  return (
    <Section sectionName={sectionName}>
      <div className="flex flex-wrap gap-x-4">
        {options.map((option) => {
          const value = option.value;
          const label = option.label || option.value;

          return (
            <label key={value} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name={fieldName as string}
                value={value}
                checked={isChecked(fieldName, value)}
                onChange={handleInputChange}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>
    </Section>
  );
}

export default SectionWithCheckboxes;
