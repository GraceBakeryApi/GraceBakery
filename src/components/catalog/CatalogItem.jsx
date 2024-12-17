import React from 'react';
import { Box, Typography, Card, CardActionArea, CardMedia } from '@mui/material';

const CatalogItem = ({ title, image, onClick }) => {
    return (
        <Box flex="1 0 calc(25% - 16px)" m={1}>
            <Card>
                <CardActionArea onClick={onClick}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={image}
                        alt={title}
                    />
                    <Box p={2}>
                        <Typography variant="h6" align="center">
                            {title}
                        </Typography>
                    </Box>
                </CardActionArea>
            </Card>
        </Box>
    );
};

export default CatalogItem;