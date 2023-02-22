const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WOEDPRESS_SITE_URL,
    consumerKey: process.env.WP_CONSUMER_KEY,
    consumerSecret: process.env.WP_CONSUMER_SECRET,
    version: "wc/v3"
});

export const getProductsData = async ( perPage = 50 ) => {
 
    return await api.get(
		'products',
		{
			per_page: perPage || 50,
		},
	);
};

export const getProductsBySlug = async ( productSlug ) => {
 
    return await api.get(
		'products',
		{
			slug: productSlug || '', 
		},
	);
};