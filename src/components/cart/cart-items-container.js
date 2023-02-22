import React, { useContext, useState } from "react";
import { AppContext } from "../context";
import CartItem from "./cart-item";
import Link from "next/link";
import { clearCart } from "../../utils/cart";



/**
 *   A function that container the cart items. 
 *   This function are Mapping on the CartItem and semd all the product 
 *   
 *   functionality: Clear all the cart
 * 
 * 
 * @returns Html 
 */
const CartItemsContainer = () => {
  const [cart, setCart] = useContext(AppContext);
  const { cartItems, totalPrice, totalQty } = cart || {};
  const [isClearCartProcessing, setClearCartProcessing] = useState(false);

  // Clear the entire cart.
  const handleClearCart = async (event) => {
    event.stopPropagation();

    if (isClearCartProcessing) {
      return;
    }

    await clearCart(setCart, setClearCartProcessing);
  };

  return (
    <div className="m-10">
      {cart ? (
        <div className="">
          {/*Cart Items*/}
          <div className="products-grid">
            {cartItems.length &&
              cartItems.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  products={cartItems}
                  setCart={setCart}
                />
              ))}
          </div>

          {/*Cart Total*/}
        </div>
      ) : (
        <div className="mt-14">
          <h2>No items in the cart</h2>
          <Link href="/">
            <button className="text-white duration-500 bg-brand-orange hover:bg-brand-royal-blue font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900">
              <span className="woo-next-cart-checkout-txt">
                Add New Products
              </span>
              <i className="fas fa-long-arrow-alt-right" />
            </button>
          </Link>
        </div>
      )}
      <div className="Purchase-details-weraper">
        <div className="txt-Purchase-details-weraper">
          <p className="">Total({totalQty})</p>
          <p className="">
            {cartItems?.[0]?.currency ?? ""}
            {totalPrice}
          </p>
        </div>

        <div className="operation-Purchase-details-weraper">
         
          <div className="">
            <button
              className="btn-clear-Cart"
              onClick={(event) => handleClearCart(event)}
              disabled={isClearCartProcessing}
            >
              <span className="woo-next-cart">
                {!isClearCartProcessing ? "Clear Cart" : "Clearing..."}
              </span>
            </button>
          </div>
          {/*Checkout*/}
          <Link href="/checkout">
            <button className="btn-Proceed-to-Checkout">
              <span className="">Proceed to Checkout</span>
              <i className="fas fa-long-arrow-alt-right" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartItemsContainer;
