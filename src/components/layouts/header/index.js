import Head from 'next/head';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { useContext } from 'react';
import { AppContext } from '@/components/context';


const Header = ({ header }) => {

    const { headerMenuItems, siteTitle } = header || {};

    const [cart] = useContext(AppContext);

    
    function DropDown() {
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }


    return (
        <>
            <Head>
                <title>{siteTitle || ''}</title>
                <link rel="icon" href='/favicon.ico' />
            </Head>
            <div class="topnav" id="myTopnav">

                {
                    !isEmpty(headerMenuItems) && headerMenuItems.length ? headerMenuItems.map(menuItem => (
                        <Link className='link-left'  key={menuItem?.ID}  href={`${menuItem?.url || '/'}`} dangerouslySetInnerHTML={{__html: menuItem.title}} >
                        </Link>
                    )) : null
                }

                <div class="dropdown">
                    <button class="dropbtn">Dropdown
                        <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <Link href="#">Link 1</Link>
                        <Link href="#">Link 2</Link>
                        <Link href="#">Link 3</Link>
                    </div>
                </div>
                <a class="icon" onClick={() => DropDown()}>&#9776;</a>
                <Link className='bag-style' href='/cart'>Cart: {cart?.totalQty}</Link>
            </div>


        </>
    );
};

export default Header;