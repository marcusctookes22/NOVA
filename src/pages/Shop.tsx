import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, filterProducts, outfits } from "../catalog";
import type { Category, Product } from "../catalog";
import { Dialog } from "../components/Dialog";
import { ProductCard } from "../components/ProductCard";
import { SetCard } from "../components/Outfits";
import type { SetTone } from "../components/Outfits";

export function Shop({
  onQuickView,
  onSet,
}: {
  onQuickView: (product: Product) => void;
  onSet: (tone: SetTone) => void;
}) {
  const [params, setParams] = useSearchParams();
  const paramCategory = params.get("category") as Category;
  const category = categories.includes(paramCategory) ? paramCategory : "ALL";
  const [tone, setTone] = useState("all");
  const [sort, setSort] = useState("editorial");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filteredSets = outfits.filter(
    (outfit) => tone === "all" || outfit.tone === tone,
  );
  const filtered = filterProducts(category, "", tone);
  const sorted = [...filtered].sort((a, b) =>
    sort === "low"
      ? a.price - b.price
      : sort === "high"
        ? b.price - a.price
        : 0,
  );
  const changeCategory = (next: Category) =>
    setParams(next === "ALL" ? {} : { category: next });
  const filterFields = (
    <>
      <label className="filter-select">
        COLOR
        <select value={tone} onChange={(event) => setTone(event.target.value)}>
          <option value="all">All colors</option>
          <option value="black">Black</option>
          <option value="bone">Bone</option>
          <option value="white">White</option>
          <option value="gray">Heather Gray</option>
        </select>
      </label>
      <label className="filter-select">
        SORT BY
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="editorial">Editorial order</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </label>
    </>
  );
  return (
    <div className="shop page-shell">
      <header className="catalog-heading">
        <span className="eyebrow">NOVA // THE COLLECTION</span>
        <h1 tabIndex={-1}>
          DROP <span className="outline-type">001</span>
        </h1>
        <div>
          <p>Heavyweight silhouettes. A lighter kind of noise.</p>
          <span>SYNTHETIC CATALOG / NO REAL INVENTORY</span>
        </div>
      </header>
      <div className="catalog-controls">
        <div className="category-tabs" aria-label="Product categories">
          {categories.map((item) => (
            <button
              key={item}
              aria-pressed={item === category}
              className={item === category ? "active" : ""}
              onClick={() => changeCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button className="filter-toggle" onClick={() => setFiltersOpen(true)}>
          FILTER / SORT
        </button>
        <div className="desktop-filters">{filterFields}</div>
      </div>
      <div className="catalog-count" aria-live="polite">
        {category === "SETS"
          ? `${filteredSets.length} ${filteredSets.length === 1 ? "SET" : "SETS"}`
          : `${sorted.length} PIECES`}
        <span>DROP 001 / ALL PRICES USD</span>
      </div>
      {category === "SETS" ? (
        <div className="sets-grid">
          {filteredSets.map((outfit) => (
            <SetCard key={outfit.tone} tone={outfit.tone} onSelect={onSet} />
          ))}
        </div>
      ) : sorted.length ? (
        <div className="product-grid shop-grid">
          {sorted.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <h2>No pieces in this view.</h2>
          <button
            className="text-link"
            onClick={() => {
              changeCategory("ALL");
              setTone("all");
            }}
          >
            RESET FILTERS
          </button>
        </div>
      )}
      {filtersOpen && (
        <Dialog
          title="FILTER / SORT"
          kind="filter-sheet"
          onClose={() => setFiltersOpen(false)}
        >
          <div className="filter-sheet-body">
            <fieldset>
              <legend>CATEGORY</legend>
              {categories.map((item) => (
                <button
                  className={item === category ? "active" : ""}
                  key={item}
                  onClick={() => changeCategory(item)}
                  aria-pressed={item === category}
                >
                  {item}
                </button>
              ))}
            </fieldset>
            {filterFields}
            <button className="button" onClick={() => setFiltersOpen(false)}>
              SHOW RESULTS
            </button>
            <button
              className="text-link"
              onClick={() => {
                changeCategory("ALL");
                setTone("all");
                setSort("editorial");
              }}
            >
              RESET FILTERS
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
