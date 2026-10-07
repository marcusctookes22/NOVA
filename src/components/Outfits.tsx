import { useState } from "react";
import { asset, getProduct, money } from "../catalog";
import type { Size } from "../catalog";
import { useBag } from "../store";
import { Dialog } from "./Dialog";
import { SizeSelector } from "./SizeSelector";

export type SetTone = "black" | "bone";
export function SetCard({
  tone,
  onSelect,
}: {
  tone: SetTone;
  onSelect: (tone: SetTone) => void;
}) {
  return (
    <article className="set-card">
      <div className="set-card-image">
        <img
          src={asset(`images/lookbook/drop-001-set-${tone}.webp`)}
          alt={`Coordinated ${tone} NOVA lightning hoodie and sweatpants set`}
          width="1000"
          height="1250"
          loading="lazy"
        />
        <span className="eyebrow">02 PIECES / ONE ENERGY</span>
      </div>
      <div className="set-card-info">
        <div>
          <h3>NOVA Drop 001 Set</h3>
          <p>HOODIE + SWEATPANTS / {tone.toUpperCase()}</p>
        </div>
        <span>{money(138)}</span>
      </div>
      <button className="text-link" onClick={() => onSelect(tone)}>
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
  const hoodie = getProduct(`no-spells-given-hoodie-${tone}`)!;
  const pants = getProduct(`nova-drop-001-sweatpants-${tone}`)!;
  const { dispatch } = useBag();
  return (
    <Dialog title="BUILD YOUR SET" kind="set-dialog" onClose={onClose}>
      <div className="set-dialog-body">
        <span className="eyebrow">NOVA DROP 001 / {tone.toUpperCase()}</span>
        <h3>
          Two pieces.
          <br />
          One expression.
        </h3>
        <p>{money(hoodie.price + pants.price)} / Hoodie + sweatpants</p>
        <h4>01 — NO SPELLS GIVEN HOODIE</h4>
        <SizeSelector
          value={hoodieSize}
          error={error && !hoodieSize}
          onChange={setHoodieSize}
        />
        <h4>02 — DROP 001 SWEATPANTS</h4>
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
