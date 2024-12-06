import React from 'react';

const Footer = () => {
    return (
        <footer className="clear-both bg-beige text-cream-light p-8">
            <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0">
                {/* Customer service */}
                <div>
                    <h2 className="text-xl font-semibold tracking-wide uppercase mb-4">Customer Service</h2>
                    <ul className="space-y-2">
                        <li>
                            <a href="/contact" className="hover:underline">
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <a href="/shipping" className="hover:underline">
                                Shipping
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Соц.сети */}
                <div>
                    <h2 className="text-xl font-semibold tracking-wide uppercase mb-4">Social Media</h2>
                    <ul className="space-y-2">
                        <li>
                            <a href="https://t.me/grace_bakery_i" className="hover:underline">
                                Telegram
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com/grace_bakery_i" className="hover:underline">
                                Instagram
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Лабуда с about и тд */}
            <div className="mt-8 text-sm text-cream-light space-y-2">
                <p>
                    <a href="/about" className="underline">About</a> |
                    <a href="/payment-info" className="underline ml-1">Payment and Delivery Information</a> |
                    <a href="/privacy" className="underline ml-1">Privacy Policy</a>
                </p>
                <p>© AIT TR, Grace Bakery, 2024.</p>
            </div>
        </footer>
    );
};

export default Footer;
