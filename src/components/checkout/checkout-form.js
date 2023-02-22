import { handleBillingDifferentThanShipping, handleCreateAccount, handleOtherPaymentMethodCheckout, handleStripeCheckout, setStatesForCountry } from "@/utils/checkout";
import { useContext, useState } from "react";
import { AppContext } from "../context";
import CheckboxField from "./form-elements/checkbox-field";
import PaymentModes from "./payment-modes";
import Adress from "./user-adress";
import YourOrder from "./your-order";
import cx from 'classnames';
import validateAndSanitizeCheckoutForm from "@/validator/checkout";


const defaultCustomerInfo = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  country: "",
  state: "",
  postcode: "",
  email: "",
  phone: "",
  company: "",
  errors: null,
};



/**
 * A Checkout form, that controlling all the validation of the user ditails. 
 *
 * @param {*}  countriesData - All the countries data, for that the user will can choose the country 
 * @return {*} 
 */
const CheckoutForm = ({ countriesData }) => {
  console.log(countriesData);

  const initialState = {
    billing: {
      ...defaultCustomerInfo,
    },
    shipping: {
      ...defaultCustomerInfo,
    },
    createAccount: false,
    orderNotes: '',
    billingDifferentThanShipping: false,
    paymentMethod: 'cod',
  };
  
  const [cart, setCart] = useContext(AppContext);
  const [input, setInput] = useState(initialState);
  const [theShippingStates, setTheShippingStates] = useState([]);
  const [theBillingStates, setTheBillingStates] = useState([]);
  const [isFathingShippingStates, setIsFathingShippingStates] = useState(false);
  const [isFetchingBillingStates, setIsFetchingBillingStates] = useState(false);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState({});
  const [requestError,setRequestError] = useState(false); 

  /**
   *
   *  A function that handle for the form submitions. 
   *
   * @param {*} event - for prevent the default behavior
   * @return {*} 
   */
  const handleFromSubmit = async (event) => {
    event.preventDefault();
 

    // billingValidationResult - is contain all the biiling information.
    const billingValidationResult = input?.billingDifferentThanShipping ? validateAndSanitizeCheckoutForm(input?.billing, theBillingStates?.length) : {
      errors: null,
      isValid: true,
    };

    /**
     *  shippingValidationResult - are call to the validateAndSanitizeCheckoutForm,
     *  for check if the form is valid or not.   
     */ 
    const shippingValidationResult = validateAndSanitizeCheckoutForm(input?.shipping, theShippingStates?.length);
 
    setInput({
      ...input,
      billing: { ...input.billing, errors: billingValidationResult.errors },
      shipping: { ...input.shipping, errors: shippingValidationResult.errors },
    });
     
    // If the form is not valid - w'll reject the submition
    if (!shippingValidationResult.isValid || !billingValidationResult.isValid) {
      return null;
    }
    
    /**
     * stripe is a payment method. is the user check to pay with this method, 
     * we call to the handleStripeCheckout for continu the prossess and make a payment with stripe.
     */
    if ('stripe' === input.paymentMethod) {
      const createdOrderData = await handleStripeCheckout(input, cart?.cartItems, setRequestError, setCart, setIsOrderProcessing, setCreatedOrderData);
      return null;
    }
     
    // For Any other payment mode, create the order and redirect the user to payment url.
    const createdOrderData = await handleOtherPaymentMethodCheckout(input, cart?.cartItems, setRequestError, setCart, setIsOrderProcessing, setCreatedOrderData);

    /**
     *  If exist paymentUrl, w'll send the 
     */
    if (createdOrderData?.paymentUrl) {
      window.location.href = createdOrderData.paymentUrl;
    }
    setRequestError(null);
  }


  /**
   * A function that handles changes in an input field
   * This function are get the event, and calling to the correct function fot handle it. 
   *  
   *  event - what the event for handlling ? 
   */
  const handleOnChange = async (event, isShipping = false, isBillingOrShipping = false) => {

    const { target } = event || {};
    
    // if case for see what the event name for handlling: 
    

    if (target?.name === 'createAccount') {
      handleCreateAccount(input, setInput, target);
    }
    else if (target?.name === 'billingDifferentThanShipping') {

      handleBillingDifferentThanShipping(input, setInput, target);
    }
    else if (isBillingOrShipping) {

      if (isShipping) {
        await handleShippingChange(target);
      }
      else {
        await handleBillingChange(target)
      }
    }
    else {
      const newState = { ...input, [target.name]: target.value };
      setInput(newState);
    }
  }
  

  /**
   * Function for handling on the Shipping changing. 
   * 
   * @param target   
   */
  const handleShippingChange = async (target) => {
    
    // Copy & Updating the current state
    const newState = { ...input, shipping: { ...input?.shipping, [target.name]: target.value } };
    
    // Set the updated state
    setInput(newState);

    //  set the function for set the target. 
    await setStatesForCountry(target, setTheShippingStates, setIsFathingShippingStates);
  };
  
  /**
   * This function the same like the function above. 
   * 
   */
  const handleBillingChange = async (target) => {

    const newState = { ...input, billing: { ...input?.billing, [target.name]: target.value } };

    setInput(newState);
    await setStatesForCountry(target, setTheBillingStates, setIsFetchingBillingStates);
  };

  return (
    <>
      {
        cart ? (
          <form onSubmit={handleFromSubmit}>
            <div>
              <div>
                <div>
                  <h2>Shipping details</h2>
                  {/* 
                    
                    Adress - a component that get all the shipping data 
                    that the user need to fill, and create a form.  
                  
                  */}
                  <Adress
                    states={theShippingStates}
                    countries={countriesData}
                    input={input?.shipping}
                    handleOnChange={(event) => handleOnChange(event, true, true)}
                    isFetchingStates={isFathingShippingStates}
                    isShipping
                  />
                </div>
                <div>
                   {/*  
                      A component that contain input that make sure is the 
                      billing different than the shipping ditails. 
                      
                   */}
                  <CheckboxField
                    name="billingDifferentThanShipping"
                    type="checkbox"
                    checked={input.billingDifferentThanShipping}
                    handleOnChange={handleOnChange}
                    label="billing Different Than Shipping"

                  />
                </div>
                {
                  // If treu (billingDifferentThanShipping), w'll show another form for this data 
                  input?.billingDifferentThanShipping ? <div>
                    <h2>Shipping details</h2>
                    <Adress
                      states={theBillingStates}
                      countries={countriesData}
                      input={input?.billing}
                      handleOnChange={(event) => handleOnChange(event, false, true)}
                      isFetchingStates={isFetchingBillingStates}
                      isShipping={false}
                      isBillingOrShipping
                    />
                  </div> : null
                }
              </div>
              <YourOrder cart={cart} />
              <PaymentModes input={input} handleOnChange={handleOnChange} />

              <div className="woo-next-place-order-btn-wrap mt-5">
                <button
                  disabled={isOrderProcessing}
                  className={cx(
                    'bg-purple-600 text-white px-5 py-3 rounded-sm w-auto xl:w-full',
                    { 'opacity-50': isOrderProcessing },
                  )}
                  type="submit"
                >
                  Place Order
                </button>
              </div>

              {/* Checkout Loading*/}
              {isOrderProcessing && <p>Processing Order...</p>}
              {/* {requestError && <p>Error : {requestError} : Please try again</p>} */}

            </div>
          </form>
        ) : null
      }
    </>
  );
};

export default CheckoutForm;
