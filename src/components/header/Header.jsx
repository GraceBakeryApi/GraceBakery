import React from 'react';
import Navigation from './Navigation';

const Header = () => {
    return (
        <header className="bg-cream text-beige p-6 shadow-lg">
            <h1 className="text-4xl font-bold font-sans tracking-wide">Grace Bakery</h1>
            <Navigation />
        </header>
    );
};

export default Header;
