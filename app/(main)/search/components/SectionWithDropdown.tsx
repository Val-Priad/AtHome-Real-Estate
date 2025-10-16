import { REGIONS_OPTIONS } from "./options";
import Section from "./Section";

function SectionWithDropdown({
  sectionName,
}: Readonly<{ sectionName: string }>) {
  return (
    <Section sectionName={sectionName}>
      <div></div>
      <select name="country" id="country-select">
        {REGIONS_OPTIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </Section>
  );
}

export default SectionWithDropdown;
