import CheckoutForm from "@/components/checkout/checkout-form";
import Layout from "@/components/layouts";
import {
  HEADER_FOOTER_ENDPOINT,
  WOOCOMMERCE_COUNTRIES_ENDPOINT,
} from "@/utils/constants/endpoints";
import axios from "axios";
import { CredentialsHelper } from "@/utils/OAuth/credentialsHelper";

export default function Checkout({ headerFooter, countries }) {
  console.log("countries", countries);

  return (
    <Layout headerFooter={headerFooter || {}}>
      <div>
        <h1>Checkout</h1>
        <CheckoutForm countriesData={countries} />
      </div>
    </Layout>
  );
}

// This function are getting all the data and send it to the Home function:
export async function getStaticProps() {
    
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT);
  
  // For get the countries data, We need to use OAuth credentials helper,
  //For preper the credentials in the header.
  const { countries } = await CredentialsHelper(WOOCOMMERCE_COUNTRIES_ENDPOINT);


  const data = {
    headerFooter: headerFooterData?.data ?? {},
    countries: countries || {},
  };

  return {
    props: data || {},
    revalidate: 1,
  };
}
