import { useState } from "react";
import { Link } from "react-router-dom";
import { asset, money } from "../catalog";
import type { Product, Size } from "../catalog";
import { useBag } from "../store";
import { Dialog } from "./Dialog";
import { SizeSelector } from "./SizeSelector";

export function QuickView({
  product,
  onClose,
  openBag,
}: {
  product: Product;
  onClose: () => void;
  openBag: () => void;
}) {
  const [size, setSize] = useState<Size>();
  const [error, setError] = useState(false);
  const { dispatch } = useBag();
  return (
    <Dialog title="QUICK VIEW" kind="quick-view" onClose={onClose}>
      <div className="quick-view-layout">
        <img
          src={asset(product.images[0])}
          alt={`${product.name}, ${product.color}`}
          width="800"
          height="1000"
        />
        <div className="quick-view-info">
          <span className="eyebrow">NOVA // DROP 001</span>
          <h3>{product.name}</h3>
          <p>{money(product.price)}</p>
          <p className="muted">{product.color}</p>
          <SizeSelector
            value={size}
            error={error}
            onChange={(next) => {
              setSize(next);
              setError(false);
            }}
          />
          <button
            className="button"
            onClick={() => {
              if (!size) {
                setError(true);
                return;
              }
              dispatch({
                type: "add",
                lines: [{ slug: product.slug, size, quantity: 1 }],
              });
              onClose();
              openBag();
            }}
          >
            ADD TO BAG
          </button>
          <Link
            className="text-link"
            to={`/product/${product.slug}`}
            onClick={onClose}
          >
            VIEW FULL DETAILS
          </Link>
          <span className="demo-caption">
            SYNTHETIC CATALOG / NO REAL INVENTORY
          </span>
        </div>
      </div>
    </Dialog>
  );
}
