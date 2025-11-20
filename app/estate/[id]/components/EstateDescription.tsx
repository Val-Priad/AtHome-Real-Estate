import { ReactNode } from "react";

function EstateDescription({ children }: { children: Readonly<ReactNode> }) {
  return (
    <div className="h-dvh w-[1000px] space-y-5 rounded-3xl bg-red-50 p-8">
      {children}
    </div>
  );
}

export default EstateDescription;
