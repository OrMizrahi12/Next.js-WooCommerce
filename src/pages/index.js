import Layout from '@/components/layouts';
import Products from '@/components/products';
import { HEADER_FOOTER_ENDPOINT } from '@/utils/constants/endpoints';
import { getProductsData } from '@/utils/products';
import axios from 'axios'



// The Home function are getting all the data from the getStaticProps function:
export default function Home({ headerFooter, products }) {

  return (
    <>
      {/* Send to the Layout the heder and the footer data */}
      <Layout headerFooter={headerFooter} >
        <Products products={products} />
      </Layout>
    </>
  )
}


// This function are getting all the data and send it to the Home function:
export async function getStaticProps() {

  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)

  const { data: products } = await getProductsData();

  const data = {
    headerFooter: headerFooterData?.data ?? {},
    products: products ?? {}
  }

  return {
    props: data || {},
    revalidate: 1
  }
}