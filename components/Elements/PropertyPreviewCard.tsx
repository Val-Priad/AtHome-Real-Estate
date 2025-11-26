import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EstatePreview } from "@/lib/actions/estate/searchEstate";

interface Props {
  property: EstatePreview;
}

const PropertyPreviewCard: React.FC<Props> = ({ property: estate }) => {
  const getPropertyTitle = () => {
    return `${estate.offer_type} ${estate.property_type} ${
      estate.usable_area ? `${estate.usable_area} m²` : ""
    }`;
  };

  return (
    <div className="group min-w-67.5 overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/estate/${estate.id}`}>
        <div className="relative aspect-4/3 overflow-hidden">
          {estate.image ? (
            <Image
              src={estate.image}
              alt={estate.address}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-300 to-stone-50 text-gray-600">
              No photo
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
        </div>

        <div className="p-4">
          <h3 className="mb-1.5 text-base font-normal text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
            {getPropertyTitle()}
          </h3>

          <p className="mb-3 text-base text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
            {estate.address}
          </p>

          <p className="text-2xl font-semibold text-gray-900 transition-transform duration-300 group-hover:scale-[1.03]">
            {estate.price.toLocaleString("en-US")} ₴
          </p>
        </div>
      </Link>
    </div>
  );
};

export default PropertyPreviewCard;
