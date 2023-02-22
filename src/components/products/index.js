import { isArray, isEmpty } from "lodash";
import { Product } from "./Product";


/**
 * A simple components that get all the product and maps it. 
 */
const Products = ({ products }) => {

    if (isEmpty(products) || !isArray(products) || products.length === 0) {
        return null;
    }



    return (
        <div className="products-grid">
            {
                products.map(product => <Product key={product.id} product={product} />)
            }
        </div>

    )
}

export default Products;