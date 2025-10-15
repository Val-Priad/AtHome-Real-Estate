function Button({
  children,
  type,
  icon,
  icon_position,
}: Readonly<{
  children: React.ReactNode;
  type: string;
  icon?: React.ReactElement;
  icon_position?: "left" | "right";
}>) {
  let buttonStyle = "";
  switch (type) {
    case "main":
      buttonStyle = "";
      break;
  }
  return (
    <button
      className={
        "border-brand-6 flex w-40 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-stone-50 py-1 shadow-md shadow-red-950/50 duration-300 hover:-translate-y-1 hover:bg-stone-100 2xl:w-50 2xl:gap-3 2xl:py-3"
      }
    >
      {icon_position === "left" ? icon : ""}
      <span>{children}</span>
      {icon_position === "right" ? icon : ""}
    </button>
  );
}

export default Button;
