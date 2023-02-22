import { isEmpty } from "lodash";
import Link from "next/link";


const Footer = ({ footer }) => {

    // footerMenuItems , title

    const { footerMenuItems } = footer;
    console.log("FOOTER:", footer)
    return (
        <footer class="footer">
            {
                !isEmpty(footerMenuItems) && footerMenuItems.length ? footerMenuItems.map(menuItem => ( <p key={menuItem?.ID}>
                    <Link href={`${menuItem?.url || '/'}`} dangerouslySetInnerHTML={{ __html: menuItem.title }} >
                    </Link>
                    </p>
                )) : null
            }
        </footer>
    )
}

export default Footer;