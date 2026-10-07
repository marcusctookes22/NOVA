import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { asset, filterProducts, getProduct } from "./catalog";
import type { Product as ProductData } from "./catalog";
import { cartCount } from "./cart";
import { useBag } from "./store";
import { Icon } from "./components/Icon";
import { Dialog } from "./components/Dialog";
import { BagDrawer } from "./components/BagDrawer";
import { QuickView } from "./components/QuickView";
import { OutfitDialog } from "./components/Outfits";
import type { SetTone } from "./components/Outfits";
import { ProductCard } from "./components/ProductCard";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { Product } from "./pages/Product";
import { Checkout } from "./pages/Checkout";
import { Lookbook } from "./pages/Lookbook";
import { About } from "./pages/About";

function RouteEffects() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const labels: Record<string, string> = {
      "/": "Drop 001",
      "/shop": "The collection",
      "/lookbook": "Lookbook 001",
      "/about": "Our world",
      "/checkout": "Demo checkout",
    };
    document.title = `NOVA — ${getProduct(pathname.split("/product/")[1] ?? "")?.name ?? labels[pathname] ?? "Off the grid"}`;
    if (previous.current !== pathname) {
      const frame = requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>("main h1")
          ?.focus({ preventScroll: true }),
      );
      previous.current = pathname;
      return () => cancelAnimationFrame(frame);
    }
  }, [pathname]);
  return null;
}

function Header({
  openBag,
  openSearch,
}: {
  openBag: () => void;
  openSearch: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(window.scrollY > 30);
  const { pathname } = useLocation();
  const { cart } = useBag();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div className="demo-strip">
        <span>NOVA // SYNTHETIC STOREFRONT</span>
        <span>NO REAL PURCHASES</span>
      </div>
      <header
        className={`site-header ${pathname === "/" && !scrolled ? "transparent" : ""}`}
      >
        <nav className="desktop-nav" aria-label="Main">
          <NavLink to="/shop">SHOP</NavLink>
          <Link to="/shop?category=ALL">DROP 001</Link>
          <NavLink to="/lookbook">LOOKBOOK</NavLink>
        </nav>
        <button
          className="icon-button mobile-menu-toggle"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
        >
          <Icon name="menu" />
        </button>
        <Link className="wordmark" to="/" aria-label="NOVA home">
          <img
            className="brand-logo"
            src={asset("images/brand/nova-embroidered-logo.webp")}
            alt=""
            width="64"
            height="64"
          />
        </Link>
        <div className="header-actions">
          <button className="header-search" onClick={openSearch}>
            <span>SEARCH</span>
            <Icon name="search" />
          </button>
          <button
            className="header-bag"
            onClick={openBag}
            aria-label={`Open bag, ${cartCount(cart)} items`}
          >
            <span>BAG ({cartCount(cart)})</span>
            <Icon name="bag" />
            <small aria-hidden="true">{cartCount(cart)}</small>
          </button>
        </div>
      </header>
      {menuOpen && (
        <Dialog
          title="NOVA"
          kind="mobile-navigation"
          onClose={() => setMenuOpen(false)}
        >
          <nav aria-label="Mobile">
            <Link to="/shop" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            <Link to="/shop?category=ALL" onClick={() => setMenuOpen(false)}>
              Drop 001
            </Link>
            <Link to="/lookbook" onClick={() => setMenuOpen(false)}>
              Lookbook
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              Our world
            </Link>
          </nav>
          <button
            className="mobile-search-link"
            onClick={() => {
              setMenuOpen(false);
              openSearch();
            }}
          >
            <Icon name="search" />
            SEARCH THE COLLECTION
          </button>
          <div className="mobile-navigation-footer">
            <span>NEW FORM. NEW ENERGY.</span>
            <span>DEMO STOREFRONT / NO REAL PURCHASES</span>
          </div>
        </Dialog>
      )}
    </>
  );
}

function Search({
  onClose,
  onQuickView,
}: {
  onClose: () => void;
  onQuickView: (product: ProductData) => void;
}) {
  const [query, setQuery] = useState("");
  const results = filterProducts("ALL", query);
  return (
    <Dialog title="SEARCH NOVA" kind="search-overlay" onClose={onClose}>
      <div className="search-body">
        <label className="sr-only" htmlFor="catalog-search">
          Search the collection
        </label>
        <div className="search-field">
          <Icon name="search" />
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pieces, colors, silhouettes"
            autoFocus
          />
        </div>
        <span className="search-result-count" aria-live="polite">
          {query ? `${results.length} RESULTS` : "EXPLORE DROP 001"}
        </span>
        <div
          className="search-results"
          onClick={(event) => {
            if ((event.target as Element).closest("a")) onClose();
          }}
        >
          {results.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              onQuickView={(item) => {
                onClose();
                onQuickView(item);
              }}
            />
          ))}
        </div>
        {!results.length && (
          <div className="search-empty">
            <h3>No pieces found.</h3>
            <p>Try “hoodie”, “bone”, or “sweatpants”.</p>
            <button className="text-link" onClick={() => setQuery("")}>
              CLEAR SEARCH
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="footer-wordmark" to="/" aria-label="NOVA home">
          <img
            className="footer-brand-logo"
            src={asset("images/brand/nova-embroidered-logo.webp")}
            alt=""
            width="300"
            height="300"
            loading="lazy"
          />
        </Link>
        <div>
          <span>
            DROP BY DROP.
            <br />
            NO NOISE. JUST NOVA.
          </span>
          <nav aria-label="Footer">
            <Link to="/shop">SHOP</Link>
            <Link to="/lookbook">LOOKBOOK</Link>
            <Link to="/about">ABOUT NOVA</Link>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NOVA</span>
        <span>SYNTHETIC STOREFRONT / NO REAL ORDERS</span>
        <span>NEW FORM. NEW ENERGY.</span>
      </div>
    </footer>
  );
}

export function App() {
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<ProductData>();
  const [setTone, setSetTone] = useState<SetTone>();
  const location = useLocation();
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        SKIP TO CONTENT
      </a>
      <RouteEffects />
      <Header
        openBag={() => setBagOpen(true)}
        openSearch={() => setSearchOpen(true)}
      />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route
            path="/"
            element={<Home onQuickView={setQuickView} onSet={setSetTone} />}
          />
          <Route
            path="/shop"
            element={<Shop onQuickView={setQuickView} onSet={setSetTone} />}
          />
          <Route
            path="/product/:slug"
            element={
              <Product
                openBag={() => setBagOpen(true)}
                onQuickView={setQuickView}
              />
            }
          />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="*"
            element={
              <div className="page-shell route-empty">
                <span className="eyebrow">NOVA // OFF THE GRID</span>
                <h1 tabIndex={-1}>Wrong frequency.</h1>
                <Link className="button" to="/">
                  BACK TO NOVA
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      {bagOpen && <BagDrawer onClose={() => setBagOpen(false)} />}
      {searchOpen && (
        <Search
          key={location.pathname}
          onClose={() => setSearchOpen(false)}
          onQuickView={setQuickView}
        />
      )}
      {quickView && (
        <QuickView
          product={quickView}
          onClose={() => setQuickView(undefined)}
          openBag={() => setBagOpen(true)}
        />
      )}
      {setTone && (
        <OutfitDialog
          tone={setTone}
          onClose={() => setSetTone(undefined)}
          openBag={() => setBagOpen(true)}
        />
      )}
    </>
  );
}
