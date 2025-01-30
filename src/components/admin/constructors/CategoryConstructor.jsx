import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import Popup from '../../Popup';
import { Button } from '@mui/material';
import Loading from '../../Loading';
import ErrorPage from '../../ErrorPage';
import * as Yup from "yup";
import ImageInput from './ImageInput';

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
    validationSchema:
      Yup.object({
        sectionid: Yup.string()
          .required("Обязательное"),
        title_ru: Yup.string()
          .min(2, "Минимум 2 символа")
          .max(40, "Максимум 40 символов")
          .required("Обязательное"),
        title_de: Yup.string()
          .min(2, "Минимум 2 символа")
          .max(40, "Максимум 40 символов")
          .required("Обязательное"),
      }),
    onSubmit: async (values) => {
      try {
        console.log('values: ' + JSON.stringify(values));
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
          onBlur={formik.handleBlur}
          value={formik.values.sectionid}
          className="input-txt mt-2 mb-0"
        >
          <option value="">Выберите раздел (Обязательное)</option>
          {activeSections.map((section) => (
            <option className='bg-cream-dark' key={section.id} value={section.id}>
              {section.title_ru}
            </option>
          ))}
          {inactiveSections.map((section) => (
            <option className='bg-red-dark text-cream-dark' key={section.id} value={section.id}>
              {section.title_ru}
            </option>
          ))}
        </select>
      </label>
      {formik.touched.sectionid && formik.errors.sectionid ? <p className='text-red text-sm'>{formik.errors.sectionid}</p> : null}
      <label className="text-beige text-xl block mt-3">
        Русский:
        <input
          type="text"
          autoComplete="off"
          name="title_ru"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title_ru}
          placeholder="Заголовок категории на русском (Обязательное)"
          className="input-txt mt-1 mb-0"
        />
        {formik.touched.title_ru && formik.errors.title_ru ? <p className='text-red text-sm'>{formik.errors.title_ru}</p> : null}
        <input
          type="text"
          autoComplete="off"
          name="description_ru"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description_ru}
          placeholder="Описание категории на русском"
          className="input-txt mt-2 mb-0"
        />
        {formik.touched.description_ru && formik.errors.description_ru ? <p className='text-red text-sm'>{formik.errors.description_ru}</p> : null}
      </label>
      <label className="text-beige text-xl block mt-3">
        Немецкий:
        <input
          type="text"
          autoComplete="off"
          name="title_de"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title_de}
          placeholder="Заголовок категории на немецком (Обязательное)"
          className="input-txt mt-1 mb-0"
        />
        {formik.touched.title_de && formik.errors.title_de ? <p className='text-red text-sm'>{formik.errors.title_de}</p> : null}
        <input
          type="text"
          autoComplete="off"
          name="description_de"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description_de}
          placeholder="Описание категории на немецком"
          className="input-txt mt-2 mb-0"
        />
        {formik.touched.description_de && formik.errors.description_de ? <p className='text-red text-sm'>{formik.errors.description_de}</p> : null}
      </label>
      <label className="text-beige text-xl block mt-3">
        Изображение:
      </label>

      <ImageInput
        formik={formik}
        singleMode={true}
        instanceName="category_id"
      />

      <label className="text-beige text-xl block mt-1">
        <input
          type="checkbox"
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
