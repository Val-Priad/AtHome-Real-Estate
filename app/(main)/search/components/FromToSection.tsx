import { ChangeEvent } from "react";
import Section from "./Section";
import { toSnakeCase } from "./options";

function FromToSection({
  sectionName,
  handleInputChange,
  isArea = false,
  currency = "",
  formData,
}: Readonly<{
  sectionName: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isArea?: boolean;
  currency?: string;
  formData: Record<string, string | string[] | undefined>;
}>) {
  return (
    <Section sectionName={sectionName}>
      <div className="flex gap-7">
        <Block
          fieldName={toSnakeCase(sectionName + " From")}
          isArea={isArea}
          fieldLabel="From"
          handleInputChange={handleInputChange}
          currency={currency}
          formData={formData}
        />
        <Block
          fieldName={toSnakeCase(sectionName + " To")}
          isArea={isArea}
          fieldLabel="To"
          handleInputChange={handleInputChange}
          currency={currency}
          formData={formData}
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
  formData,
}: Readonly<{
  fieldLabel: string;
  fieldName: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isArea?: boolean;
  currency: string;
  formData: Record<string, string | string[] | undefined>;
}>) {
  const valueStoredInFormData = formData[fieldName];
  const value =
    typeof valueStoredInFormData === "string" &&
    valueStoredInFormData.length > 0
      ? valueStoredInFormData
      : "";
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldName}>{fieldLabel}</label>
      <div className="flex gap-1">
        <input
          type="text"
          onChange={handleInputChange}
          name={fieldName}
          className="border-brand-6 focus:outline-brand-6 block w-15 rounded-lg border pl-1.5 focus:outline focus:outline-offset-2"
          value={value}
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
