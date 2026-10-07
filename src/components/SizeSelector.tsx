import { sizes } from "../catalog";
import type { Size } from "../catalog";
import { useId } from "react";

export function SizeSelector({
  value,
  onChange,
  error,
}: {
  value?: Size;
  onChange: (size: Size) => void;
  error?: boolean;
}) {
  const id = useId();
  return (
    <fieldset
      className="size-fieldset"
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend>SELECT SIZE</legend>
      <div className="sizes">
        {sizes.map((size) => (
          <label key={size} className={value === size ? "selected" : ""}>
            <input
              type="radio"
              name={id}
              value={size}
              checked={value === size}
              onChange={() => onChange(size)}
            />
            <span>{size}</span>
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="form-error" id={`${id}-error`}>
          Select a size to add this piece.
        </p>
      )}
    </fieldset>
  );
}
