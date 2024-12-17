import React from 'react';
import { Stack } from '@mui/material';
import CatalogItem from './CatalogItem';

const Items = ({ items }) => {
    return (
        <Stack direction="row" spacing={2} flexWrap="wrap">
            {items.map(item => (
                <CatalogItem
                    key={item.id}
                    title={item.name}
                    image={item.image}
                    onClick={() => console.log(`Открытие предмета с id: ${item.id}`)}
                />
            ))}
        </Stack>
    );
};

export default Items;