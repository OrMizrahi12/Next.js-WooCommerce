/**
 * Internal Dependencies.
 */
import AddToCart from '../cart/add-to-cart'; 
import ExternalLink from '../products/external-link'; 
import ProductGallery from './product-gallery'; 

const SingleProduct = ( { product } ) => {
	return Object.keys( product ).length ? (
		<div className="single-product-wrapper">
			<div className="">
				<div className="">
					
					{ product.images.length ? (
						<ProductGallery items={ product?.images }/>
					) : null }
				</div>
				<div className="">
					<h4 className="">{ product.name }</h4>
					<div
						
						dangerouslySetInnerHTML={ {
							__html: product.description,
						} }
						className=""
					/>
					<div
						
						dangerouslySetInnerHTML={ {
							__html: product?.price_html ?? '',
						} }
						className=""
					/>
					{ 'simple' === product?.type ? <AddToCart product={ product }/> : null }
					{
						'external' === product?.type ?
							<ExternalLink
								url={ product?.external_url ?? '' }
								text={ product?.button_text ?? '' }
							/> : null
					}
				</div>
			</div>
		
		</div>
	) : null;
	
};

export default SingleProduct;