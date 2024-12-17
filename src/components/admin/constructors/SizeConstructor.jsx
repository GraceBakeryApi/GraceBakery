import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Popup from '../../Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { MoonLoader } from 'react-spinners';
import Loading from '../../Loading';
import ErrorPage from '../../ErrorPage';

function SizeConstructor({ mode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        const fetchUpdate = async () => {
            try {
                if (id) {
                    const response = await fetch(`/api/size/${id}`);
                    if (!response.ok) throw new Error('Не удалось загрузить размер');
                    const data = await response.json();
                    formik.setValues({
                        title_ru: data.title_ru || '',
                        title_de: data.title_de || '',
                        mass: data.mass || '',
                        diameter: data.diameter || '',
                        persons: data.persons || ''
                    });
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUpdate();
    }, [id]);

    const formik = useFormik({
        initialValues: {
            title_ru: '',
            title_de: '',
            mass: '',
            diameter: '',
            persons: ''
        },
        onSubmit: async (values) => {
            try {
                const path = mode === 'Добавить' ? '/api/size' : `/api/size/${id}`;
                const response = await fetch(path, {
                    method: mode === 'Добавить' ? 'POST' : 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    setPopupMessage('Успешно');
                    if (mode === 'Добавить') formik.resetForm();
                } else {
                    setPopupMessage('Ошибка');
                }
            } catch (error) {
                setPopupMessage('Не удалось подключиться к серверу.');
            }
            setPopupVisible(true);
        },
    });

    const handleCancel = () => {
        navigate(`/admin/categories`);
    };

    const closePopup = () => setPopupVisible(false);

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <ErrorPage message={"Ошибка загрузки" + error} />;
    }

    return (
        <form className="bg-cream px-4" onSubmit={formik.handleSubmit}>
            <h1 className="flex justify-center py-3 text-3xl text-beige">{mode} размер</h1>
            <label className="text-beige text-xl">
                Русский:
                <input
                    type="text"
                    autocomplete="off"
                    name="title_ru"
                    onChange={formik.handleChange}
                    value={formik.values.title_ru}
                    placeholder="Заголовок размера на русском"
                    className="input-txt"
                />
            </label>
            <label className="text-beige text-xl">
                Немецкий:
                <input
                    type="text"
                    autocomplete="off"
                    name="title_de"
                    onChange={formik.handleChange}
                    value={formik.values.title_de}
                    placeholder="Заголовок размера на немецком"
                    className="input-txt"
                />
            </label>
            <input
                type="number"
                autocomplete="off"
                name="mass"
                onChange={formik.handleChange}
                value={formik.values.mass}
                placeholder="Масса"
                className="input-txt mt-5"
            />
            <input
                type="number"
                autocomplete="off"
                name="diameter"
                onChange={formik.handleChange}
                value={formik.values.diameter}
                placeholder="Диаметр"
                className="input-txt"
            />
            <input
                type="number"
                autocomplete="off"
                name="persons"
                onChange={formik.handleChange}
                value={formik.values.persons}
                placeholder="Количество людей"
                className="input-txt"
            />
            <div className="flex justify-between my-4">
                <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    sx={{ flexGrow: 1, marginRight: 1 }}
                >
                    Отменить
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ flexGrow: 1, marginLeft: 1 }}
                >
                    Сохранить
                </Button>
            </div>
            {isPopupVisible && <Popup message={popupMessage} onClose={closePopup} />}
        </form>
    );
}

export default SizeConstructor;
