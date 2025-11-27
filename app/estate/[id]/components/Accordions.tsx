import { Accordion } from "@/components/ui/accordion";
import AccordionSection from "./AccordionSection";
import { EstateData } from "@/lib/actions/estate/getEstateById";

export function Accordions({ estateData }: { estateData: EstateData }) {
  if (!estateData) return null;

  const e = estateData.estate;

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      <AccordionSection
        title="General Information"
        fields={[
          ["Category", estateData.estate.category],
          ["Operation Type", estateData.estate.operationType],
          ["Building Condition", estateData.estate.buildingCondition],
          ["Energy Class", estateData.estate.energyClass],
          ["Usable Area", `${estateData.estate.usableArea ?? "-"} m²`],
          ["Total Floor Area", `${estateData.estate.totalFloorArea ?? "-"} m²`],
          ["Furnished", estateData.estate.furnished],
          ["Easy Access", estateData.estate.easyAccess ? "Yes" : "No"],
          ["Road Type", estateData.estate.roadType],
        ]}
      />

      <AccordionSection
        title="Pricing & Costs"
        fields={[
          ["Price", `${e.price} ₴)} (${e.priceUnit})`],
          ["Cost of Living", `${e.costOfLiving ?? "-"} ₴`],
          ["Commission", `${e.commission ?? "-"} ₴`],
          ["Commission Paid by Owner", e.commissionPaidByOwner ? "Yes" : "No"],
          ["Refundable Deposit", `${e.refundableDeposit ?? "-"} ₴`],
        ]}
      />

      {e.category === "Apartment" && estateData.apartment && (
        <AccordionSection
          title="Apartment Details"
          fields={[
            ["Flat Class", estateData.apartment.flatClass],
            ["Building Type", estateData.apartment.buildingType],
            ["Apartment Plan", estateData.apartment.apartmentPlan],
            ["Floor Number", estateData.apartment.floorNumber],
            ["Apartment Number", estateData.apartment.apartmentNumber],
            ["Garden", estateData.apartment.garden ? "Yes" : "No"],
            ["Parking", estateData.apartment.parking ? "Yes" : "No"],
            ["Elevator", estateData.apartment.elevator ? "Yes" : "No"],
            ["Balcony Area", `${estateData.apartment.balconyArea ?? "-"} m²`],
            ["Loggia Area", `${estateData.apartment.loggiaArea ?? "-"} m²`],
            ["Terrace Area", `${estateData.apartment.terraceArea ?? "-"} m²`],
          ]}
        />
      )}

      {e.category === "House" && estateData.house && (
        <AccordionSection
          title="House Details"
          fields={[
            ["House Category", estateData.house.houseCategory],
            ["Room Count", estateData.house.roomCount],
            ["House Type", estateData.house.houseType],
            ["Reconstruction Year", estateData.house.reconstructionYear ?? "-"],
            ["Acceptance Year", estateData.house.acceptanceYear ?? "-"],
            ["Floors", estateData.house.floors ?? "-"],
            ["Underground Floors", estateData.house.undergroundFloors ?? "-"],
            ["Parking Lots Count", estateData.house.parkingLotsCount ?? "-"],
            ["Garden Area", `${estateData.house.gardenArea ?? "-"} m²`],
            ["Building Area", `${estateData.house.buildingArea ?? "-"} m²`],
            ["Circuit Breaker", estateData.house.circuitBreaker],
            ["Phase", estateData.house.phase],
            ["Pool", estateData.house.pool ? "Yes" : "No"],
            ["Cellar", estateData.house.cellar ? "Yes" : "No"],
            ["Garage", estateData.house.garage ? "Yes" : "No"],
            ["PV Panels", estateData.house.pvPanels ? "Yes" : "No"],
            [
              "Solar Water Heating",
              estateData.house.solarWaterHeating ? "Yes" : "No",
            ],
          ]}
        />
      )}

      <AccordionSection
        title="Engineering & Utilities"
        fields={[
          [
            "Heating Sources",
            estateData.multiselect.heatingSources
              .map((x) => x.heatingSource)
              .join(", ") || "-",
          ],
          [
            "Heating Elements",
            estateData.multiselect.heatingElements
              .map((x) => x.heatingElement)
              .join(", ") || "-",
          ],
          [
            "Water Heating",
            estateData.multiselect.waterHeating
              .map((x) => x.waterHeatSource)
              .join(", ") || "-",
          ],
          [
            "Water",
            estateData.multiselect.water.map((x) => x.water).join(", ") || "-",
          ],
          [
            "Electricity",
            estateData.multiselect.electricity
              .map((x) => x.electricity)
              .join(", ") || "-",
          ],
          [
            "Telecommunication",
            estateData.multiselect.telecommunication
              .map((x) => x.telecommunication)
              .join(", ") || "-",
          ],
          [
            "Internet",
            estateData.multiselect.internet
              .map((x) => x.connectionType)
              .join(", ") || "-",
          ],
        ]}
      />

      <AccordionSection
        title="Location"
        fields={[
          ["City", e.city],
          ["Street", e.street],
          ["Region", e.region],
        ]}
      />
    </Accordion>
  );
}
