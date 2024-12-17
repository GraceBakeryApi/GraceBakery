import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import MoonLoader from 'react-spinners/MoonLoader';
import Popup from '../../Popup';
import { Button } from '@mui/material';
import Loading from '../../Loading';
import ErrorPage from '../../ErrorPage';

function CategoryConstructor({ mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [activeSections, setActiveSections] = useState([]);
  const [inactiveSections, setInactiveSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const closePopup = () => setPopupVisible(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const activeResponse = await fetch(`/api/sections/isactive/true`);
        if (!activeResponse.ok) throw new Error('Не удалось получить разделы');
        const activeData = await activeResponse.json();
        setActiveSections(activeData);

        const inactiveResponse = await fetch(`/api/sections/isactive/false`);
        if (!inactiveResponse.ok) throw new Error('Не удалось получить разделы');
        const inactiveData = await inactiveResponse.json();
        setInactiveSections(inactiveData);

        if (id) {
          const categoryResponse = await fetch(`/api/category/${id}`);
          if (!categoryResponse.ok) throw new Error('Не удалось загрузить категорию');
          const categoryData = await categoryResponse.json();
          formik.setValues({
            sectionid: categoryData.sectionid || '',
            title_ru: categoryData.title_ru || '',
            title_de: categoryData.title_de || '',
            description_ru: categoryData.description_ru || '',
            description_de: categoryData.description_de || '',
            image: categoryData.image || '',
            isActive: categoryData.isActive || false,
          });
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSections();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      sectionid: '',
      title_ru: '',
      title_de: '',
      description_ru: '',
      description_de: '',
      image: '',
      isActive: true,
    },
    onSubmit: async (values) => {
      try {
        const path = mode === 'Добавить' ? '/api/category' : `/api/category/${id}`;
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

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorPage message={"Ошибка загрузки" + error} />;
  }

  return (
    <form className="bg-cream px-4" onSubmit={formik.handleSubmit}>
      <h1 className="flex justify-center py-3 text-3xl text-beige">{mode} категорию</h1>
      <label className="text-beige text-xl">
        Раздел:
        <select
          name="sectionid"
          onChange={formik.handleChange}
          value={formik.values.sectionid}
          className="input-txt"
        >
          <option value="">Выберите раздел</option>
          {activeSections.map((section) => (
            <option className='bg-cream-dark' key={section.id} value={section.id}>
              {section.title_ru}
            </option>
          ))}
          {inactiveSections.map((section) => (
            <option className='bg-red-dark' key={section.id} value={section.id}>
              {section.title_ru}
            </option>
          ))}
        </select>
      </label>
      <label className="text-beige text-xl">
        Русский:
        <input
          type="text"
          autocomplete="off"
          name="title_ru"
          onChange={formik.handleChange}
          value={formik.values.title_ru}
          placeholder="Заголовок категории на русском"
          className="input-txt"
        />
        <input
          type="text"
          autocomplete="off"
          name="description_ru"
          onChange={formik.handleChange}
          value={formik.values.description_ru}
          placeholder="Описание категории на русском"
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
          placeholder="Заголовок категории на немецком"
          className="input-txt"
        />
        <input
          type="text"
          autocomplete="off"
          name="description_de"
          onChange={formik.handleChange}
          value={formik.values.description_de}
          placeholder="Описание категории на немецком"
          className="input-txt"
        />
      </label>
      <input
        type="text"
        autocomplete="off"
        name="image"
        onChange={formik.handleChange}
        value={formik.values.image}
        placeholder="Ссылка на изображение"
        className="mt-5 input-txt"
      />
      <label className="text-xl">
        <input
          type="checkbox"
          autocomplete="off"
          name="isActive"
          onChange={formik.handleChange}
          checked={formik.values.isActive}
          className="mt-5 mr-2"
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
  );
}

export default CategoryConstructor;
