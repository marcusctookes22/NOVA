import { getProduct, sizes } from "./catalog.ts";
import type { Size } from "./catalog.ts";

export const CART_KEY = "nova-demo-bag-v1";
export const MAX_QUANTITY = 99;
export interface CartLine {
  slug: string;
  size: Size;
  quantity: number;
}
export const lineKey = (line: Pick<CartLine, "slug" | "size">) =>
  `${line.slug}:${line.size}`;

/** Persist only product variants and counts. Ignore tampered/stale browser storage. */
export function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.slice(0, 100).reduce<CartLine[]>((cart, line: unknown) => {
      if (!line || typeof line !== "object") return cart;
      const entry = line as Record<string, unknown>;
      if (
        typeof entry.slug !== "string" ||
        !getProduct(entry.slug) ||
        !sizes.includes(entry.size as Size) ||
        typeof entry.quantity !== "number" ||
        !Number.isSafeInteger(entry.quantity) ||
        entry.quantity < 1
      )
        return cart;
      return addLine(cart, {
        slug: entry.slug,
        size: entry.size as Size,
        quantity: Math.min(entry.quantity, MAX_QUANTITY),
      });
    }, []);
  } catch {
    return [];
  }
}

export function addLine(cart: CartLine[], line: CartLine): CartLine[] {
  if (
    !getProduct(line.slug) ||
    !sizes.includes(line.size) ||
    !Number.isSafeInteger(line.quantity) ||
    line.quantity < 1
  )
    return cart;
  const existing = cart.find((item) => lineKey(item) === lineKey(line));
  if (!existing)
    return [
      ...cart,
      { ...line, quantity: Math.min(line.quantity, MAX_QUANTITY) },
    ];
  return cart.map((item) =>
    lineKey(item) === lineKey(line)
      ? {
          ...item,
          quantity: Math.min(item.quantity + line.quantity, MAX_QUANTITY),
        }
      : item,
  );
}

export function changeQuantity(
  cart: CartLine[],
  key: string,
  delta: number,
): CartLine[] {
  if (!Number.isSafeInteger(delta)) return cart;
  return cart
    .map((line) =>
      lineKey(line) === key
        ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + delta) }
        : line,
    )
    .filter((line) => line.quantity > 0);
}

export const cartCount = (cart: CartLine[]) =>
  cart.reduce((sum, line) => sum + line.quantity, 0);
export const cartSubtotal = (cart: CartLine[]) =>
  cart.reduce(
    (sum, line) => sum + (getProduct(line.slug)?.price ?? 0) * line.quantity,
    0,
  );

export function demoOrderNumber(random: number): string {
  return `NOVA-${String(Math.floor(100000 + Math.max(0, Math.min(random, 0.999999)) * 900000))}`;
}
