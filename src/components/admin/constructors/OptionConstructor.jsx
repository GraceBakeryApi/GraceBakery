import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Popup from '../../Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import * as Yup from "yup";
import Loading from '../../Loading';
import ErrorPage from '../../ErrorPage';
import ImageInput from './ImageInput';
import SizePriceInput from './SizePriceInput';

function OptionConstructor({ mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [sizes, setSizes] = useState([]);

  const formik = useFormik({
    initialValues: {
      title_ru: '',
      title_de: '',
      description_ru: '',
      description_de: '',
      image: '',
      sizeprices: [],
      isActive: true,
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
        sizeprices: Yup.array().of(
          Yup.object().shape({
            price: Yup.number()
              .positive("Только положительное число")
              .required("Обязательное"),
            sizeid: Yup.string()
              .required("Обязательное")
          })
        ).min(1, "Необходимо выбрать хотя бы один размер и цену")
      }),
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

          const sizeprices = data.sizeprices.map((item) => ({
            price: item.price || '',
            sizeid: item.sizeid || ''
          }));

          formik.setValues({
            title_ru: data.title_ru || '',
            title_de: data.title_de || '',
            description_ru: data.description_ru || '',
            description_de: data.description_de || '',
            image: data.image || '',
            sizeprices: sizeprices || [],
            isActive: Boolean(data.isActive)
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

  const handleCancel = () => {
    navigate(`/admin/categories`);
  };

  const closePopup = () => setPopupVisible(false);

  const getAvailableSizes = (index) => {
    const selectedSizeIds = formik.values.sizeprices
      .filter((_, i) => i !== index && formik.values.sizeprices[i].sizeid)
      .map(item => item.sizeid);
    return sizes.filter(size => !selectedSizeIds.includes(size.id));
  };

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorPage message={"Ошибка загрузки" + error} />;
  }

  return (
    <form className="bg-cream px-4" onSubmit={formik.handleSubmit}>
      <h1 className="flex justify-center py-3 text-3xl text-beige">{mode} опцию</h1>

      <label className="text-beige text-xl block mt-3">
        Русский:
        <input
          type="text"
          autoComplete="off"
          name="title_ru"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title_ru}
          placeholder="Заголовок опции на русском (Обязательное)"
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
          placeholder="Описание опции на русском"
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
          placeholder="Заголовок опции на немецком (Обязательное)"
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
          placeholder="Описание опции на немецком"
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
        instanceName="option_id"
      />

      <div className="text-beige text-xl justify-between">
        <label>Размеры и цены:</label>
        {formik.values.sizeprices.map((sizePrice, index) => (
          <SizePriceInput
            key={index}
            sizePrice={sizePrice}
            index={index}
            getAvailableSizes={getAvailableSizes}
            formik={formik}
            handleDelete={(idx) => {
              const updatedSizeprices = [...formik.values.sizeprices];
              updatedSizeprices.splice(idx, 1);
              formik.setFieldValue('sizeprices', updatedSizeprices);
            }}
          />
        ))}
        <div className="flex">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              formik.setFieldValue('sizeprices', [...formik.values.sizeprices, { price: '', sizeid: '', selected: false }]);
            }}
            sx={{ flexGrow: 1, marginRight: 0, marginTop: 0 }}
          >
            Добавить размер
          </Button>
        </div>
      </div>
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

export default OptionConstructor;
