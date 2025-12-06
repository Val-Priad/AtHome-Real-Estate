import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import Field from "./AccordionField";
import { IoTriangle } from "react-icons/io5";

function AccordionSection({
  title,
  fields,
}: {
  title: string;
  fields: [string, number | string | null][];
}) {
  return (
    <AccordionItem value={title} className="rounded-xl bg-stone-50 p-3">
      <AccordionTrigger className="group mb-2 flex w-full items-center justify-between">
        {title}
        <IoTriangle className="text-brand-6 transition-transform duration-300 group-data-[state=closed]:rotate-180" />
      </AccordionTrigger>
      <AccordionContent className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <Field key={label} label={label} value={value} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export default AccordionSection;
