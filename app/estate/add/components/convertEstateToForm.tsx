// eslint-disable-next-line
export function convertEstateResponseToFormValues(server: any) {
  const estate = server.estate;
  const translation = server.translation;
  const apartment = server.apartment;
  const house = server.house;
  const media = server.media || [];
  const vicinity = server.vicinity || [];
  const ms = server.multiselect || {};

  // eslint-disable-next-line
  function extract(msArr: any[], key: string) {
    return msArr?.map((x) => x[key]) ?? [];
  }

  const multiselect = {
    estateHeatingSource: extract(ms.heatingSources, "heatingSource"),
    estateHeatingElement: extract(ms.heatingElements, "heatingElement"),
    estateWaterHeatSource: extract(ms.waterHeating, "waterHeating"),
    estateWater: extract(ms.water, "water"),
    estateElectricity: extract(ms.electricity, "electricity"),
    estateTelecommunication: extract(ms.telecommunication, "telecommunication"),
    estateInternetConnections: extract(ms.internet, "connectionType"),
  };

  // eslint-disable-next-line
  const vicinityRecord: Record<string, any[]> = {};

  for (const v of vicinity) {
    if (!vicinityRecord[v.type]) {
      vicinityRecord[v.type] = [];
    }
    vicinityRecord[v.type].push(v);
  }

  // eslint-disable-next-line
  const mediaForForm = media.map((m: any) => ({
    url: m.url,
    file: undefined, // no file when editing, only URL
    type: m.mediaType,
    alt: m.alt || "",
    isMain: m.isMain || false,
  }));

  // Your schema: translations.title.ua, translations.title.en
  const translations = {
    title: {
      ua: translation?.title || "",
      en: translation?.title || "",
    },
    description: {
      ua: translation?.description || "",
      en: translation?.description || "",
    },
  };

  const estateApartment = {
    flatClass: apartment?.flatClass || undefined,
    buildingType: apartment?.buildingType || undefined,
    apartmentPlan: apartment?.apartmentPlan || undefined,
    floorNumber: apartment?.floorNumber ?? undefined,
    balconyArea: apartment?.balconyArea ?? undefined,
    loggiaArea: apartment?.loggiaArea ?? undefined,
    terraceArea: apartment?.terraceArea ?? undefined,
    apartmentNumber: apartment?.apartmentNumber ?? undefined,
    garden: apartment?.garden ?? false,
    parking: apartment?.parking ?? false,
    elevator: apartment?.elevator ?? false,
  };

  const estateHouse = {
    houseCategory: house?.houseCategory ?? undefined,
    roomCount: house?.roomCount ?? undefined,
    houseType: house?.houseType ?? undefined,
    circuitBreaker: house?.circuitBreaker ?? undefined,
    phase: house?.phase ?? undefined,
    reconstructionYear: house?.reconstructionYear ?? undefined,
    acceptanceYear: house?.acceptanceYear ?? undefined,
    floors: house?.floors ?? undefined,
    undergroundFloors: house?.undergroundFloors ?? undefined,
    parkingLotsCount: house?.parkingLotsCount ?? undefined,
    gardenArea: house?.gardenArea ?? undefined,
    buildingArea: house?.buildingArea ?? undefined,
    pool: house?.pool ?? false,
    cellar: house?.cellar ?? false,
    garage: house?.garage ?? false,
    pvPanels: house?.pvPanels ?? false,
    solarWaterHeating: house?.solarWaterHeating ?? false,
  };

  const estateSchemaValues = {
    brokerId: estate.brokerId,
    category: estate.category,
    operationType: estate.operationType,
    buildingCondition: estate.buildingCondition,
    energyClass: estate.energyClass,
    roadType: estate.roadType,
    furnished: estate.furnished,
    priceUnit: estate.priceUnit,
    region: estate.region,

    usableArea: estate.usableArea ?? undefined,
    totalFloorArea: estate.totalFloorArea ?? undefined,
    price: Number(estate.price),
    costOfLiving: estate.costOfLiving ? Number(estate.costOfLiving) : undefined,
    commission: estate.commission ? Number(estate.commission) : undefined,
    refundableDeposit: estate.refundableDeposit
      ? Number(estate.refundableDeposit)
      : undefined,

    easyAccess: estate.easyAccess ?? false,
    commissionPaidByOwner: estate.commissionPaidByOwner ?? false,

    readyDate: new Date(estate.readyDate),
    advertLifetime: estate.advertLifetime,

    city: estate.city,
    street: estate.street,

    latitude: Number(estate.latitude),
    longitude: Number(estate.longitude),
  };

  return {
    estate: estateSchemaValues,
    estateApartment,
    estateHouse,
    multiselect,
    translations,
    media: mediaForForm,
    vicinity: vicinityRecord,
  };
}
