import { AppProvider } from "../context";
import Products from "../products";
import Footer from "./footer";
import Header from "./header";

// Wrraping the layout with the AppProvider for provide all the data as well 
export const Layout = ({ headerFooter, children }) => {

    const { header, footer } = headerFooter || {};

    return (
        <>
            <AppProvider>
                <Header header={header} />
                <main>
                    {children}
                </main>
                <Footer footer={footer} />
            </AppProvider>
        </>
    )
}

export default Layout; 