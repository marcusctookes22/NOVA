import assert from "node:assert/strict";
import test from "node:test";
import {
  addLine,
  cartCount,
  cartSubtotal,
  changeQuantity,
  demoOrderNumber,
  lineKey,
  MAX_QUANTITY,
  parseCart,
} from "../src/cart.ts";
import type { CartLine } from "../src/cart.ts";
const black: CartLine = {
  slug: "no-spells-given-hoodie-black",
  size: "M",
  quantity: 1,
};

test("same variant merges quantities without mutating the original bag", () => {
  const original = [black];
  const result = addLine(original, black);
  assert.equal(result.length, 1);
  assert.equal(result[0].quantity, 2);
  assert.equal(original[0].quantity, 1);
});
test("different sizes and colors remain distinct line items", () => {
  const bag = addLine(addLine([black], { ...black, size: "L" }), {
    ...black,
    slug: "no-spells-given-hoodie-bone",
  });
  assert.equal(bag.length, 3);
  assert.equal(cartCount(bag), 3);
});
test("decrementing the final unit removes the item", () => {
  assert.deepEqual(changeQuantity([black], lineKey(black), -1), []);
});
test("quantity is capped and invalid additions are rejected", () => {
  assert.equal(
    addLine([black], { ...black, quantity: 9999 })[0].quantity,
    MAX_QUANTITY,
  );
  assert.deepEqual(addLine([black], { ...black, quantity: NaN }), [black]);
  assert.deepEqual(changeQuantity([black], lineKey(black), Infinity), [black]);
});
test("malformed storage and unknown products cannot enter the bag", () => {
  for (const raw of [
    null,
    "{",
    "null",
    "{}",
    JSON.stringify([{ ...black, slug: "missing" }]),
    JSON.stringify([{ ...black, size: "XXS" }]),
    JSON.stringify([{ ...black, quantity: 0 }]),
    JSON.stringify([{ ...black, quantity: 1.5 }]),
  ])
    assert.deepEqual(parseCart(raw), []);
});
test("storage hydration merges duplicates, caps counts, and strips all unrelated fields", () => {
  const raw = JSON.stringify([
    { ...black, email: "never-save@example.com", card: "4242" },
    { ...black, quantity: 999 },
  ]);
  const hydrated = parseCart(raw);
  assert.deepEqual(hydrated, [{ ...black, quantity: 99 }]);
  assert(!JSON.stringify(hydrated).includes("email"));
  assert(!JSON.stringify(hydrated).includes("card"));
});
test("subtotal derives current catalog prices, never stored prices", () => {
  const pants: CartLine = {
    slug: "nova-drop-001-sweatpants-black",
    size: "L",
    quantity: 2,
  };
  assert.equal(cartSubtotal([black, pants]), 202);
  assert.equal(cartSubtotal([]), 0);
});
test("a saved bag survives a serialization round trip", () => {
  assert.deepEqual(parseCart(JSON.stringify([black])), [black]);
});
test("demo order identifiers are always six digits in the expected range", () => {
  for (const value of [0, 0.1, 0.999999, 1, -1])
    assert.match(demoOrderNumber(value), /^NOVA-[1-9][0-9]{5}$/);
});
