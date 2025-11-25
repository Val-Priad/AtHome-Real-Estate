import { User } from "@/db/types";
import Image from "next/image";

function AgentHeader({ agent }: { agent: User }) {
  return (
    <>
      <div className="space-y-3">
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
          <div className="flex flex-col justify-center gap-2">
            <div className="font-bold">{agent?.name}</div>
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
        </div>
        <h1 className="text-brand-9 text-xl font-semibold">About Agent</h1>
        <div>{agent.description}</div>
      </div>
    </>
  );
}

export default AgentHeader;
