import { useState } from "react";
import { Link } from "react-router-dom";
import { asset, outfits, products } from "../catalog";
import type { Product } from "../catalog";
import { ProductCard } from "../components/ProductCard";
import { SetCard } from "../components/Outfits";
import type { SetTone } from "../components/Outfits";

export function Newsletter() {
  const [joined, setJoined] = useState(false);
  return (
    <section className="newsletter">
      <div>
        <span className="eyebrow">STAY IN OUR ORBIT</span>
        <h2>
          Enter the
          <br />
          NOVA world.
        </h2>
      </div>
      <div className="newsletter-form">
        {joined ? (
          <div className="newsletter-success" role="status">
            <span className="eyebrow">YOU'RE IN.</span>
            <p>Demo complete. Your email wasn’t saved or sent.</p>
            <button className="text-link" onClick={() => setJoined(false)}>
              TRY AGAIN
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.currentTarget.reset();
              setJoined(true);
            }}
          >
            <label htmlFor="newsletter-email">EMAIL ADDRESS</label>
            <div className="newsletter-input">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                required
                autoComplete="off"
              />
              <button type="submit">JOIN</button>
            </div>
            <p>A little NOVA. No noise. Demo signup only.</p>
          </form>
        )}
      </div>
    </section>
  );
}

export function Home({
  onQuickView,
  onSet,
}: {
  onQuickView: (product: Product) => void;
  onSet: (tone: SetTone) => void;
}) {
  return (
    <div className="home">
      <section className="hero">
        <img
          className="hero-image"
          src={asset("images/brand/drop-001-campaign.webp")}
          alt="Two models wearing black and bone NOVA sets in an industrial courtyard"
          width="1800"
          height="1200"
          fetchPriority="high"
        />
        <div className="hero-topline">
          <span>NOVA // DROP 001</span>
          <span>AN EXERCISE IN INDIVIDUALITY</span>
        </div>
        <div className="hero-copy">
          <h1 tabIndex={-1}>
            New form.
            <br />
            <span>New energy.</span>
          </h1>
          <p>MADE FOR THE ONES WHO DON'T BLEND IN.</p>
          <div className="hero-actions">
            <Link className="button button-light" to="/shop">
              SHOP THE DROP
            </Link>
            <Link className="text-link light" to="/lookbook">
              VIEW LOOKBOOK
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <span>COLLECTION 001 / NOVA</span>
          <span>NEW FORM. NEW ENERGY.</span>
          <span>SCROLL TO EXPLORE</span>
        </div>
      </section>
      <section className="section featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE FIRST EXPRESSION</span>
            <h2>
              DROP <span className="outline-type">001</span>
            </h2>
          </div>
          <Link className="text-link" to="/shop">
            EXPLORE THE COLLECTION
          </Link>
        </div>
        <div className="product-grid">
          {[products[0], products[1], products[2], products[4]].map(
            (product) => (
              <ProductCard
                key={product.slug}
                product={product}
                onQuickView={onQuickView}
              />
            ),
          )}
        </div>
      </section>
      <section className="feature-story">
        <div className="feature-image">
          <img
            src={asset("images/lookbook/no-spells-editorial.webp")}
            alt="The white gothic back graphic on the black No Spells Given Hoodie"
            width="1000"
            height="1250"
            loading="lazy"
          />
          <span>01 / THE STATEMENT PIECE</span>
        </div>
        <div className="feature-copy">
          <span className="eyebrow">CONTROLLED CHAOS</span>
          <h2>
            No spells
            <br />
            given.
          </h2>
          <p>Heavyweight Oversized Hoodie</p>
          <div className="feature-meta">
            <span>BLACK / WHITE</span>
            <span>$74.00</span>
          </div>
          <Link
            className="button button-light"
            to="/product/no-spells-given-hoodie-black"
          >
            DISCOVER THE PIECE
          </Link>
          <span className="feature-footnote">
            OVERSIZED FORM. UNMISTAKABLY NOVA.
          </span>
        </div>
      </section>
      <section className="campaign-statement">
        <span className="eyebrow">A NEW FREQUENCY</span>
        <h2>
          NEW FORM.
          <br />
          <span>NEW ENERGY.</span>
          <br />
          NOVA.
        </h2>
        <div>
          <span>DROP BY DROP.</span>
          <span>NO NOISE. JUST NOVA.</span>
        </div>
      </section>
      <section className="section sets-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">COMPLETE THE FORM</span>
            <h2>In sync.</h2>
          </div>
          <span className="muted">NOVA DROP 001 SETS</span>
        </div>
        <div className="sets-grid">
          {outfits.map((outfit) => (
            <SetCard key={outfit.tone} tone={outfit.tone} onSelect={onSet} />
          ))}
        </div>
      </section>
      <section className="lookbook-preview">
        <div className="lookbook-preview-head">
          <span className="eyebrow">NOVA // IN MOTION</span>
          <h2>
            Beyond
            <br />
            the ordinary.
          </h2>
          <Link className="text-link light" to="/lookbook">
            ENTER LOOKBOOK
          </Link>
        </div>
        <div className="lookbook-preview-image">
          <img
            src={asset("images/lookbook/campaign-02.webp")}
            alt="Model in a gray NOVA monogram tracksuit beside an industrial shutter"
            width="1000"
            height="1250"
            loading="lazy"
          />
        </div>
        <span className="lookbook-side-caption">
          A STUDY IN FORM / DROP 001
        </span>
      </section>
      <Newsletter />
    </div>
  );
}
