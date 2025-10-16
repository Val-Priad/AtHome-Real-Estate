import { ChangeEvent } from "react";
import Section from "./Section";
import { toCamelCase } from "./options";

function FromToSection({
  sectionName,
  handleInputChange,
  isArea = false,
  currency = "",
}: Readonly<{
  sectionName: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isArea?: boolean;
  currency?: string;
}>) {
  return (
    <Section sectionName={sectionName}>
      <div className="flex gap-7">
        <Block
          fieldName={toCamelCase(sectionName + " From")}
          isArea={isArea}
          fieldLabel="From"
          handleInputChange={handleInputChange}
          currency={currency}
        />
        <Block
          fieldName={toCamelCase(sectionName + " To")}
          isArea={isArea}
          fieldLabel="To"
          handleInputChange={handleInputChange}
          currency={currency}
        />
      </div>
    </Section>
  );
}

function Block({
  fieldLabel,
  fieldName,
  handleInputChange,
  isArea = false,
  currency = "",
}: Readonly<{
  fieldLabel: string;
  fieldName: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isArea?: boolean;
  currency: string;
}>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldName}>{fieldLabel}</label>
      <div className="flex gap-1">
        <input
          type="text"
          onChange={handleInputChange}
          name={fieldName}
          className="border-brand-6 focus:outline-brand-6 block w-15 rounded-lg border pl-1.5 focus:outline focus:outline-offset-2"
        />

        {isArea && (
          <p>
            m <sup>2</sup>
          </p>
        )}
        {currency && <p>$</p>}
      </div>
    </div>
  );
}

export default FromToSection;
