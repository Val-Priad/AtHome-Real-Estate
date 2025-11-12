import { ChangeEvent } from "react";
import { CheckboxOption, toSnakeCase } from "./options";
import Section from "./Section";

function SectionWithDropdown({
  sectionName,
  options,
  handleSelectChange,
}: Readonly<{
  sectionName: string;
  options: CheckboxOption[] | string[];
  handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}>) {
  return (
    <Section sectionName={sectionName}>
      <select
        className="block rounded-xl bg-white px-2 py-1"
        name={toSnakeCase(sectionName)}
        id={toSnakeCase(sectionName + " Select")}
        onChange={handleSelectChange}
      >
        <option key={-1} value={toSnakeCase("no " + sectionName)}>
          --Select--
        </option>
        {options.map((option) => {
          if (typeof option === "string") {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          }

          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </Section>
  );
}

export default SectionWithDropdown;
