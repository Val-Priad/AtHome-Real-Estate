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
import { deleteAgent } from "@/lib/actions/user/deleteAgent";

export function AgentActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deleteAgent(id);

    setDeleteDialogOpen(false);
    router.refresh();

    if (result.success) {
      toast.success("Agent was deleted successfully.");
    } else {
      toast.error(result.message ?? "Failed to delete agent.");
    }
  };

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
            onClick={() => router.push(`/dashboard/agents/${id}`)}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this agent?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The agent and all their associated
              data will be permanently removed.
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
