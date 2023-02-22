import React, { useState, useEffect } from "react";

export const AppContext = React.createContext([
    // This is just the default value
    {},
    () => { }
]);

// The peovaider function
export const AppProvider = (props) => {

    
    const [cart, setCart] = useState(null);

    // typeof window !== 'undefined'

    // <-- For set the cart -->
    useEffect(() => {
        if (process.browser) {

            // Getting the cart from the local storge:
            let cartData = localStorage.getItem('next-cart');

            // If cartData are not null, we set parsing the cart: 
            cartData = null !== cartData ? JSON.parse(cartData) : '';
            console.log("Cart Data: ", cartData);

            setCart(cartData)
        }
        // We do it - only id the cart are change. 
    }, [])


    // <-- Get update the local storage -->
    // This effect are follow after a browser effect. 
    // If there is an effect in the browser, we are set the cart in the local storge
    useEffect(() => {
        if (process.browser) {
            localStorage.setItem('next-cart', JSON.stringify(cart))
        }
        // We do it - only id the cart are change. 
    }, [cart])

    return (
        <AppContext.Provider value={[cart, setCart]}>
            {props.children}
        </AppContext.Provider>
    )
}