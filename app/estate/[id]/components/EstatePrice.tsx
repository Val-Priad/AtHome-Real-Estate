import { EstateData } from "@/lib/actions/estate/getEstateById";

function EstatePrice({ estateData }: { estateData: EstateData }) {
  return (
    <span className="text-brand-9 text-xl">
      {estateData?.estate.price} ₴ ({estateData?.estate.priceUnit})
    </span>
  );
}

export default EstatePrice;
