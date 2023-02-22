import Layout from "@/components/layouts";
import SingleProduct from "@/components/single-product";
import { HEADER_FOOTER_ENDPOINT } from "@/utils/constants/endpoints";
import { getProductsBySlug, getProductsData } from "@/utils/products";
import axios from "axios";
import { useRouter } from "next/router";

export default function Product({ headerFooter, products }) {
    const router = useRouter();

    if (router.isFallback) {
        return 'Loading...'
    }

    return (
        <Layout headerFooter={headerFooter}>
           <SingleProduct product={products} />
        </Layout>
    )

}

export async function getStaticProps({ params }) {
    const { slug } = params;

    const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)
    const { data: product } = await getProductsBySlug(slug)

    return {
        props: {
            headerFooter: headerFooterData?.data ?? {},
            products: product.length ? product[0] : {},
        },
    };
}

export async function getStaticPaths() {

    const { data: products } = await getProductsData();

    const pathsData = [];

    products?.length ? products.map(product => {
        if (product?.slug) {
            pathsData.push({ params: { slug: product.slug } })
        }
    }) : null;
  
    return {
        paths: pathsData,
        fallback: true,
    };

}; 