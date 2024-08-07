import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './styles/nav.css'

export function Navigation() {
    // init navigate variable for page navigation
    const navigate = useNavigate();

    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('access_token') !== null) {
            setIsAuth(true); 
        }
    }, [isAuth]);

    const emailString = "mailto:jarenworme@gmail.com?subject=Query%20about%20your%20website?body=Hi%20Jaren,%0D%0A%0D%0AI%20would%20like%20to%20share%20some%20comments%20about%20your%20website!%0D%0A%0D%0A"

    const handleHome = () =>  navigate('/', { replace: false })

    const handleLogout = () =>  navigate('/logout', { replace: false })
    


    return ( 
        <div>
            {isAuth ?
                <nav className='nav-bar'>
                    <button className="span-wrapper nav-logo-span" onClick={handleHome}>
                        <span className="auth-logo-1">L</span>
                        <span className="auth-logo-2">E</span>
                        <span className="auth-logo-3">G</span>
                        <span className="auth-logo-4">O</span>
                        <span className="auth-logo-5-nav">log</span>
                    </button>
                    <div className='right-nav-wrapper'>
                        <FontAwesomeIcon icon={faHome} className='home-icon' size='xl' onClick={handleHome}/>
                        <a href={emailString} className='contact-link'>contact us</a>
                        <button className='logout-button' onClick={handleLogout}>Logout</button>
                    </div>
                </nav> 
            :
                <div></div>
            }
        </div>
    );
}