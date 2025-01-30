import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Popup from '../../Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import * as Yup from "yup";
import Loading from '../../Loading';
import ErrorPage from '../../ErrorPage';

function FilterConstructor({ mode }) {
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
          const response = await fetch(`/api/filter/${id}`);
          if (!response.ok) throw new Error('Не удалось загрузить фильтр');
          const data = await response.json();
          formik.setValues({
            title_ru: data.title_ru || '',
            title_de: data.title_de || ''
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
      title_de: ''
    },
    validationSchema:
      Yup.object({
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
        const path = mode === 'Добавить' ? '/api/filter' : `/api/filter/${id}`;
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
      <h1 className="flex justify-center py-3 text-3xl text-beige">{mode} фильтр</h1>
      <label className="text-beige text-xl">
        Русский:
        <input
          type="text"
          autoComplete="off"
          name="title_ru"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title_ru}
          placeholder="Заголовок фильтра на русском (Обязательное)"
          className="input-txt mt-1 mb-0"
        />
      </label>
      {formik.touched.title_ru && formik.errors.title_ru ? <p className='text-red text-sm'>{formik.errors.title_ru}</p> : null}
      <label className="text-beige text-xl block mt-3">
        Немецкий:
        <input
          type="text"
          autoComplete="off"
          name="title_de"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title_de}
          placeholder="Заголовок фильтра на немецком (Обязательное)"
          className="input-txt mt-1 mb-0"
        />
      </label>
      {formik.touched.title_de && formik.errors.title_de ? <p className='text-red text-sm'>{formik.errors.title_de}</p> : null}
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

export default FilterConstructor;
