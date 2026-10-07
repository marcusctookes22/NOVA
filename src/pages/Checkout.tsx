import { useState } from "react";
import { Link } from "react-router-dom";
import { asset, getProduct, money } from "../catalog";
import { cartCount, cartSubtotal, demoOrderNumber, lineKey } from "../cart";
import { useBag } from "../store";

export function Checkout() {
  const { cart, dispatch } = useBag();
  const [delivery, setDelivery] = useState("standard");
  const [receipt, setReceipt] = useState<{
    order: string;
    total: number;
    count: number;
  }>();
  const subtotal = cartSubtotal(cart);
  const shipping = delivery === "express" ? 12 : 0;
  if (receipt)
    return (
      <div className="page-shell demo-success">
        <span className="eyebrow">NOVA // SIMULATION COMPLETE</span>
        <h1 tabIndex={-1}>
          Good energy.
          <br />
          Demo complete.
        </h1>
        <div className="receipt">
          <span>DEMO ORDER</span>
          <strong>{receipt.order}</strong>
          <div>
            <span>{receipt.count} PIECES / SIMULATED TOTAL</span>
            <span>{money(receipt.total)}</span>
          </div>
        </div>
        <p>
          No payment was processed. No order was submitted, email sent, or
          personal information saved. Your demo bag has been cleared.
        </p>
        <Link className="button" to="/shop">
          BACK TO DROP 001
        </Link>
      </div>
    );
  if (!cart.length)
    return (
      <div className="page-shell route-empty">
        <span className="eyebrow">NOVA // DEMO CHECKOUT</span>
        <h1 tabIndex={-1}>
          Your bag
          <br />
          is empty.
        </h1>
        <p>Add a piece to explore the checkout simulation.</p>
        <Link className="button" to="/shop">
          EXPLORE THE COLLECTION
        </Link>
      </div>
    );
  return (
    <div className="checkout page-shell">
      <header className="checkout-heading">
        <span className="eyebrow">NOVA // CHECKOUT SIMULATION</span>
        <h1 tabIndex={-1}>
          Make it
          <br />
          your own.
        </h1>
        <p>Use fictional information. Nothing leaves this page.</p>
      </header>
      <div className="checkout-layout">
        <form
          className="checkout-form"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            if (!event.currentTarget.reportValidity()) return;
            const random =
              crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
            setReceipt({
              order: demoOrderNumber(random),
              total: subtotal + shipping,
              count: cartCount(cart),
            });
            event.currentTarget.reset();
            dispatch({ type: "clear" });
            window.scrollTo(0, 0);
            requestAnimationFrame(() =>
              document.querySelector<HTMLElement>("main h1")?.focus(),
            );
          }}
        >
          <section className="checkout-section">
            <h2>
              <span>01</span>Contact
            </h2>
            <label>
              Email address
              <input
                type="email"
                name="demo-email"
                placeholder="you@example.com"
                required
                maxLength={100}
              />
            </label>
          </section>
          <section className="checkout-section">
            <h2>
              <span>02</span>Shipping address
            </h2>
            <div className="form-row">
              <label>
                First name
                <input name="demo-first" required maxLength={60} />
              </label>
              <label>
                Last name
                <input name="demo-last" required maxLength={60} />
              </label>
            </div>
            <label>
              Address
              <input name="demo-address" required maxLength={160} />
            </label>
            <label>
              Apartment, suite, etc. (optional)
              <input name="demo-apartment" maxLength={80} />
            </label>
            <div className="form-row">
              <label>
                City
                <input name="demo-city" required maxLength={80} />
              </label>
              <label>
                Postal code
                <input name="demo-postal" required maxLength={16} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Country
                <select name="demo-country" required defaultValue="US">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </label>
              <label>
                State / province / region
                <input name="demo-region" required maxLength={80} />
              </label>
            </div>
          </section>
          <section className="checkout-section">
            <h2>
              <span>03</span>Delivery method
            </h2>
            <fieldset className="delivery-options">
              <legend className="sr-only">Choose simulated delivery</legend>
              <label>
                <input
                  type="radio"
                  name="demo-delivery"
                  value="standard"
                  checked={delivery === "standard"}
                  onChange={() => setDelivery("standard")}
                />
                <span>
                  Standard demo delivery
                  <small>Simulated / nothing will ship</small>
                </span>
                <strong>FREE</strong>
              </label>
              <label>
                <input
                  type="radio"
                  name="demo-delivery"
                  value="express"
                  checked={delivery === "express"}
                  onChange={() => setDelivery("express")}
                />
                <span>
                  Express demo delivery
                  <small>Simulated / nothing will ship</small>
                </span>
                <strong>$12.00</strong>
              </label>
            </fieldset>
          </section>
          <section className="checkout-section">
            <h2>
              <span>04</span>Payment simulation
            </h2>
            <p className="payment-note">
              Fictional fields only. Use the supplied demo card number; do not
              enter a real card.
            </p>
            <label>
              Demo card number
              <input
                name="demo-card"
                inputMode="numeric"
                defaultValue="4242 4242 4242 4242"
                pattern="4242 ?4242 ?4242 ?4242"
                title="Use the fictional card number 4242 4242 4242 4242"
                required
              />
            </label>
            <div className="form-row">
              <label>
                Demo expiration
                <input
                  name="demo-expiration"
                  defaultValue="12/99"
                  placeholder="MM/YY"
                  pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                  required
                  title="Use MM/YY, for example 12/99"
                />
              </label>
              <label>
                Demo security code
                <input
                  name="demo-code"
                  inputMode="numeric"
                  defaultValue="000"
                  pattern="000"
                  required
                  title="Use the fictional security code 000"
                />
              </label>
            </div>
          </section>
          <div className="checkout-demo-banner">
            <strong>DEMO CHECKOUT — NO PAYMENT WILL BE PROCESSED</strong>
            <p>No real order. No stored contact or payment details.</p>
          </div>
          <button className="button place-order" type="submit">
            PLACE DEMO ORDER <span>{money(subtotal + shipping)}</span>
          </button>
          <Link className="text-link" to="/shop">
            RETURN TO COLLECTION
          </Link>
        </form>
        <aside className="checkout-summary">
          <div className="checkout-summary-heading">
            <h2>YOUR SELECTION</h2>
            <span>{cartCount(cart)} PIECES</span>
          </div>
          {cart.map((line) => {
            const product = getProduct(line.slug)!;
            return (
              <div className="checkout-summary-line" key={lineKey(line)}>
                <img
                  src={asset(product.images[0])}
                  alt={`${product.name}, ${product.color}`}
                  width="80"
                  height="100"
                />
                <div>
                  <h3>{product.name}</h3>
                  <p>
                    {product.color} / {line.size}
                  </p>
                  <p>QTY {line.quantity}</p>
                </div>
                <span>{money(product.price * line.quantity)}</span>
              </div>
            );
          })}
          <div className="checkout-totals">
            <div>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div>
              <span>Demo delivery</span>
              <span>{shipping ? money(shipping) : "Free"}</span>
            </div>
            <div className="checkout-total">
              <strong>SIMULATED TOTAL</strong>
              <strong>{money(subtotal + shipping)}</strong>
            </div>
          </div>
          <p className="demo-caption">
            USD / NO TAX OR PAYMENT WILL BE COLLECTED
          </p>
        </aside>
      </div>
    </div>
  );
}
