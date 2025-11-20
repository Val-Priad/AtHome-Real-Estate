"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./PhotoGallery.module.css";

export type EstateMedia = {
  id: number;
  estateId: number;
  url: string;
  mediaType: string;
  alt: string | null;
  isMain: boolean | null;
  createdAt: Date | null;
};

interface Props {
  photos: EstateMedia[];
}

export default function PhotoGallery({ photos }: Props) {
  const sorted = [...photos].sort(
    (a, b) => Number(b.isMain) - Number(a.isMain),
  );

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openModal = (index: number) => setCurrentIndex(index);
  const closeModal = () => setCurrentIndex(null);

  const nextPhoto = useCallback(
    () =>
      setCurrentIndex((prev) =>
        prev !== null ? (prev + 1) % sorted.length : null,
      ),
    [sorted.length],
  );

  const prevPhoto = useCallback(
    () =>
      setCurrentIndex((prev) =>
        prev !== null ? (prev - 1 + sorted.length) % sorted.length : null,
      ),
    [sorted.length],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, nextPhoto, prevPhoto]);

  const renderCustomLayout = () => (
    <div className="mx-auto grid max-w-[1400px] grid-cols-10 grid-rows-[repeat(3,200px)] gap-2 p-4">
      {sorted.slice(0, 5).map((p, index) => (
        <div
          key={p.id}
          onClick={() => openModal(sorted.indexOf(p))}
          className={[
            "relative cursor-pointer overflow-hidden rounded-lg bg-gray-300",
            index === 0
              ? "col-span-4 row-span-3"
              : index === 1
                ? "col-start-5 col-end-8 row-span-2"
                : index === 2
                  ? "col-start-5 col-end-8 row-start-3"
                  : index === 3
                    ? "col-start-8 col-end-11"
                    : "col-start-8 col-end-11 row-span-2 row-start-2",
          ].join(" ")}
        >
          <Image src={p.url} alt={p.alt || ""} fill className="object-cover" />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {renderCustomLayout()}
      {currentIndex !== null && (
        <div
          className={`${styles.animateFadeIn} fixed inset-0 z-50 flex items-center justify-center bg-black/90`}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-10 text-5xl text-white transition hover:scale-110"
          >
            &times;
          </button>

          <button
            onClick={prevPhoto}
            className="absolute top-1/2 left-4 -translate-y-1/2 rounded bg-white/10 px-5 py-4 text-4xl text-white transition hover:bg-white/20"
          >
            &#10094;
          </button>

          <button
            onClick={nextPhoto}
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded bg-white/10 px-5 py-4 text-4xl text-white transition hover:bg-white/20"
          >
            &#10095;
          </button>

          <div
            className={`${styles.animateZoomIn} relative h-[70vh] max-h-[800px] w-[80vw] max-w-[1000px]`}
          >
            <Image
              src={sorted[currentIndex].url}
              alt={sorted[currentIndex].alt || ""}
              fill
              className="rounded-lg object-contain"
            />
          </div>

          <div className="absolute bottom-10 rounded-full bg-black/40 px-5 py-2 text-sm text-white">
            {currentIndex + 1} / {sorted.length}
          </div>
        </div>
      )}
    </>
  );
}
