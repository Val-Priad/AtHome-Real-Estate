"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { EstateActions } from "./EstateActions";

export type EstateRow = {
  id: number;
  photo: string | null;
  title: string;
  category: string;
  operationType: string;
  price: number;
  usableArea: number | null;
  region: string;
  agentName: string;
  agentId: string | null;
  createdAt: Date;
  expiresAt: Date;
  status: string | null;
};

function getStatusBadge(status: string) {
  if (status === "Active")
    return <Badge className="bg-green-600">Active</Badge>;
  if (status === "Expiring")
    return <Badge className="bg-yellow-500">Expiring</Badge>;
  if (status === "Expired")
    return <Badge className="bg-red-600">Expired</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

export const columns: ColumnDef<EstateRow>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const url = row.getValue("photo") as string | null;

      return (
        <div className="h-14 w-14 overflow-hidden rounded bg-gray-200">
          {url ? (
            <Image
              src={url}
              width={56}
              height={56}
              alt="estate"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      );
    },
  },

  {
    accessorKey: "id",
    header: "ID",
    sortingFn: "basic",
    cell: ({ row }) => (
      <span className="font-medium">#{row.getValue("id")}</span>
    ),
  },

  {
    accessorKey: "title",
    header: "Title",
    sortingFn: "alphanumeric",
  },

  {
    accessorKey: "category",
    header: "Category",
    sortingFn: "alphanumeric",
  },

  {
    accessorKey: "operationType",
    header: "Operation",
    sortingFn: "alphanumeric",
  },

  {
    accessorKey: "price",
    header: "Price",
    sortingFn: "basic",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return "₴" + price.toLocaleString("uk-UA");
    },
  },

  {
    accessorKey: "usableArea",
    header: "Area",
    sortingFn: "basic",
    cell: ({ row }) => {
      const v = row.getValue("usableArea") as number | null;
      return v ? `${v} m²` : "";
    },
  },

  {
    accessorKey: "region",
    header: "Region",
    sortingFn: "alphanumeric",
  },

  {
    accessorKey: "agentName",
    header: "Agent",
    sortingFn: "alphanumeric",
  },

  {
    accessorKey: "expiresAt",
    header: "Expires",
    sortingFn: "datetime",
    cell: ({ row }) => {
      const raw = row.getValue("expiresAt");
      if (!raw) return "";
      const d = new Date(raw as string);
      return isNaN(d.getTime()) ? "" : format(d, "dd.MM.yyyy");
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    sortingFn: "alphanumeric",
    cell: ({ row }) => getStatusBadge(row.getValue("status") as string),
  },

  {
    id: "actions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const id = row.original.id;
      return <EstateActions id={id} />;
    },
  },
];
