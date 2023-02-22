import { addToCart } from "@/utils/cart";
import { isEmpty } from "lodash";
import { useContext, useState } from "react";
import { AppContext } from "../context";
import Link from "next/link";



/**
 *  A function that handle on add to cart.
 */

const AddToCart = ({ product }) => {

  const [cart, setCart] = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isEmpty(product)) {
    return null;
  }

  return (
    <>
      <button
        className="btn-addToCart"
        disabled={loading}
        onClick={() =>
          addToCart(product?.id ?? 0, 1, setCart, setIsAddedToCart, setLoading)
        }
      >
        {loading ? "Adding" : "Add To Cart"}
      </button>

      {
        isAddedToCart && !loading ? (
          <Link className="go-to-cart-style" href="/cart">
            Go to Cart
          </Link>
        ) : null
      }

    </>
  );
};

export default AddToCart;
