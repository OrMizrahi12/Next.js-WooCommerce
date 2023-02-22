import { isArray, isEmpty } from 'lodash';
import { createCheckoutSession } from 'next-stripe/client'; // @see https://github.com/ynnoj/next-stripe
import { loadStripe } from '@stripe/stripe-js';
import { createTheOrder, getCreateOrderData } from './order'
import { clearCart } from '../cart';
import { WOOCOMMERCE_COUNTRIES_ENDPOINT, WOOCOMMERCE_STATES_ENDPOINT } from '../constants/endpoints';
import { GetStatesHalper } from '../OAuth/getStatesHalper';


/**
 * 
 * @param {Object} input - contain all the user data (address, name, etc...) 
 * @param {Object} products 
 * @param {State} setRequestError - A state function for set err 
 * @param {State} setCart - A state function for set the cart in the data
 * @param {State} setIsOrderProcessing - 
 * @param {State} setCreatedOrderData 
 * @returns 
 */

export const handleOtherPaymentMethodCheckout = async (input, products, setRequestError, setCart, setIsOrderProcessing, setCreatedOrderData) => {
	setIsOrderProcessing(true);
	const orderData = getCreateOrderData(input, products);
	const customerOrderData = await createTheOrder(orderData, setRequestError, '');
	const cartCleared = await clearCart(setCart, () => {
	});
	setIsOrderProcessing(false);

	if (isEmpty(customerOrderData?.orderId) || cartCleared?.error) {
		setRequestError('Clear cart failed');
		return null;
	}

	setCreatedOrderData(customerOrderData);

	return customerOrderData;
};


/**
 *  This function are handlling on the Stripe checkout. 
 * ....................................................
 *  
 *  1) it getting the order
 *  2) Create the order
 *  3) Clear the cart 
 *  4) call to createCheckoutSessionAndRedirect() for complate the proccess. 
 * 
 * @param {Object} input - all the user ditails 
 * @param {State} products - the products that the user add to cart
 * @param {State function} setRequestError 
 * @param {State function} setCart 
 * @param {State function} setIsProcessing 
 * @param {State function} setCreatedOrderData 
 * @returns 
 */

export const handleStripeCheckout = async (input, products, setRequestError, setCart, setIsProcessing, setCreatedOrderData) => {
	setIsProcessing(true);
	const orderData = getCreateOrderData(input, products);
	const customerOrderData = await createTheOrder(orderData, setRequestError, '');
	const cartCleared = await clearCart(setCart, () => {
	});
	setIsProcessing(false);

	if (isEmpty(customerOrderData?.orderId) || cartCleared?.error) {
		setRequestError('Clear cart failed');
		return null;
	}

	setCreatedOrderData(customerOrderData);
	await createCheckoutSessionAndRedirect(products, input, customerOrderData?.orderId);

	return customerOrderData;
};


/**
 *   This function ditails for complate the checkout with Scripe
 * 
 *   1) its create a session data of all the pearcush ditails for send it as a request 
 *   2) Make API to Scripe server for complate the chekout 
 * 
 * @param {State} products  
 * @param {Object} input 
 * @param {data} orderId 
 */
const createCheckoutSessionAndRedirect = async (products, input, orderId) => {
	const sessionData = {
		success_url: window.location.origin + `/thank-you?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
		cancel_url: window.location.href,
		customer_email: input.billingDifferentThanShipping ? input?.billing?.email : input?.shipping?.email,
		line_items: getStripeLineItems(products),
		metadata: getMetaData(input, orderId),
		payment_method_types: ['card'],
		mode: 'payment',
	};


	console.log('sessionData', sessionData);
	let session = {};
	try {
		session = await createCheckoutSession(sessionData);
	} catch (err) {
		console.log('createCheckout session error', err);
	}
	try {
		const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
		if (stripe) {
			stripe.redirectToCheckout({ sessionId: session.id });
		}
	} catch (error) {
		console.log(error);
	}
};

/**
 *  This function are return nessesery data to createCheckoutSessionAndRedirect()
 *  for complate the request data to Scripe (for succuss the checkout)
 * @param products 

*/
const getStripeLineItems = (products) => {
	if (isEmpty(products) || !isArray(products)) {
		return [];
	}

	return products.map((product) => {
		return {
			price_data: {
				currency: 'usd',
				unit_amount: Math.round((product?.line_subtotal ?? 0) * 100),
				product_data: {
					name: product?.data?.name ?? '',
					images: [product?.data?.images?.[0]?.src ?? ''],
				},
			},
			quantity: product?.quantity ?? 0,
		};
	});
};

/**
 *  This function are return nessesery data to createCheckoutSessionAndRedirect()
 *  for complate the request data to Scripe (for succuss the checkout)
*/
export const getMetaData = (input, orderId) => {

	return {
		billing: JSON.stringify(input?.billing),
		shipping: JSON.stringify(input.billingDifferentThanShipping ? input?.billing?.email : input?.shipping?.email),
		orderId,
	};

	// @TODO
	// if ( customerId ) {
	//     metadata.customerId = customerId;
	// }

};


/**
 * If Billing Different Than the Shipping, 
 * this function are handling in the Billing ditails   
 * @param {*} input 
 * @param {*} setInput 
 * @param {*} target 
 */

export const handleBillingDifferentThanShipping = (input, setInput, target) => {
	const newState = { ...input, [target.name]: !input.billingDifferentThanShipping };
	setInput(newState);
};

/**
 * Henndle function for create account (still not in use)
 * @param {*} input 
 * @param {*} setInput 
 * @param {*} target 
 */

export const handleCreateAccount = (input, setInput, target) => {
	const newState = { ...input, [target.name]: !input.createAccount };
	setInput(newState);
};

export const setStatesForCountry = async (target, setTheStates, setIsFetchingStates) => {
	if ('country' === target.name) {
		setIsFetchingStates(true);
		const countryCode = target[target.selectedIndex].getAttribute('data-countrycode');
		const states = await getStates(countryCode);
		setTheStates(states || []);
		setIsFetchingStates(false);
	}
};

export const getStates = async (countryCode = '') => {

	if (!countryCode) {
		return [];
	}

	const { states } = await GetStatesHalper(`${WOOCOMMERCE_COUNTRIES_ENDPOINT}/${countryCode}`)

	return states ?? [];
};


