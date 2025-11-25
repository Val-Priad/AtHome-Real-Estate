"use client";

import { Input } from "@/components/ui/input";
import { InputUIStateType } from "../page";

export default function RangeGroup({
  label,
  fromKey,
  toKey,
  state,
  onChange,
}: {
  label: string;
  fromKey: keyof InputUIStateType;
  toKey: keyof InputUIStateType;
  state: InputUIStateType;
  onChange: (key: keyof InputUIStateType, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold">{label}</h3>

      <div className="flex gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">From</label>
          <Input
            value={state[fromKey] ?? ""}
            onChange={(e) => onChange(fromKey, e.target.value)}
            className="w-40"
            placeholder=""
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">To</label>
          <Input
            type="number"
            value={state[toKey] ?? ""}
            onChange={(e) => onChange(toKey, e.target.value)}
            className="w-40"
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
}
