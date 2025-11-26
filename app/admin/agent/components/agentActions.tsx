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
import { deleteAgent } from "@/lib/actions/user/deleteAgent";
import { demoteAgentToUser } from "@/lib/actions/user/demoteAgentToUser";

export function AgentActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [demoteDialogOpen, setDemoteDialogOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deleteAgent(id);

    setDeleteDialogOpen(false);
    router.refresh();

    if (result.success) {
      toast.success("Agent deleted successfully.");
    } else {
      toast.error(result.message ?? "Failed to delete agent.");
    }
  };

  const handleDemote = async () => {
    const result = await demoteAgentToUser(id);

    setDemoteDialogOpen(false);
    router.refresh();

    if (result.success) {
      toast.success("Agent has been demoted to user.");
    } else {
      toast.error(result.message ?? "Failed to demote agent.");
    }
  };

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
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/agents/${id}`)}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setDemoteDialogOpen(true)}>
            Demote to User
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={demoteDialogOpen} onOpenChange={setDemoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demote this agent?</AlertDialogTitle>
            <AlertDialogDescription>
              This agent will lose agent permissions and all assigned estates
              will be unassigned. You can promote them again later.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDemote}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Demote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this agent?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This agent and their associated data
              will be permanently removed.
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
