import React from 'react';
import Navigation from './Navigation';
import { NavLink } from 'react-router-dom';
import LangSwitch from './LangSwitch';
import { Stack } from '@mui/material';
import UserLogo from './UserLogo';
import cartLogo from '../../images/cart.png'

const Header = () => {
    return (
        <header className="bg-cream text-beige p-6 shadow-lg">
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
                <NavLink to={'/'}>
                    <h1 className="text-4xl font-bold font-sans tracking-wide inline">Grace Bakery</h1>
                </NavLink>
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <LangSwitch />
                    <UserLogo />
                    <NavLink to={'/cart'}>
                        <img src={cartLogo} className='w-6' />
                    </NavLink>
                </Stack>
            </Stack>
            <Navigation />
        </header>
    );
};

export default Header;
