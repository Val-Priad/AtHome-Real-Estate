type ZodFieldErrors = Record<string, string[] | undefined>;

export function formatErrors(errors: ZodFieldErrors) {
  const lines: string[] = [];

  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages)) {
      for (const m of messages) {
        lines.push(`${field}: ${m}`);
      }
    }
  }

  if (lines.length === 0) return <>Unknown validation error</>;

  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </>
  );
}
