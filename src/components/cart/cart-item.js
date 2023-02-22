import React, { useEffect, useState, useRef } from "react";
import { isEmpty } from "lodash";
import Image from "../image";
import { deleteCartItem, updateCart } from "@/utils/cart";


 

/**
 *
 *  A function that handle on that cart functionality: 
 *  This function are represent each product 
 *  (The CartItemsContainer mapping on this compontnts and send all that data) 
 * 
 *  1) Decrement / increment quantity from product cart 
 *  2) Remove items from cart  
 *  
 *   retuen: html. 
 */
const CartItem = ({ item, products, setCart }) => {
  
	const [productCount, setProductCount] = useState(item.quantity);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [removingProduct, setRemovingProduct] = useState(false);
  const productImg = item?.data?.images?.[0] ?? "";

  // Why its so important to have a ref here?
  // Beacuse once we do some operations on the DOM, we must wait for the DOM to be updated.
  // If we dont care of it, we can get a memory error, beacuse the REST API is un-synchron
  const isMounted = useRef(false);

  useEffect(() => {
	
    isMounted.current = true;

	// 
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleRemoveProductClick = (event, cartKey) => {
    event.stopPropagation();

	// If isMounted is false, we CANT update any details of the cart.
	// We must wait for the DOM to be updated, and isMounted will be true.

    if (!isMounted || updatingProduct) {
      return;
    }

    deleteCartItem(cartKey, setCart, setRemovingProduct);
  };

  const handleQtyChange = (event, cartKey, type) => {
    if (process.browser) {
      event.stopPropagation();
      let newQty;

      if (
        updatingProduct ||
        removingProduct ||
        ("decrement" === type && 1 === productCount)
      ) {
        return;
      }

      if (!isEmpty(type)) {
        newQty = "increment" === type ? productCount + 1 : productCount - 1;
      } else {
        // If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
        newQty = event.target.value ? parseInt(event.target.value) : 1;
      }

      setProductCount(newQty);

      if (products.length) {
        updateCart(item?.key, newQty, setCart, setUpdatingProduct);
      }
    }
  };

  return (
    <div className="each-product">
      <div className="">
        <button
          className="btn-remove-product-from-cart"
          onClick={(event) => handleRemoveProductClick(event, item?.key)}
        >
          &times;
        </button>

        <figure>
          <Image
            className="mx-auto"
            width="300"
            height="300"
            altText={productImg?.alt ?? ""}
            sourceUrl={!isEmpty(productImg?.src) ? productImg?.src : ""}
          />
        </figure>
      </div>

      <div className="product-cart-container">
        <div className="product-cart-wraper">
          <div className="description-section-weraper">
            <h3 className="cart-product-name">{item?.data?.name}</h3>
            {item?.data?.description ? (
              <p className="product-description">{item?.data?.description}</p>
            ) : (
              ""
            )}
          </div>

          <footer className="footer-product-block-weraper">
            <div className="increment-decrement-wraper">
              <button
                className="increment-decrement-btn"
                onClick={(event) =>
                  handleQtyChange(event, item?.cartKey, "decrement")
                }
              >
                -
              </button>
              <input
                type="number"
                min="1"
                data-cart-key={item?.data?.cartKey}
                className={` txt-input-count ${
                  updatingProduct ? "disabled" : ""
                } `}
                value={productCount}
                onChange={(event) => handleQtyChange(event, item?.cartKey, "")}
              />
              <button
                className="increment-decrement-btn"
                onClick={(event) =>
                  handleQtyChange(event, item?.cartKey, "increment")
                }
              >
                +
              </button>
            </div>
            <div className="total-price-per-product">
              {item?.currency}
              {item?.line_subtotal}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
