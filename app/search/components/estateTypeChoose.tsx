"use client";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

function EstateTypeChoose({
  estateType,
  handleClick,
}: {
  estateType: "house" | "apartment" | null;
  handleClick: Dispatch<SetStateAction<"house" | "apartment" | null>>;
}) {
  return (
    <div className="mt-2 flex rounded-md bg-red-100">
      <Button
        className={`${estateType !== "apartment" && "text-brand-9 bg-red-100"} w-1/2 hover:text-stone-50`}
        onClick={() =>
          handleClick((prev) => (prev === "apartment" ? null : "apartment"))
        }
      >
        Apartment
      </Button>
      <Button
        className={`${estateType !== "house" && "text-brand-9 bg-red-50"} w-1/2 hover:text-stone-50`}
        onClick={() =>
          handleClick((prev) => (prev === "house" ? null : "house"))
        }
      >
        House
      </Button>
    </div>
  );
}

export default EstateTypeChoose;
