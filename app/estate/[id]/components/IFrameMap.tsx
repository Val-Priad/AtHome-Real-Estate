"use client";

type MapEmbedProps = {
  latitude: number;
  longitude: number;
};

export default function MapEmbed({ latitude, longitude }: MapEmbedProps) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.001}%2C${latitude - 0.001}%2C${longitude + 0.001}%2C${latitude + 0.001}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className="h-80 w-full overflow-hidden rounded-lg shadow-lg md:h-96">
      <iframe
        title="OpenStreetMap"
        src={src}
        className="h-full w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
