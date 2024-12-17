import React from 'react';
import { Stack } from '@mui/material';
import CatalogItem from './CatalogItem';

const Categories = ({ categories, onCategorySelect }) => {
    return (
        <Stack direction="row" spacing={2} flexWrap="wrap">
            {categories.map(category => (
                <CatalogItem
                    key={category.id}
                    title={category.title}
                    image={category.image}
                    onClick={() => onCategorySelect(category)}
                />
            ))}
        </Stack>
    );
};

export default Categories;