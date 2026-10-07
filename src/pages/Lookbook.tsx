import { Link } from "react-router-dom";
import { asset } from "../catalog";

const frames: Record<string, { path: string; description: string }> = {
  "campaign-01": {
    path: "brand/drop-001-campaign",
    description: "Two models in black and bone NOVA sets in an industrial courtyard",
  },
  "campaign-02": {
    path: "lookbook/campaign-02",
    description: "Model in a gray NOVA monogram zip-up tracksuit beside a shutter",
  },
  "campaign-03": {
    path: "lookbook/campaign-03",
    description: "Two models wearing white and bone NOVA sets in a concrete stairwell",
  },
  "campaign-04": {
    path: "lookbook/no-spells-editorial",
    description: "Model showing the gothic back graphic on a black NOVA hoodie",
  },
  "graphic-detail": {
    path: "lookbook/graphic-detail",
    description: "Black embroidered NOVA monogram and wordmark on heather gray fleece",
  },
};

function Frame({
  name,
  caption,
  className = "",
}: {
  name: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={`lookbook-frame ${className}`}>
      <img
        src={asset(`images/${frames[name].path}.webp`)}
        alt={frames[name].description}
        width="1000"
        height="1250"
        loading="lazy"
      />
      <figcaption>
        <span>{caption}</span>
        <span>DROP 001</span>
      </figcaption>
    </figure>
  );
}

export function Lookbook() {
  return (
    <div className="lookbook page-shell">
      <header className="lookbook-heading">
        <span className="eyebrow">NOVA // A STUDY IN FORM</span>
        <h1 tabIndex={-1}>
          Off the
          <br />
          <span className="outline-type">grid.</span>
        </h1>
        <div>
          <p>Individuality, in motion.</p>
          <span>LOOKBOOK 001 / NEW FORM. NEW ENERGY.</span>
        </div>
      </header>
      <Frame
        name="campaign-01"
        caption="01 / NEW FORM"
        className="full-bleed"
      />
      <div className="lookbook-pair">
        <Frame name="campaign-02" caption="02 / CONTROLLED CHAOS" />
        <Frame name="campaign-03" caption="03 / A DIFFERENT FREQUENCY" />
      </div>
      <blockquote>
        Made for the ones
        <br />
        who don't <em>blend in.</em>
      </blockquote>
      <div className="lookbook-collage">
        <Frame name="campaign-04" caption="04 / NEW ENERGY" />
        <div>
          <span className="eyebrow">THE DETAILS ARE THE DIFFERENCE.</span>
          <Frame name="graphic-detail" caption="05 / THE STATEMENT" />
        </div>
      </div>
      <div className="lookbook-end">
        <span className="eyebrow">END OF STUDY / BEGINNING OF SOMETHING</span>
        <h2>Find your form.</h2>
        <Link className="button button-light" to="/shop">
          EXPLORE DROP 001
        </Link>
      </div>
    </div>
  );
}
