"use client";

import { useState } from "react";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { prolongEstate } from "@/lib/actions/estate/prolongEstate";

const prolongOptions = ["7", "30", "90", "180", "365"];

export function ProlongMenu({ id }: { id: number }) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleConfirm() {
    if (!selectedValue) return;

    prolongEstate(id, Number(selectedValue));
    setDialogOpen(false);
  }

  return (
    <>
      {/* dropdown logic */}
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Prolong</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {prolongOptions.map((days) => (
            <DropdownMenuItem
              key={days}
              onClick={() => {
                setSelectedValue(days);
                // ❗ Делаем задержку — ждём пока dropdown закроется
                setTimeout(() => setDialogOpen(true), 0);
              }}
            >
              {days} days
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Prolong listing by {selectedValue} days?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
