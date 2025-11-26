"use client";

import { Button } from "@/components/ui/button";
import {
  addToSaved,
  isInSaved,
  removeFromSaved,
} from "@/lib/actions/estate/savedEstate";
import { useState, useEffect } from "react";
import { IoBookmarks } from "react-icons/io5";

type WishlistButtonProps = {
  estateId: number;
};

export default function WishlistButton({ estateId }: WishlistButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSaved() {
      try {
        const inWishlist = await isInSaved(estateId);
        setSaved(inWishlist);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    checkSaved();
  }, [estateId]);

  async function toggleWishlist() {
    setLoading(true);
    try {
      if (saved) {
        await removeFromSaved(estateId);
        setSaved(false);
      } else {
        await addToSaved(estateId);
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={toggleWishlist}
      disabled={loading}
      variant="secondary"
      className={saved ? "text-brand-6" : ""}
    >
      <IoBookmarks className="mr-2" />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
