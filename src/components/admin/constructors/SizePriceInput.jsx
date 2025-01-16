import React from 'react';
import { Button } from '@mui/material';

function SizePriceInput({
    sizePrice,
    index,
    getAvailableSizes,
    formik,
    handleDelete,
}) {
    return (
        <div className="flex items-center my-2">
            <select
                name={`sizeprices[${index}].sizeid`}
                value={sizePrice.sizeid}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="input-txt mr-2 my-0"
            >
                <option value="">Выберите размер</option>
                {getAvailableSizes(index).map((size) => (
                    <option key={size.id} value={size.id}>
                        {`${size.title_ru} - ${size.mass} - ${size.persons} чел.`}
                    </option>
                ))}
            </select>
            -
            <input
                type="number"
                name={`sizeprices[${index}].price`}
                value={sizePrice.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Цена"
                className="input-txt mx-2 my-0"
            />
            <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(index)}
                sx={{ flexGrow: 1, marginRight: 0, marginTop: 0, minWidth: "10%" }}
            >
                Удалить
            </Button>
        </div>
    );
}

export default SizePriceInput;
