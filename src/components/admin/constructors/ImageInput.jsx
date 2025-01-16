import { Button, styled } from '@mui/material';
import React, { useState } from 'react';

function ImageInput({ handleImageDelete, deleteText = "Очистить", id }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [deleteCapture, setDeleteCapture] = useState(deleteText);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleAddImage = (e) => {
        const file = e.target.files[0];
        const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
        if (file && validExtensions.includes(file.type)) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            alert("Пожалуйста, выберите файл формата .png, .jpg или .jpeg.");
        }
    };

    const handleDeleteImage = () => {
        if (handleImageDelete) {
            handleImageDelete(id);
        } else {
            setSelectedFile(null);
            setImagePreview(null);
        }
    };

    return (
        <div className="flex justify-between my-2 h-16">
            <div className="inline mr-8 text-beige">
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Миниатюра"
                        style={{ maxWidth: '8rem', maxHeight: '4rem', objectFit: 'cover', }}
                    />
                ) : (
                    "Файл не выбран"
                )}
            </div>
            <Button
                component="label"
                variant="contained"
                color="secondary"
                sx={{ flexGrow: 1, marginRight: 2, marginTop: 0 }}
            >
                Выбрать файл...
                <VisuallyHiddenInput
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleAddImage}
                />
            </Button>
            <Button
                component="label"
                variant="contained"
                color="secondary"
                sx={{ flexGrow: 1, marginRight: 2, marginTop: 0 }}
                onClick={console.log("Фетч поехал")}
            >
                Загрузить
            </Button>
            <Button
                component="label"
                variant="contained"
                color="error"
                sx={{ flexGrow: 1, marginRight: 0, marginTop: 0 }}
                onClick={handleDeleteImage}
            >
                {deleteCapture}
            </Button>
        </div>
    );
}

export default ImageInput;
