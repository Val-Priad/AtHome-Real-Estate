import { useEffect, useRef, useState } from "react";
import { REGIONS } from "./regions";

export default function Map({
  fieldValue,
  onChange,
}: Readonly<{
  fieldValue: string[];
  onChange: (updated: string[]) => void;
}>) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.setAttribute("xmlns:mapsvg", "http://mapsvg.com");
    svg.setAttribute("xmlns:dc", "http://purl.org/dc/elements/1.1/");
    svg.setAttribute(
      "xmlns:rdf",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    );
    svg.setAttribute("xmlns:svg", "http://www.w3.org/2000/svg");
    svg.setAttribute(
      "mapsvg:geoViewBox",
      "22.138577 52.380834 40.220623 44.387017",
    );
  }, []);

  function toggleRegion(title: string) {
    const updated = fieldValue.includes(title)
      ? fieldValue.filter((v) => v !== title)
      : [...fieldValue, title];

    onChange(updated);
  }

  return (
    <div className="flex items-center justify-center">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 612.47321 408.0199"
        className="h-auto w-3/4"
      >
        {REGIONS.map((region) => {
          const isActive = fieldValue.includes(region.title);
          const isHovered = hovered === region.title;

          return (
            <path
              key={region.id}
              id={region.id}
              d={region.d}
              data-title={region.title}
              fill={
                isActive
                  ? "hsla(358, 44.6%, 51.2%, 1)"
                  : isHovered
                    ? "hsla(358, 44.6%, 74.5%, 1)"
                    : "#e0e0e0"
              }
              stroke="#333"
              strokeWidth={0.8}
              className="cursor-pointer transition-colors duration-150"
              onClick={() => toggleRegion(region.title)}
              onMouseEnter={() => setHovered(region.title)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>
    </div>
  );
}
