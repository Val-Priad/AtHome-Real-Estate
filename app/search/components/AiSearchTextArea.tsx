import { Textarea } from "@/components/ui/textarea";

export function AiSearchTextarea({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">AI Search</label>

      <Textarea
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? undefined : e.target.value)
        }
        placeholder="Describe what you're looking for..."
        className="min-h-[60px] w-full"
      />
    </div>
  );
}
