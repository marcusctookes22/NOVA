import { useState } from "react";
import { asset, getProduct, money, outfits } from "../catalog";
import type { SetTone, Size } from "../catalog";
import { useBag } from "../store";
import { Dialog } from "./Dialog";
import { SizeSelector } from "./SizeSelector";

export type { SetTone } from "../catalog";
export function SetCard({
  tone,
  onSelect,
}: {
  tone: SetTone;
  onSelect: (tone: SetTone) => void;
}) {
  const outfit = outfits.find((item) => item.tone === tone)!;
  const hoodie = getProduct(outfit.hoodieSlug)!;
  const pants = getProduct(outfit.pantsSlug)!;
  return (
    <article className={`set-card ${tone}`}>
      <div className="set-card-image">
        <img
          src={asset(outfit.image)}
          alt={outfit.alt}
          width="1000"
          height="1250"
          loading="lazy"
        />
        <span className="eyebrow">02 PIECES / ONE ENERGY</span>
      </div>
      <div className="set-card-info">
        <div>
          <h3>{outfit.name}</h3>
          <p>HOODIE + SWEATPANTS / {outfit.color.toUpperCase()}</p>
        </div>
        <span>{money(hoodie.price + pants.price)}</span>
      </div>
      <button
        className="text-link"
        aria-label={`Build your set: ${outfit.name}, ${outfit.color}`}
        onClick={() => onSelect(tone)}
      >
        BUILD YOUR SET
      </button>
    </article>
  );
}

export function OutfitDialog({
  tone,
  onClose,
  openBag,
}: {
  tone: SetTone;
  onClose: () => void;
  openBag: () => void;
}) {
  const [hoodieSize, setHoodieSize] = useState<Size>();
  const [pantsSize, setPantsSize] = useState<Size>();
  const [error, setError] = useState(false);
  const outfit = outfits.find((item) => item.tone === tone)!;
  const hoodie = getProduct(outfit.hoodieSlug)!;
  const pants = getProduct(outfit.pantsSlug)!;
  const { dispatch } = useBag();
  return (
    <Dialog title="BUILD YOUR SET" kind="set-dialog" onClose={onClose}>
      <div className="set-dialog-body">
        <span className="eyebrow">
          {outfit.name.toUpperCase()} / {outfit.color.toUpperCase()}
        </span>
        <h3>
          Two pieces.
          <br />
          One expression.
        </h3>
        <p>{money(hoodie.price + pants.price)} / Hoodie + sweatpants</p>
        <h4>01 — {hoodie.name.toUpperCase()}</h4>
        <SizeSelector
          value={hoodieSize}
          error={error && !hoodieSize}
          onChange={setHoodieSize}
        />
        <h4>02 — {pants.name.toUpperCase()}</h4>
        <SizeSelector
          value={pantsSize}
          error={error && !pantsSize}
          onChange={setPantsSize}
        />
        <button
          className="button"
          onClick={() => {
            if (!hoodieSize || !pantsSize) {
              setError(true);
              return;
            }
            dispatch({
              type: "add",
              lines: [
                { slug: hoodie.slug, size: hoodieSize, quantity: 1 },
                { slug: pants.slug, size: pantsSize, quantity: 1 },
              ],
            });
            onClose();
            openBag();
          }}
        >
          ADD SET TO BAG
        </button>
        <span className="demo-caption">
          SYNTHETIC CATALOG / NO REAL INVENTORY
        </span>
      </div>
    </Dialog>
  );
}
