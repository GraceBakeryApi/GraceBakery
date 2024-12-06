import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Popup from '../../Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { MoonLoader } from 'react-spinners';

function SectionConstructor({ mode }) {
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
          const response = await fetch(`/api/section/${id}`);
          if (!response.ok) throw new Error('Не удалось загрузить раздел');
          const data = await response.json();
          formik.setValues({
            title_ru: data.title_ru || '',
            title_de: data.title_de || '',
            description_ru: data.description_ru || '',
            description_de: data.description_de || '',
            image: data.image || '',
            isActive: data.isActive || false
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
      title_de: "",
      title_ru: "",
      description_de: "",
      description_ru: "",
      image: "",
      isActive: true
    },
    onSubmit: async (values) => {
      try {
        const path = mode === 'Добавить' ? '/api/section' : `/api/section/${id}`;
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
    return <div className='flex justify-center mt-12'><MoonLoader size={'45 rem'} /></div>;
  }

  if (error) {
    return <div className="text-red-dark text-4xl">Ошибка загрузки: {error}</div>;
  }

  return (
    <form className='bg-cream px-4' onSubmit={formik.handleSubmit}>
      <h1 className='flex justify-center py-3 text-3xl text-beige'>{mode} раздел</h1>
      <label className='text-beige text-xl'>
        Русский:
        <input
          type="text"
          autocomplete="off"
          name="title_ru"
          onChange={formik.handleChange}
          value={formik.values.title_ru}
          placeholder='Заголовок раздела на русском'
          className='input-txt'
        />
        <input
          type="text"
          autocomplete="off"
          name="description_ru"
          onChange={formik.handleChange}
          value={formik.values.description_ru}
          placeholder='Описание раздела на русском'
          className='input-txt'
        />
      </label>
      <label className='text-beige text-xl'>
        Немецкий:
        <input
          type="text"
          autocomplete="off"
          name="title_de"
          onChange={formik.handleChange}
          value={formik.values.title_de}
          placeholder='Заголовок раздела на немецком'
          className='input-txt'
        />
        <input
          type="text"
          autocomplete="off"
          name="description_de"
          onChange={formik.handleChange}
          value={formik.values.description_de}
          placeholder='Описание раздела на немецком'
          className='input-txt'
        />
      </label>
      <input
        type="url"
        autocomplete="off"
        name="image"
        onChange={formik.handleChange}
        value={formik.values.image}
        placeholder='Ссылка на изображение'
        className='mt-5 input-txt'
      />
      <label className='text-xl'>
        <input
          type="checkbox"
          autocomplete="off"
          name="isActive"
          onChange={formik.handleChange}
          checked={formik.values.isActive}
          className='mt-5 mr-2'
        />
        Сделать активным
      </label>

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
  )
}

export default SectionConstructor;