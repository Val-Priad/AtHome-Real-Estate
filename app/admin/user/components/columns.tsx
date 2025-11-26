"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { UserActions } from "./UserActions";

export type UserRow = {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  description: string | null;
  image: string | null;
  createdAt: Date;
};

export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "image",
    header: "Photo",
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.getValue("image") as string | null;

      return (
        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
          {url ? (
            <Image
              src={url}
              width={48}
              height={48}
              alt="photo"
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
    cell: ({ row }) =>
      row.getValue("name") || <span className="text-gray-500">No name</span>,
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => row.getValue("phoneNumber") ?? "-",
  },

  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-GB");
    },
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => <UserActions id={row.original.id} />,
  },
];
