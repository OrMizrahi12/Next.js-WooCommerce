import ReactImageGallery from "react-image-gallery"; 
const ProductGallery = ( { items } ) => {
	// Construct Images.
	const images = items?.map( ( item ) => {
			return {
				original: item.src,
				thumbnail: item.src,
			};
		},
	);
	
	return <ReactImageGallery items={images} />;
};

export default ProductGallery;