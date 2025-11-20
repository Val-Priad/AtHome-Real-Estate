function Field({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  return (
    <p className="border-brand-6 flex justify-between border-b-2 p-1">
      {label}: <strong>{value ?? "-"} </strong>
    </p>
  );
}

export default Field;
