"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AgentActions } from "./agentActions";

export type AgentRow = {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  image: string | null;
  estatesCount: number;
};

export const columns: ColumnDef<AgentRow>[] = [
  {
    accessorKey: "image",
    header: "Photo",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const url = row.getValue("image") as string | null;

      return (
        <div className="h-14 w-14 overflow-hidden rounded bg-gray-200">
          {url ? (
            <Image
              src={url}
              alt="agent"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Name",
    sortingFn: "alphanumeric",
  },

  {
    accessorKey: "email",
    header: "Email",
    sortingFn: "alphanumeric",
  },

  {
    accessorKey: "phoneNumber",
    header: "Phone",
    sortingFn: "alphanumeric",
    cell: ({ row }) => row.getValue("phoneNumber") || "-",
  },

  {
    accessorKey: "estatesCount",
    header: "Listings",
    sortingFn: "basic",
    cell: ({ row }) => {
      const count = row.getValue("estatesCount") as number;
      return <Badge className="bg-blue-600">{count}</Badge>;
    },
  },

  {
    id: "actions",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => <AgentActions id={row.original.id} />,
  },
];
