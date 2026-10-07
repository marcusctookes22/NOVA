import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { addLine, CART_KEY, changeQuantity, lineKey, parseCart } from "./cart";
import type { CartLine } from "./cart";

type Action =
  | { type: "add"; lines: CartLine[] }
  | { type: "quantity"; key: string; delta: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

function reduceCart(cart: CartLine[], action: Action) {
  switch (action.type) {
    case "add":
      return action.lines.reduce(addLine, cart);
    case "quantity":
      return changeQuantity(cart, action.key, action.delta);
    case "remove":
      return cart.filter((line) => lineKey(line) !== action.key);
    case "clear":
      return [];
  }
}

const BagContext = createContext<{
  cart: CartLine[];
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function BagProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(reduceCart, [], () => {
    try {
      return parseCart(localStorage.getItem(CART_KEY));
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // Browsers with storage disabled can still use the bag for this page session.
    }
  }, [cart]);
  return (
    <BagContext.Provider value={{ cart, dispatch }}>
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error("BagProvider is required");
  return context;
}
