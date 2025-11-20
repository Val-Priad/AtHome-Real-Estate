"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/db/types";
import { getUserById } from "@/lib/actions/user/getUserById";
import Image from "next/image";
import { useEffect, useState } from "react";
import WriteToAgent from "./WriteToAgent";
import { EstateData } from "@/lib/actions/estate/getEstateById";

function AgentSection({ estateData }: { estateData: EstateData }) {
  const [agent, setAgent] = useState<User>();
  useEffect(() => {
    const getAgent = async () => {
      if (estateData?.estate.brokerId) {
        setAgent(await getUserById(estateData.estate.brokerId));
      }
    };
    getAgent();
  }, [estateData?.estate.brokerId]);
  return (
    <>
      <div className="flex gap-6">
        {agent?.image && (
          <Image
            src={agent?.image}
            alt="Agent"
            width={100}
            height={100}
            className="w-40"
          />
        )}
        <div className="space-y-2">
          <div className="font-bold">{agent?.name}</div>
          <div className="space-y-1">
            <a
              href={`mailto:${agent?.email}`}
              className="text-brand-6 block underline"
            >
              {agent?.email}
            </a>
            <a
              href={`tel:${agent?.phoneNumber}`}
              className="text-brand-6 block"
            >
              {agent?.phoneNumber}
            </a>
          </div>
          <a href="#description">
            <Button>Write to agent</Button>
          </a>
        </div>
      </div>

      <WriteToAgent
        agentEmail={agent?.email as string}
        estateId={estateData?.estate.id as number}
        estateTitle={estateData?.translation?.title as string}
      />
    </>
  );
}

export default AgentSection;
