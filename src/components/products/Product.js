import { sanitize } from "@/utils/miscellaneous";
import { isEmpty } from "lodash"
import Link from "next/link";
import AddToCart from "../cart/add-to-cart";
import Image from "../image";
import ExternalLink from "./external-link";

/**
 *
 *  A component for each product. 
 *  This function are get each product and rener it.  
 */
export const Product = ({ product }) => {

    if (isEmpty(product)) {
        return null;
    }

    const img = product?.images?.[0] ?? {};
    const productType = product?.type ?? '';

    return (
        <div className="each-product">
            <Link href={`/product/${product?.slug ?? ''}`}>
                <Image
                    className="mx-auto"
                    sourceUrl={img.src}
                    altText={img?.alt}
                    title={product.name}
                    width="380"
                    height="380"

                />
                <div dangerouslySetInnerHTML={{ __html: sanitize(product?.price_html || '') }} />
                <h3>{product.name}</h3>
            </Link>

            {productType === 'simple' && <AddToCart product={product} />}
            {
                'external' === productType ?
                    <ExternalLink
                        url={product?.external_url ?? ''}
                        text={product?.button_text ?? ''}
                    /> : null
            }

        </div>
    )
}