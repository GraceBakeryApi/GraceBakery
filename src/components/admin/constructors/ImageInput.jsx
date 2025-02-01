import { Button, styled } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

function ImageInput({ handleImageDelete, deleteText = "Очистить", id, formik, instanceId = 0, instanceName, singleMode = false, mode, checkUploaded: propCheckUploaded }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploaded, setIsUploaded] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const splittedInstance = instanceName.split('_');
    const langTag = (splittedInstance.length === 3) ? ('_' + splittedInstance[2]) : "";

    const defaultCheckUploaded = useCallback(
        (currentId, uploaded) => {
            formik.setFieldValue('imagesUploaded', uploaded);
        },
        [formik]
    );

    const checkUploaded = propCheckUploaded ?? defaultCheckUploaded;

    const existingImage = useMemo(() => {
        if (singleMode) {
            const imageValue = formik.values[`image${langTag}`];
            return typeof imageValue === 'string' ? { url: imageValue } : null;
        }
        return formik.values.image?.find(img => img.id === id && img.url !== '') || null;
    }, [formik.values, singleMode, langTag, id]);

    useEffect(() => {
        if (mode === 'Редактировать') {
            const actuallyUploaded = !!existingImage?.url;
            if (isUploaded !== actuallyUploaded) {
                setIsUploaded(actuallyUploaded);
                checkUploaded(id, actuallyUploaded);
            }
        }
    }, [existingImage?.url, mode, id, checkUploaded]);

    useEffect(() => {
        if (!formik.values[`image${langTag}`]) {
            setImagePreview(null);
            setSelectedFile(null);
        }
    }, [formik.values, langTag]);

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

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];

        if (file && validExtensions.includes(file.type)) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setIsUploaded(false);
            checkUploaded(id, false);
        } else {
            alert("Пожалуйста, выберите файл формата .png, .jpg или .jpeg.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Пожалуйста, сначала выберите файл");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('product_id', instanceId);

        setIsUploading(true);
        try {
            const response = await axios.post('/api/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201 && response.data) {
                if (singleMode) {
                    formik.setFieldValue(`image${langTag}`, response.data.image);
                } else {
                    const { id: uploadedImageId, image } = response.data;
                    const url = image;
                    const updatedImages = [...formik.values.image];
                    const existingImageIndex = updatedImages.findIndex((img) => img.id === id);

                    if (existingImageIndex !== -1) {
                        updatedImages[existingImageIndex] = { id: uploadedImageId, url };
                    } else {
                        updatedImages.push({ id: uploadedImageId, url });
                    }
                    formik.setFieldValue('image', updatedImages);
                }
                alert('Файл успешно загружен');
                setSelectedFile(null);
                setIsUploaded(true);
                checkUploaded(id, true);
            }
        } catch (error) {
            console.error('Ошибка загрузки изображения: ', error);
            alert('Произошла ошибка при загрузке изображения');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async () => {
        if (existingImage && !singleMode) {
            try {
                await fetch(`/api/image/${existingImage.id}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Ошибка при удалении изображения: ', error);
            }
        }

        if (singleMode) {
            try {
                await fetch(`/api/image/file`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: formik.values[`image${langTag}`]
                });
            } catch (error) {
                console.error('Ошибка при удалении изображения: ', error);
            }
            formik.setFieldValue(`image${langTag}`, '');
        } else {
            handleImageDelete(id);
        }
        setSelectedFile(null);
        setImagePreview(null);
        setIsUploaded(false);
        checkUploaded(id, false);
    };

    return (
        <div className='border-2 rounded-lg border-beige-dark my-2 p-1'>
            <div className="flex justify-between h-16">
                <div className="inline mr-8 text-beige">
                    {imagePreview || (existingImage && existingImage.url) ? (
                        <img
                            src={(imagePreview || 'http://' + existingImage.url)}
                            alt="Миниатюра"
                            style={{ maxWidth: '8rem', maxHeight: '4rem', objectFit: 'cover' }}
                            onError={(e) => {
                                console.error("Ошибка, ссылка на изображение: " + e.target.src);
                            }}
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
                        onChange={handleFileSelect}
                    />
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ flexGrow: 1, marginRight: 2, marginTop: 0 }}
                    onClick={handleUpload}
                    disabled={isUploading || !selectedFile}
                >
                    {isUploading ? 'Загрузка...' : 'Загрузить изображение'}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    sx={{ flexGrow: 1, marginRight: 0, marginTop: 0 }}
                    onClick={handleDeleteImage}
                    disabled={isUploading}
                >
                    {deleteText}
                </Button>
            </div>
            {!isUploaded && <p className='text-red text-sm text-right'>Изображение выбрано, но не загружено</p>}
        </div>
    );
}

export default ImageInput;