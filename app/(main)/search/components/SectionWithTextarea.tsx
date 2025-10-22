import { ChangeEvent } from "react";
import { toSnakeCase } from "./options";
import Section from "./Section";

function SectionWithTextarea({
  sectionName,
  handleTextareaChange,
}: Readonly<{
  sectionName: string;
  handleTextareaChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}>) {
  return (
    <Section sectionName={sectionName}>
      <div>
        <textarea
          name={toSnakeCase(sectionName)}
          rows={1}
          className="border-brand-6 focus:outline-brand-6 block w-full resize-none rounded-lg border pl-1.5 focus:outline focus:outline-offset-2"
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
          }}
          onChange={(e) => handleTextareaChange(e)}
        />
      </div>
    </Section>
  );
}

export default SectionWithTextarea;
