export default function range(size: number) {
  return Array(size)
    .fill(null)
    .map((_, i) => i);
}
