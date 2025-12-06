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

  const renderCustomLayout = () => {
    const count = sorted.length;
    const firstFive = sorted.slice(0, 5);

    // ---------- ONE ----------
    if (count === 1) {
      return (
        <div className="mx-auto max-w-[900px] p-4">
          <div
            className="relative h-[300px] w-full cursor-pointer overflow-hidden rounded-lg sm:h-[400px] md:h-[500px]"
            onClick={() => openModal(0)}
          >
            <Image
              src={sorted[0].url}
              alt={sorted[0].alt || ""}
              fill
              className="object-cover"
            />
          </div>
        </div>
      );
    }

    // ---------- TWO ----------
    if (count === 2) {
      return (
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          {sorted.map((p, i) => (
            <div
              key={p.id}
              className="relative h-[250px] cursor-pointer overflow-hidden rounded-lg sm:h-[300px] md:h-[350px]"
              onClick={() => openModal(i)}
            >
              <Image
                src={p.url}
                alt={p.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );
    }

    // ---------- THREE ----------
    if (count === 3) {
      return (
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2">
          <div
            className="relative h-[250px] cursor-pointer overflow-hidden rounded-lg sm:h-[300px] md:col-span-2 md:row-span-2 md:h-full"
            onClick={() => openModal(0)}
          >
            <Image
              src={sorted[0].url}
              alt={sorted[0].alt || ""}
              fill
              className="object-cover"
            />
          </div>

          {sorted.slice(1, 3).map((p, i) => (
            <div
              key={p.id}
              className="relative h-[200px] cursor-pointer overflow-hidden rounded-lg sm:h-[250px] md:h-[250px]"
              onClick={() => openModal(i + 1)}
            >
              <Image
                src={p.url}
                alt={p.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );
    }

    // ---------- FOUR ----------
    if (count === 4) {
      return (
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2">
          <div
            className="relative h-[250px] cursor-pointer overflow-hidden rounded-lg sm:h-[300px] md:h-full lg:col-span-2 lg:row-span-2"
            onClick={() => openModal(0)}
          >
            <Image
              src={sorted[0].url}
              alt={sorted[0].alt || ""}
              fill
              className="object-cover"
            />
          </div>

          {sorted.slice(1, 4).map((p, i) => (
            <div
              key={p.id}
              className="relative h-[200px] cursor-pointer overflow-hidden rounded-lg sm:h-[250px] md:h-[250px]"
              onClick={() => openModal(i + 1)}
            >
              <Image
                src={p.url}
                alt={p.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );
    }

    // ---------- FIVE OR MORE ----------
    if (count >= 5) {
      return (
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-2 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-10 lg:grid-rows-[repeat(3,200px)]">
          {firstFive.map((p, index) => (
            <div
              key={p.id}
              onClick={() => openModal(sorted.indexOf(p))}
              className={[
                "relative min-h-[200px] cursor-pointer overflow-hidden rounded-lg bg-gray-300",
                index === 0
                  ? "lg:col-span-4 lg:row-span-3"
                  : index === 1
                    ? "lg:col-start-5 lg:col-end-8 lg:row-span-2"
                    : index === 2
                      ? "lg:col-start-5 lg:col-end-8 lg:row-start-3"
                      : index === 3
                        ? "lg:col-start-8 lg:col-end-11"
                        : "lg:col-start-8 lg:col-end-11 lg:row-span-2 lg:row-start-2",
              ].join(" ")}
            >
              <Image
                src={p.url}
                alt={p.alt || ""}
                fill
                className="object-cover"
              />

              {count > 5 && index === 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-3xl font-semibold text-white backdrop-blur-sm">
                  +{count - 5}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

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
