import { getSession, storeSession } from './session';
import { getApiCartConfig } from './api';
import axios from 'axios';
import { CART_ENDPOINT } from '../constants/endpoints';
import { isEmpty, isArray } from 'lodash';

/**
 * Add To Cart Request Handler.
 *
 * @param {int} productId Product Id.
 * @param {int} qty Product Quantity.
 * @param {Function} setCart Sets The New Cart Value
 * @param {Function} setIsAddedToCart Sets A Boolean Value If Product Is Added To Cart.
 * @param {Function} setLoading Sets A Boolean Value For Loading State.
 */
export const addToCart = (productId, qty = 1, setCart, setIsAddedToCart, setLoading) => {


	// We get the swssion - for get the autorization for make the REST API successfuly 
	// We will store the session in the local storge
	const storedSession = getSession();

	// We need geeting also the configuration
	const addOrViewCartConfig = getApiCartConfig();

	setLoading(true);

	// Make The POST req 
	axios.post(
		CART_ENDPOINT, {

		// send the product id and the quantity
		product_id: productId,
		quantity: qty,
	},
		addOrViewCartConfig,
	)
		.then((res) => {

			// Set the session in the local storage, if is empty
			if (isEmpty(storedSession)) {
				storeSession(res?.headers?.['x-wc-session']);
			}
			setIsAddedToCart(true);
			setLoading(false);

			// Is everyting ok, we are call to view cart function: 
			// The viewCart function get the setCart (Action), and set cart data within. 
			viewCart(setCart);

		})
		.catch(err => {
			setLoading(false);
			console.log('err', err);
		});
};

/**
 * View Cart Request Handler
 *
 * @param {Function} setCart Set Cart Function.
 * @param {Function} setProcessing Set Processing Function.
 */

// The view cart are make a GET req
export const viewCart = (setCart, setProcessing = () => { }) => {

	// Get the Header key, as part from the req-res proccess 
	const addOrViewCartConfig = getApiCartConfig();

	// make the GET request
	axios.get(CART_ENDPOINT, addOrViewCartConfig)
		.then((res) => {
			// Set the data from the response
			const formattedCartData = getFormattedCartData(res?.data ?? [])

			console.log("TOTAL CART DATA", res);

			// set the cart
			setCart(formattedCartData);
			setProcessing(false);
		})
		.catch(err => {
			console.log('err', err);
			setProcessing(false);

		});
};

/**
 * Update Cart Request Handler
 */
export const updateCart = (cartKey, qty = 1, setCart, setUpdatingProduct) => {

	const addOrViewCartConfig = getApiCartConfig();

	setUpdatingProduct(true);

	axios.put(`${CART_ENDPOINT}/${cartKey}`, {
		quantity: qty,
	}, addOrViewCartConfig)
		.then((res) => {
			viewCart(setCart, setUpdatingProduct);
		})
		.catch(err => {
			console.log('err', err);
			setUpdatingProduct(false);
		});
};

/**
 * Delete a cart item Request handler.
 *
 * Deletes all products in the cart of a
 * specific product id ( by its cart key )
 * In a cart session, each product maintains
 * its data( qty etc ) with a specific cart key
 *
 * @param {String} cartKey Cart Key.
 * @param {Function} setCart SetCart Function.
 * @param {Function} setRemovingProduct Set Removing Product Function.
 */
export const deleteCartItem = (cartKey, setCart, setRemovingProduct) => {

	const addOrViewCartConfig = getApiCartConfig();

	setRemovingProduct(true);

	axios.delete(`${CART_ENDPOINT}/${cartKey}`, addOrViewCartConfig)
		.then((res) => {
			viewCart(setCart, setRemovingProduct);
		})
		.catch(err => {
			console.log('err', err);
			setRemovingProduct(false);
		});
};

/**
 * Clear Cart Request Handler
 *
 * @param {Function} setCart Set Cart
 * @param {Function} setClearCartProcessing Set Clear Cart Processing.
 */
export const clearCart = async (setCart, setClearCartProcessing) => {

	setClearCartProcessing(true);

	const addOrViewCartConfig = getApiCartConfig();

	try {
		const response = await axios.delete(CART_ENDPOINT, addOrViewCartConfig);
		viewCart(setCart, setClearCartProcessing);
	} catch (err) {
		console.log('err', err);
		setClearCartProcessing(false);
	}
};

/**
 * Get Formatted Cart Data.
 *
 * @param cartData - All the data in the cart
 * @return {null|{cartTotal: {totalQty: number, totalPrice: number}, cartItems: ({length}|*|*[])}}
 */
const getFormattedCartData = (cartData) => {
	if (!cartData.length) {
		return null;
	}
	const cartTotal = calculateCartQtyAndPrice(cartData || []);

	return {
		cartItems: cartData || [],
		...cartTotal,
	};
};

/**
 * Calculate Cart Qty And Price.
 *
 * @param cartItems - All the data in the cart
 * @return {{totalQty: number, totalPrice: number}}
 */

const calculateCartQtyAndPrice = (cartItems) => {
	const qtyAndPrice = {
		totalQty: 0,
		totalPrice: 0,
	}

	if (!isArray(cartItems) || !cartItems?.length) {
		return qtyAndPrice;
	}

	cartItems.forEach((item, index) => {
		qtyAndPrice.totalQty += item?.quantity ?? 0;
		qtyAndPrice.totalPrice += item?.line_total ?? 0;
	})

	return qtyAndPrice;
}