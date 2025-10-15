function Section({
  children,
  sectionName,
}: Readonly<{
  children: React.ReactNode;
  sectionName: string;
  labelKey?: string;
}>) {
  return (
    <fieldset>
      <label htmlFor="" className="mt-3 mb-1 block font-bold">
        {sectionName}
      </label>
      {children}
    </fieldset>
  );
}

export default Section;
