"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal } from "lucide-react";

import { prolongEstate } from "@/lib/actions/estate/prolongEstate";
import { deleteEstateById } from "@/lib/actions/estate/deleteEstateById";
import { archiveEstate } from "@/lib/actions/estate/archiveEstate";

const prolongOptions = ["7", "30", "90", "180", "365"];

export function EstateActions({ id }: { id: number }) {
  const router = useRouter();

  const [selectedProlongValue, setSelectedProlongValue] = useState<
    string | null
  >(null);
  const [prolongDialogOpen, setProlongDialogOpen] = useState(false);

  const handleProlong = async () => {
    if (!selectedProlongValue) return;

    const result = await prolongEstate(id, Number(selectedProlongValue));

    setProlongDialogOpen(false);

    if (result?.success) {
      toast.success(
        `The listing has been prolonged by ${selectedProlongValue} days.`,
      );
      router.refresh();
    } else {
      toast.error(result?.message || "Failed to prolong listing.");
    }
  };

  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const handleArchive = async () => {
    const result = await archiveEstate(id);

    setArchiveDialogOpen(false);

    if (result?.success) {
      toast.success("The estate has been archived.");
      router.refresh();
    } else {
      toast.error((result?.message as string) || "Failed to archive estate.");
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deleteEstateById(id);

    setDeleteDialogOpen(false);

    if (result?.success) {
      toast.success("The estate was successfully removed.");
      router.refresh();
    } else {
      toast.error(result?.message || "Failed to delete estate.");
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="mx-auto rounded p-1 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => (window.location.href = `/estate/${id}`)}
          >
            Open
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => (window.location.href = `/estate/add?id=${id}`)}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setArchiveDialogOpen(true)}>
            Archive
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Prolong</DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              {prolongOptions.map((days) => (
                <DropdownMenuItem
                  key={days}
                  onClick={() => {
                    setSelectedProlongValue(days);
                    setTimeout(() => setProlongDialogOpen(true), 0);
                  }}
                >
                  {days} days
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={prolongDialogOpen} onOpenChange={setProlongDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Prolong listing by {selectedProlongValue} days?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleProlong}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This estate will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this estate?</AlertDialogTitle>
            <AlertDialogDescription>
              The listing will be moved to the archived state. You can restore
              it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleArchive}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
