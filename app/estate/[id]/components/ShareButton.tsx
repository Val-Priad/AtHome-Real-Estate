"use client";
import { IoShareSocial } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <Button variant="secondary" onClick={handleShare}>
      <IoShareSocial className="mr-2" />
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}
