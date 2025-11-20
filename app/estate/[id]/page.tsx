import { getEstateById } from "@/lib/actions/estate/getEstateById";
import PhotoGallery from "./components/PhotoGallery";
import EstateSubTitle from "./components/EstateSubTitle";
import EstatePrice from "./components/EstatePrice";
import WishlistButton from "./components/WishListButton";
import ShareButton from "./components/ShareButton";
import EnergyLabel from "./components/EnergyLabel";
import { formatDate } from "@/utils/formatDate";
import { Accordions } from "./components/Accordions";
import ClientVicinity from "./components/ClientVicinity";
import MapEmbed from "./components/IFrameMap";
import AgentSection from "./components/AgentSection";
import WriteToAgent from "./components/WriteToAgent";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const parameters = await params;
  const data = await getEstateById(Number(parameters.id));

  if (!data) {
    return null;
  }

  return (
    <main>
      <PhotoGallery photos={data.media} />
      <div className="flex justify-center">
        <div className="max-w-[1000px] space-y-8 rounded-3xl bg-red-50 p-8">
          <div className="space-y-2">
            <EstateSubTitle estateData={data} />
            <div>
              <div className="space-x-3">
                <EstatePrice estateData={data} />
                <WishlistButton estateId={data.estate.id} />
                <ShareButton />
              </div>
              <EnergyLabel energyLabel={data.estate.energyClass} />
            </div>
          </div>
          <div className="space-x-2">
            <span className="font-bold">{data.translation?.title}</span>
            <span className="block">{data.translation?.description}</span>
          </div>
          <div className="flex justify-end gap-3">
            <span>
              Inserted:{" "}
              <span className="font-bold">
                {" "}
                {formatDate(data.estate.createdAt)}{" "}
              </span>
            </span>
            <span>
              Last Edited:{" "}
              <span className="font-bold">
                {" "}
                {formatDate(data.estate.updatedAt)}{" "}
              </span>
            </span>
            <span>
              Ready to Move in:{" "}
              <span className="font-bold">
                {" "}
                {formatDate(data.estate.readyDate)}{" "}
              </span>
            </span>
          </div>
          <Accordions estateData={data} />
          <MapEmbed
            latitude={data.estate.latitude}
            longitude={data.estate.longitude}
          />
          <ClientVicinity estateData={data} />
          <AgentSection estateData={data} />
        </div>
      </div>
    </main>
  );
}
