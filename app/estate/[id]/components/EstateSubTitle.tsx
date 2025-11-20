import { EstateData } from "@/lib/actions/estate/getEstateById";
import { generateEstateSubTitle } from "@/utils/generateEstateSubtitle";

function EstateSubTitle({ estateData }: { estateData: EstateData }) {
  const subtitle = generateEstateSubTitle(estateData!);
  return <h2 className="text-brand-5 text-xl font-semibold">{subtitle}</h2>;
}

export default EstateSubTitle;
