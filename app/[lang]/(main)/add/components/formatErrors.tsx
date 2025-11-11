type ErrorObject = Record<string, object>;

export function formatErrors(errors: ErrorObject) {
  const lines: string[] = [];

  function recurse(obj: object, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object") {
        if ("message" in value && typeof value.message === "string") {
          lines.push([...path, key].join(" → ") + ": " + value.message);
        } else {
          recurse(value, [...path, key]);
        }
      }
    }
  }

  recurse(errors);

  if (lines.length === 0) return "Unknown validation error";

  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </>
  );
}
