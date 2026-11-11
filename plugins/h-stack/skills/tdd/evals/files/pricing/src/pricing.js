export function subtotal(lines) {
  return lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0);
}
