import React from 'react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faUser } from '@fortawesome/free-solid-svg-icons';
import useAuth from './useAuth';
import '../components/css/style.css';

interface NavBarProps {
    brandName: string;
    items: string[];
}

const NavBar: React.FC<NavBarProps> = ({ brandName, items }) => {
    const isLoggedIn = useAuth();

    return (
        <nav className="navbar navbar-expand-md navbar-grey bg-grey shadow">
            <NavLink className="navbar-brand" to="/">
                <span className="fw-bolder fs-4">{brandName}</span>
            </NavLink>
            <div className="navigacio">
                <ul>
                    {items.map((item, index) => (
                       <li key={index}>
                       {item === 'Home' ? (
                           <NavLink to="/">{item}</NavLink>
                       ) : item === 'Keresés' ? (
                           <NavLink to="/search">{item}</NavLink>
                       ) : item === 'Bejelentkezés' && !isLoggedIn ? (
                           <NavLink to="/bejelentkezes">{item}</NavLink>
                       ) : item === 'Regisztráció'  && !isLoggedIn ? (
                           <NavLink to="/regisztracio">{item}</NavLink>
                       ) : null }
                   </li>
                    ))}
                </ul>
                {isLoggedIn && (
                    <>
                        <div className="kosar">
                            <NavLink to="/kosar">
                                <FontAwesomeIcon icon={faShoppingBasket} />
                            </NavLink>
                        </div>
                        <div className="profil">
                            <NavLink to="/profil">
                                <FontAwesomeIcon icon={faUser} />
                            </NavLink>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;