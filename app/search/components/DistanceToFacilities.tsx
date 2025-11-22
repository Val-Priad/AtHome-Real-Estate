import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function DistanceSelect({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Distance to Facilities</label>

      <Select value={value ?? undefined} onValueChange={(val) => onChange(val)}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select distance" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="0.5">0.5 km</SelectItem>
          <SelectItem value="1">1 km</SelectItem>
          <SelectItem value="1.5">1.5 km</SelectItem>
          <SelectItem value="2">2 km</SelectItem>
          <SelectItem value="5">5 km</SelectItem>
          <SelectItem value="10">10 km</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
