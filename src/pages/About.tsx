import { Link } from "react-router-dom";
import { asset } from "../catalog";

export function About() {
  return (
    <div className="about page-shell">
      <span className="eyebrow">NOVA // OUR WORLD</span>
      <h1 tabIndex={-1}>
        A form of
        <br />
        <span className="outline-type">your own.</span>
      </h1>
      <div className="about-body">
        <div className="about-image">
          <img
            src={asset("images/lookbook/campaign-02.webp")}
            alt="Model wearing a gray NOVA monogram tracksuit in the city"
            width="1000"
            height="1250"
          />
          <span>INDIVIDUALITY / CONTROLLED CHAOS</span>
        </div>
        <div className="about-copy">
          <p>
            NOVA exists at the intersection of streetwear, individuality and
            controlled chaos.
          </p>
          <p>
            We build pieces for people who were never interested in blending in.
          </p>
          <div className="about-manifesto">
            DROP BY DROP.
            <br />
            NO NOISE.
            <br />
            JUST NOVA.
          </div>
          <Link className="text-link" to="/shop">
            ENTER DROP 001
          </Link>
          <p className="about-demo-note">
            This is a synthetic fashion storefront. The collection, bag,
            newsletter, and checkout are demonstrations. No products are sold or
            shipped. Images are AI-generated visuals inspired by NOVA product
            references; final production details may differ.
          </p>
        </div>
      </div>
    </div>
  );
}
