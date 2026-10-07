import { Link } from "react-router-dom";
import { asset, familyColors, money } from "../catalog";
import type { Product } from "../catalog";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (product: Product) => void;
}) {
  return (
    <article className="product-card">
      <div className={`product-card-media ${product.tone}`}>
        <Link
          to={`/product/${product.slug}`}
          className="product-image-link"
          aria-label={`${product.name}, ${product.color}`}
        >
          <img
            className="card-primary"
            src={asset(product.images[0])}
            alt={`${product.name}, ${product.color}, front view`}
            loading="lazy"
            width="800"
            height="1000"
          />
          <img
            className="card-secondary"
            src={asset(product.images[1])}
            alt=""
            loading="lazy"
            width="800"
            height="1000"
          />
        </Link>
        <span className="product-edition">DROP 001</span>
        <button
          className="quick-add"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view ${product.name}, ${product.color}`}
        >
          QUICK VIEW <span aria-hidden="true">+</span>
        </button>
      </div>
      <div className="product-card-info">
        <Link to={`/product/${product.slug}`}>{product.name}</Link>
        <span>{money(product.price)}</span>
        <span className="product-color">{product.color}</span>
        <div className="swatches" aria-label="Available colors">
          {familyColors(product).map((color) => (
            <Link
              key={color.slug}
              to={`/product/${color.slug}`}
              className={`swatch ${color.tone} ${color.slug === product.slug ? "selected" : ""}`}
              aria-label={`${color.name}, ${color.color}`}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
