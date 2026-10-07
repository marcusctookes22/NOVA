import { Link } from "react-router-dom";
import { asset, getProduct, money } from "../catalog";
import { cartCount, cartSubtotal, lineKey, MAX_QUANTITY } from "../cart";
import { useBag } from "../store";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";

export function BagDrawer({ onClose }: { onClose: () => void }) {
  const { cart, dispatch } = useBag();
  return (
    <Dialog
      title={`YOUR BAG (${cartCount(cart)})`}
      kind="bag-drawer"
      onClose={onClose}
    >
      {cart.length === 0 ? (
        <div className="bag-empty">
          <span className="eyebrow">NEW FORM. NEW ENERGY.</span>
          <h3>
            Room for
            <br />
            something new.
          </h3>
          <p>Your bag is empty.</p>
          <Link className="button" to="/shop" onClick={onClose}>
            EXPLORE DROP 001
          </Link>
        </div>
      ) : (
        <>
          <div className="bag-lines">
            {cart.map((line) => {
              const product = getProduct(line.slug)!;
              const key = lineKey(line);
              return (
                <article className="bag-line" key={key}>
                  <Link to={`/product/${product.slug}`} onClick={onClose}>
                    <img
                      src={asset(product.images[0])}
                      alt={`${product.name}, ${product.color}`}
                      width="100"
                      height="125"
                    />
                  </Link>
                  <div>
                    <Link
                      className="bag-product-name"
                      to={`/product/${product.slug}`}
                      onClick={onClose}
                    >
                      {product.name}
                    </Link>
                    <p>
                      {product.color} / {line.size}
                    </p>
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          dispatch({ type: "quantity", key, delta: -1 })
                        }
                        aria-label={`Decrease ${product.name}, size ${line.size}`}
                      >
                        <Icon name="minus" />
                      </button>
                      <span aria-label="Quantity">{line.quantity}</span>
                      <button
                        disabled={line.quantity >= MAX_QUANTITY}
                        onClick={() =>
                          dispatch({ type: "quantity", key, delta: 1 })
                        }
                        aria-label={`Increase ${product.name}, size ${line.size}`}
                      >
                        <Icon name="plus" />
                      </button>
                    </div>
                    <button
                      className="text-button remove"
                      onClick={() => dispatch({ type: "remove", key })}
                      aria-label={`Remove ${product.name}, size ${line.size}`}
                    >
                      REMOVE
                    </button>
                  </div>
                  <span className="bag-line-price">
                    {money(product.price * line.quantity)}
                  </span>
                </article>
              );
            })}
          </div>
          <div className="bag-summary">
            <div>
              <span>SUBTOTAL</span>
              <strong>{money(cartSubtotal(cart))}</strong>
            </div>
            <p>Demo bag. Delivery calculated in the simulation.</p>
            <Link className="button" to="/checkout" onClick={onClose}>
              CHECKOUT
            </Link>
            <button className="text-button" onClick={onClose}>
              CONTINUE EXPLORING
            </button>
            <span className="demo-caption">NO REAL PURCHASES OR PAYMENTS</span>
          </div>
        </>
      )}
    </Dialog>
  );
}
