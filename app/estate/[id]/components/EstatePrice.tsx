import { EstateData } from "@/lib/actions/estate/getEstateById";
import { getCurrencySign } from "@/utils/getCurrencySign";

function EstatePrice({ estateData }: { estateData: EstateData }) {
  return (
    <span className="text-brand-9 text-xl">
      {estateData?.estate.price} {getCurrencySign(estateData!.estate.currency)}{" "}
      ({estateData?.estate.priceUnit})
    </span>
  );
}

export default EstatePrice;
