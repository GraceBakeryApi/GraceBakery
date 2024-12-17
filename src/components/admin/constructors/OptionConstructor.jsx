import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Popup from '../../Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { MoonLoader } from 'react-spinners';
import Loading from '../../Loading';
import ErrorPage from '../../ErrorPage';

function OptionConstructor({ mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    fetch(`/api/sizes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось получить размеры');
        }
        return response.json();
      })
      .then((data) => {
        setSizes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    const fetchUpdate = async () => {
      try {
        if (id) {
          const response = await fetch(`/api/option/${id}`);
          if (!response.ok) throw new Error('Не удалось загрузить опцию');
          const data = await response.json();
          formik.setValues({
            title_ru: data.title_ru || '',
            title_de: data.title_de || '',
            description_ru: data.description_ru || '',
            description_de: data.description_de || '',
            image: data.image || '',
            price: data.price || '',
            sizeid: data.sizeid || ''
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
      description_ru: '',
      description_de: '',
      image: '',
      price: '',
      sizeid: ''
    },
    onSubmit: async (values) => {
      try {
        const path = mode === 'Добавить' ? '/api/option' : `/api/option/${id}`;
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
      <h1 className="flex justify-center py-3 text-3xl text-beige">{mode} опцию</h1>
      <label className="text-beige text-xl">
        Русский:
        <input
          type="text"
          autocomplete="off"
          name="title_ru"
          onChange={formik.handleChange}
          value={formik.values.title_ru}
          placeholder="Заголовок опции на русском"
          className="input-txt"
        />
        <input
          type="text"
          autocomplete="off"
          name="description_ru"
          onChange={formik.handleChange}
          value={formik.values.description_ru}
          placeholder="Описание опции на русском"
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
          placeholder="Заголовок опции на немецком"
          className="input-txt"
        />
        <input
          type="text"
          autocomplete="off"
          name="description_de"
          onChange={formik.handleChange}
          value={formik.values.description_de}
          placeholder="Описание опции на немецком"
          className="input-txt"
        />
      </label>
      <input
        type="url"
        autocomplete="off"
        name="image"
        onChange={formik.handleChange}
        value={formik.values.image}
        placeholder="Ссылка на изображение"
        className="mt-5 input-txt"
      />
      <label className="text-beige text-xl">
        Размер:
        <select
          name="sizeid"
          onChange={formik.handleChange}
          value={formik.values.sizeid}
          className="input-txt"
        >
          <option value="">Выберите размер</option>
          {sizes.map((size) => (
            <option className='bg-cream-dark' key={size.id} value={size.id}>
              {`${size.title_ru} - ${size.mass} - ${size.persons} чел.`}
            </option>
          ))}
        </select>
      </label>
      <input
        type="number"
        name="price"
        onChange={(e) => formik.setFieldValue('price', e.target.value === '' ? '' : parseFloat(e.target.value))}
        value={formik.values.price === 0 ? '' : formik.values.price}
        placeholder="Цена опции"
        className="mt-5 input-txt"
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

export default OptionConstructor;
