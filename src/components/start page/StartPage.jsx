import React from 'react'
import AboutPreview from './AboutPreview'
import ProductsPreview from './ProductsPreview'
import { useTranslation } from 'react-i18next';

function StartPage() {
    const { t, i18n } = useTranslation();
    return (
        <div>
            <h1>{t('start.about.title')}</h1>
            <AboutPreview />
            <ProductsPreview />
        </div>
    )
}

export default StartPage