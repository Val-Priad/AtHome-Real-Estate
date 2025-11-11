export function haversineDistance(
  latFrom: number,
  lonFrom: number,
  latTo: number,
  lonTo: number,
) {
  const toRadians = (angle: number) => (angle * Math.PI) / 180;
  const R = 6371000;
  const φ1 = toRadians(latFrom);
  const φ2 = toRadians(latTo);
  const Δφ = toRadians(latTo - latFrom);
  const Δλ = toRadians(lonTo - lonFrom);
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  const d = R * c;
  return d;
}
