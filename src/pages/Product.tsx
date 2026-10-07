import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { asset, familyColors, getProduct, money, products } from "../catalog";
import type { Product as ProductData, Size } from "../catalog";
import { useBag } from "../store";
import { SizeSelector } from "../components/SizeSelector";
import { ProductCard } from "../components/ProductCard";

export function Product({
  openBag,
  onQuickView,
}: {
  openBag: () => void;
  onQuickView: (product: ProductData) => void;
}) {
  const { slug } = useParams();
  const product = getProduct(slug ?? "");
  return product ? (
    <ProductDetail
      key={product.slug}
      product={product}
      openBag={openBag}
      onQuickView={onQuickView}
    />
  ) : (
    <div className="page-shell route-empty">
      <span className="eyebrow">NOVA // OFF THE GRID</span>
      <h1 tabIndex={-1}>Piece not found.</h1>
      <Link className="button" to="/shop">
        BACK TO THE COLLECTION
      </Link>
    </div>
  );
}

function ProductDetail({
  product,
  openBag,
  onQuickView,
}: {
  product: ProductData;
  openBag: () => void;
  onQuickView: (product: ProductData) => void;
}) {
  const [size, setSize] = useState<Size>();
  const [view, setView] = useState(0);
  const [error, setError] = useState(false);
  const { dispatch } = useBag();
  const add = () => {
    if (!size) {
      setError(true);
      document
        .querySelector<HTMLInputElement>('.product-info input[type="radio"]')
        ?.focus();
      return;
    }
    dispatch({
      type: "add",
      lines: [{ slug: product.slug, size, quantity: 1 }],
    });
    openBag();
  };
  const recommendations = products
    .filter(
      (item) => item.slug !== product.slug && item.family !== product.family,
    )
    .slice(0, 3);
  return (
    <div className="product-page page-shell">
      <div className="breadcrumb">
        <Link to="/shop">DROP 001</Link>
        <span>/</span>
        <span>{product.type.toUpperCase()}</span>
      </div>
      <div className="product-detail">
        <div className="product-gallery">
          <div className="gallery-main">
            <img
              key={view}
              src={asset(product.images[view])}
              alt={`${product.name}, ${product.color}, ${product.images[view].includes("back") ? "back" : product.images[view].includes("detail") ? "detail" : "front"} view`}
              width="800"
              height="1000"
              fetchPriority="high"
            />
            <span className="gallery-counter">
              0{view + 1} / 0{product.images.length}
            </span>
          </div>
          <div className="gallery-thumbnails" aria-label="Product gallery">
            {product.images.map((image, index) => (
              <button
                key={image}
                className={view === index ? "selected" : ""}
                onClick={() => setView(index)}
                aria-label={`Show ${index === 0 ? "front" : image.includes("back") ? "back" : "detail"} image`}
                aria-pressed={view === index}
              >
                <img src={asset(image)} alt="" width="80" height="100" />
              </button>
            ))}
          </div>
          <div className="gallery-note">
            <span>NOVA // DROP 001</span>
            <span>AI-GENERATED PRODUCT VISUAL</span>
          </div>
        </div>
        <div className="product-info">
          <span className="eyebrow">NOVA</span>
          <h1 tabIndex={-1}>{product.name}</h1>
          <p className="product-price">{money(product.price)}</p>
          <div className="product-color-choice">
            <span className="eyebrow">
              COLOR — {product.color.toUpperCase()}
            </span>
            <div className="color-choices">
              {familyColors(product).map((color) => (
                <Link
                  key={color.slug}
                  to={`/product/${color.slug}`}
                  aria-label={`Choose ${color.color}`}
                  aria-current={
                    color.slug === product.slug ? "page" : undefined
                  }
                  className={`color-choice ${color.slug === product.slug ? "selected" : ""}`}
                >
                  <span className={`swatch ${color.tone}`} />
                  {color.color}
                </Link>
              ))}
            </div>
          </div>
          <SizeSelector
            value={size}
            error={error}
            onChange={(next) => {
              setSize(next);
              setError(false);
            }}
          />
          <button className="button add-to-bag" onClick={add}>
            ADD TO BAG <span>{money(product.price)}</span>
          </button>
          <span className="demo-caption">
            SYNTHETIC CATALOG / NO REAL INVENTORY
          </span>
          <div className="fit-note">
            <span className="eyebrow">MODEL / FIT NOTES</span>
            <p>Oversized fit. For a standard fit, size down.</p>
            <p className="muted">
              Model measurements will be added with campaign photography.
            </p>
          </div>
          <div className="product-accordions">
            {[
              ["DETAILS", product.description],
              [
                "FIT",
                product.type === "Hoodie"
                  ? "Dropped shoulders, generous body, and an oversized hood. Designed for a relaxed silhouette."
                  : "Relaxed through the leg with an elasticated waist. Designed to sit comfortably at the hip.",
              ],
              [
                "MATERIAL",
                "Heavyweight cotton-blend fleece. Synthetic product specification; final composition and fabric weight are pending.",
              ],
              [
                "SHIPPING",
                "This is a demo storefront. No products will ship. Delivery choices in checkout are simulated.",
              ],
              [
                "CARE",
                "Demo care guidance: wash cold with similar colors, inside out. Air dry. Do not iron directly over graphics. Confirm against the final garment label.",
              ],
            ].map(([title, content]) => (
              <details key={title}>
                <summary>
                  {title}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{content}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <section className="product-recommendations">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A SHARED FREQUENCY</span>
            <h2>Wear it with.</h2>
          </div>
          <Link className="text-link" to="/shop">
            VIEW ALL PIECES
          </Link>
        </div>
        <div className="product-grid recommendation-grid">
          {recommendations.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>
      <div className="mobile-add">
        <div>
          <span>{product.name}</span>
          <small>
            {size ? `SIZE ${size} / ${product.color}` : "SELECT YOUR SIZE"}
          </small>
        </div>
        <button className="button" onClick={add}>
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}
