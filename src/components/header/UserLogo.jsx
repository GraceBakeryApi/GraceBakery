import React, { useState } from 'react'
import userLogo from '../../images/user.png'
import { NavLink } from 'react-router-dom';

function UserLogo() {
    const [auth, setAuth] = useState(false);
    if (auth)
        return (
            <NavLink to={'/profile'}>
                <img src={userLogo} className='w-6' />
            </NavLink>
        )
    else
        return (
            <NavLink to={'/registration'}>
                <img src={userLogo} className='w-6' />
            </NavLink>
        )
}

export default UserLogo