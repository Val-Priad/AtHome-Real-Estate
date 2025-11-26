"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

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
import { promoteUserToAgent } from "@/lib/actions/user/promoteUserToAgent";

export function UserActions({ id }: { id: string }) {
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);

  async function handleDelete() {
    const res = await deleteUser(id);
    setOpenDelete(false);
    router.refresh();

    if (res.success) {
      toast.success("User deleted");
    } else {
      toast.error(res.message || "Failed to delete user");
    }
  }

  async function handlePromote() {
    const res = await promoteUserToAgent(id);
    router.refresh();

    if (res.success) {
      toast.success("User promoted to agent!");
    } else {
      toast.error(res.message || "Failed to promote user");
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded p-1 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePromote}>
            Promote to agent
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
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
