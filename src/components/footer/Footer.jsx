import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t, i18n } = useTranslation();
    return (
        <footer className="clear-both bg-beige text-cream-light p-8">
            <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0">
                <div>
                    <h2 className="text-xl font-semibold tracking-wide uppercase mb-4">{t('footer.customerService')}</h2>
                    <ul className="space-y-2">
                        <li>
                            <a href="/contact" className="hover:underline">
                                {t('footer.contactUs')}
                            </a>
                        </li>
                        <li>
                            <a href="/shipping" className="hover:underline">
                                {t('footer.shipping')}
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-semibold tracking-wide uppercase mb-4">{t('footer.socialMedia')}</h2>
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
            <div className="mt-8 text-sm text-cream-light space-y-2">
                <p>
                    <a href="/about" className="underline">{t('footer.about')}</a> |
                    <a href="/payment-info" className="underline ml-1">{t('footer.paymentAndDelivery')}</a> |
                    <a href="/privacy" className="underline ml-1">{t('footer.privacy')}</a>
                </p>
                <p>© AIT TR, Grace Bakery, 2024.</p>
            </div>
        </footer>
    );
};

export default Footer;
