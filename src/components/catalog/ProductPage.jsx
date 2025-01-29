import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TextField,
    Snackbar,
    Alert,
    ImageList,
    ImageListItem,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 1200,
    margin: 'auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2)
}));

const ProductPage = () => {
    // TODO: Удалить после добавления роутинга и получать id из параметров URL
    const productId = 2;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // TODO: Удалить после добавления роутинга и перенести логику получения продукта
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/product/${productId}`);
                if (!response.ok) {
                    throw new Error('Не удалось загрузить товар');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography>Товар не найден</Typography>
            </Box>
        );
    }

    const selectedSizePrice = product.sizeprices.find(
        size => size.sizeid === selectedSize
    )?.price || 0;

    const handleAddToCart = () => {
        if (!selectedSize || !selectedIngredient) {
            setSnackbar({
                open: true,
                message: 'Пожалуйста, выберите размер и начинку',
                severity: 'error'
            });
            return;
        }

        const cartItem = {
            productId: product.id,
            sizeId: selectedSize,
            ingredientId: selectedIngredient,
            optionIds: selectedOptions,
            quantity: quantity,
            totalPrice: selectedSizePrice * quantity
        };

        console.log('Добавлено в корзину:', cartItem);

        setSnackbar({
            open: true,
            message: 'Товар добавлен в корзину',
            severity: 'success'
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <StyledCard>
            <CardContent>
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                    {/* Галерея изображений */}
                    <Box flex={1}>
                        <ImageList sx={{ maxHeight: 500 }} cols={1} rowHeight={400}>
                            {product.image.map((img) => (
                                <ImageListItem key={img.id}>
                                    <img
                                        src={`/api/images/${img.image.split('\\').pop()}`}
                                        alt={product.title_ru}
                                        loading="lazy"
                                        style={{ height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>

                    {/* Информация о продукте и выбор опций */}
                    <Box flex={1} display="flex" flexDirection="column" gap={2}>
                        <Typography variant="h4">
                            {product.title_ru}
                        </Typography>

                        {product.description_ru && (
                            <Typography variant="body1">
                                {product.description_ru}
                            </Typography>
                        )}

                        {/* Выбор размера */}
                        <FormControl required>
                            <InputLabel>Размер</InputLabel>
                            <Select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                label="Размер"
                            >
                                {product.sizeprices.map((size) => (
                                    <MenuItem key={size.sizeid} value={size.sizeid}>
                                        {size.title_ru} - {size.diameter}см - {size.price}€
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {selectedSize && `До ${product.sizeprices.find(s => s.sizeid === selectedSize)?.persons} персон`}
                            </FormHelperText>
                        </FormControl>

                        {/* Выбор начинки */}
                        <FormControl required>
                            <InputLabel>Начинка</InputLabel>
                            <Select
                                value={selectedIngredient}
                                onChange={(e) => setSelectedIngredient(e.target.value)}
                                label="Начинка"
                            >
                                {product.ingredients.map((ingredient) => (
                                    <MenuItem key={ingredient.id} value={ingredient.id}>
                                        {ingredient.title_ru}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Дополнительные опции */}
                        {product.bakeryoptionals.length > 0 && (
                            <FormControl>
                                <InputLabel>Дополнительные опции</InputLabel>
                                <Select
                                    multiple
                                    value={selectedOptions}
                                    onChange={(e) => setSelectedOptions(e.target.value)}
                                    label="Дополнительные опции"
                                >
                                    {product.bakeryoptionals.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.title_ru}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Количество и кнопка добавления в корзину */}
                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                type="number"
                                label="Количество"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                InputProps={{ inputProps: { min: 1 } }}
                                sx={{ width: 100 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddShoppingCartIcon />}
                                onClick={handleAddToCart}
                                disabled={!selectedSize || !selectedIngredient}
                            >
                                Добавить в корзину
                            </Button>
                        </Box>

                        {/* Итоговая цена */}
                        <Typography variant="h6">
                            Итого: {(selectedSizePrice * quantity).toFixed(2)}€
                        </Typography>
                    </Box>
                </Box>

                {/* Уведомления */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </StyledCard>
    );
};

export default ProductPage;