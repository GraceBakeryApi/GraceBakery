import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import Categories from './Categories';
import Items from './Items';
import ProductPage from './ProductPage';

const Catalog = () => {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories/section/1/isactive/true');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Ошибка при загрузке категорий:', error);
            }
        };
        fetchCategories();
    }, []);

    const fetchItems = async (categoryId) => {
        try {
            const response = await fetch(`/api/products/category/${categoryId}/isactive/true`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        fetchItems(category.id);
    };

    const filteredItems = selectedCategory ? items : [];
    const test = true;
    return (
        <div>
            {test && (<ProductPage />)}
            {!test && (<Box p={3}>
                <Typography variant="h4" gutterBottom>
                    Catalog
                </Typography>

                <Categories
                    categories={categories}
                    onCategorySelect={handleCategorySelect}
                />

                <Typography variant="h5" gutterBottom mt={3}>
                    Items
                </Typography>

                <Items items={filteredItems} />
            </Box>)}
        </div>
    );
};

export default Catalog;