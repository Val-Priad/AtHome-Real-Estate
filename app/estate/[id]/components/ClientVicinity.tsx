"use client";
import VicinityTabs from "@/components/Elements/VicinityTabs";
import { EstateData } from "@/lib/actions/estate/getEstateById";
import { groupPlaces } from "@/utils/groupPlaces";
import { useState } from "react";

function ClientVicinity({ estateData }: { estateData: EstateData }) {
  const [tabVicinityValue, setTabVicinityValue] = useState("Closest");

  return (
    <>
      <VicinityTabs
        vicinity={groupPlaces(estateData?.vicinity ?? [])}
        tabValue={tabVicinityValue}
        onTabChange={setTabVicinityValue}
      />
    </>
  );
}

export default ClientVicinity;
