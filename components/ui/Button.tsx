import { TPropertyType } from "@/app/(main)/search/page";

function Button({
  children,
  type,
  icon,
  icon_position,
  forPropertyType,
  curPropertyType,
  onClick,
}: Readonly<{
  children: React.ReactNode;
  type: string;
  icon?: React.ReactElement;
  icon_position?: "left" | "right";
  forPropertyType?: TPropertyType;
  curPropertyType?: TPropertyType;
  onClick?: () => void;
}>) {
  let buttonStyle =
    "border-brand-6 flex w-40 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-stone-50 py-1 shadow-md shadow-red-950/50 duration-300 hover:-translate-y-1 hover:bg-stone-100 2xl:w-50 2xl:gap-3 2xl:py-3";
  switch (type) {
    case "main":
      buttonStyle = "";
      break;
    case "search-checkbox-btn":
      buttonStyle = `flex-1 cursor-pointer rounded-md transition-colors duration-400 ${forPropertyType === curPropertyType ? "hover:bg-brand-5 bg-brand-5 shadow-brand-9/50 text-white shadow-md" : "text-brand-10 bg-red-100 hover:bg-white"}
      $`;
  }
  return (
    <button onClick={onClick} className={buttonStyle}>
      {icon_position === "left" ? icon : ""}
      <span>{children}</span>
      {icon_position === "right" ? icon : ""}
    </button>
  );
}

export default Button;
