import Layout from '@/components/layouts';
import { HEADER_FOOTER_ENDPOINT } from '@/utils/constants/endpoints'; 
import axios from 'axios';
import CartItemsContainer from '@/components/cart/cart-items-container'; 

export default function Cart({ headerFooter }) {
	return (
		<Layout headerFooter={headerFooter || {}}>
			<h1 className="uppercase tracking-0.5px">Cart</h1>
			<CartItemsContainer/>
		</Layout>
	);
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
		},
		revalidate: 1,
	};
}