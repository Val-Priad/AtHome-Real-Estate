"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { deleteUser } from "@/lib/actions/user/deleteUser";

export function UserActions({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    const res = await deleteUser(id);
    setOpen(false);
    router.refresh();

    if (res.success) {
      toast.success("User deleted");
    } else {
      toast.error(res.message || "Failed to delete user");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded p-1 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/users/${id}`)}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user will be permanently
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
    </>
  );
}
