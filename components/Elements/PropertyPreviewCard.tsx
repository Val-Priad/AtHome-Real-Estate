import React from "react";

const PropertyPreviewCard: React.FC<{
  property: {
    id: number;
    property_type: string;
    floor_plan?: string;
    house_size?: string;
    usable_area: number;
    offer_type: string;
    price: number;
    address: string;
  };
}> = ({ property }) => {
  const getPropertyTitle = () => {
    const offerText = property.offer_type === "sale" ? "Sale" : "Lease";
    const planText =
      property.property_type === "apartment"
        ? property.floor_plan
        : property.house_size;

    return `${offerText} of ${property.property_type} ${planText ?? ""} ${property.usable_area} m²`;
  };

  return (
    // TODO better hover effect
    <div className="min-w-67.5 overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-200">
        {/* <img
          src="https://d18-a.sdn.cz/d_18/c_img_oe_A/kBlLbSfl8C2TnDZFEjXlR6/ac1f.jpeg?fl=res,800,600,3%7Cshr,,20%7Cwebp,60"
          alt={property.address}
          className="h-full w-full object-cover"
        /> */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-400 to-stone-50"></div>
      </div>

      <div className="p-4">
        <h3 className="mb-1.5 text-base font-normal text-gray-700">
          {getPropertyTitle()}
        </h3>

        <p className="mb-3 text-base text-gray-600">{property.address}</p>

        <p className="text-2xl font-semibold text-gray-900">
          {property.price} $
        </p>
      </div>
    </div>
  );
};

export default PropertyPreviewCard;
