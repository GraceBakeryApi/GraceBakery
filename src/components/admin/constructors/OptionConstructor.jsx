import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Popup from '../../Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import * as Yup from "yup";
import Loading from '../../Loading';
import ErrorPage from '../../ErrorPage';
import ImageInput from './ImageInput';

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

          // Подготовим значения для формы
          const sizeprices = data.sizeprices.map((item) => ({
            price: item.price || '',
            sizeid: item.sizeid || '',
            selected: false // Добавляем поле для выбора
          }));

          formik.setValues({
            title_ru: data.title_ru || '',
            title_de: data.title_de || '',
            description_ru: data.description_ru || '',
            description_de: data.description_de || '',
            image: data.image || '',
            sizeprices: sizeprices || []  // Массив с объектами price и sizeid
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
      sizeprices: []  // Инициализируем как пустой массив
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
          body: JSON.stringify(values), // Отправляем весь объект с массивом sizeprices
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

  const handleAddImage = () => {
    console.log("Image selected");
  };

  const closePopup = () => setPopupVisible(false);

  const handleDeleteSelected = () => {
    // Удаляем только те элементы, где selected = true
    const updatedSizeprices = formik.values.sizeprices.filter(item => !item.selected);
    formik.setFieldValue('sizeprices', updatedSizeprices);
  };

  // Функция для фильтрации доступных размеров
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

        {/* Русский и Немецкий */}
        <label className="text-beige text-xl">
          Русский:
          <input
              type="text"
              autocomplete="off"
              name="title_ru"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title_ru}
              placeholder="Заголовок опции на русском"
              className="input-txt"
          />
          {formik.touched.title_ru && formik.errors.title_ru ? <p className='text-red'>{formik.errors.title_ru}</p> : null}
          <input
              type="text"
              autocomplete="off"
              name="description_ru"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description_ru}
              placeholder="Описание опции на русском"
              className="input-txt"
          />
          {formik.touched.description_ru && formik.errors.description_ru ? <p className='text-red'>{formik.errors.description_ru}</p> : null}
        </label>

        <label className="text-beige text-xl">
          Немецкий:
          <input
              type="text"
              autocomplete="off"
              name="title_de"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title_de}
              placeholder="Заголовок опции на немецком"
              className="input-txt"
          />
          {formik.touched.title_de && formik.errors.title_de ? <p className='text-red'>{formik.errors.title_de}</p> : null}
          <input
              type="text"
              autocomplete="off"
              name="description_de"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description_de}
              placeholder="Описание опции на немецком"
              className="input-txt"
          />
          {formik.touched.description_de && formik.errors.description_de ? <p className='text-red'>{formik.errors.description_de}</p> : null}
        </label>

        {/* Изображение */}
        <label className="text-beige text-xl">
          Изображение:
          <ImageInput handleAddImage={handleAddImage} />
        </label>

        {/* Массив с размерами и ценами */}
        <div className="text-beige text-xl">
          <label>Размеры и цены:</label>
          {formik.values.sizeprices.map((sizePrice, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                    type="checkbox"
                    checked={sizePrice.selected}
                    onChange={() => {
                      const updatedSizeprices = [...formik.values.sizeprices];
                      updatedSizeprices[index].selected = !updatedSizeprices[index].selected;
                      formik.setFieldValue('sizeprices', updatedSizeprices);
                    }}
                />
                <select
                    name={`sizeprices[${index}].sizeid`}
                    value={sizePrice.sizeid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="input-txt mx-2"
                >
                  <option value="">Выберите размер</option>
                  {getAvailableSizes(index).map((size) => (
                      <option className='bg-cream-dark' key={size.id} value={size.id}>
                        {`${size.title_ru} - ${size.mass} - ${size.persons} чел.`}
                      </option>
                  ))}
                </select>
                <input
                    type="number"
                    name={`sizeprices[${index}].price`}
                    value={sizePrice.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Цена"
                    className="input-txt"
                />
              </div>
          ))}
          <div className="flex justify-between mt-4">
            <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  formik.setFieldValue('sizeprices', [...formik.values.sizeprices, { price: '', sizeid: '', selected: false }]);
                }}
                sx={{ flexGrow: 1, marginRight: 1 }}
            >
              Добавить размер
            </Button>
            <Button
                type="button"
                variant="outlined"
                color="error"
                onClick={handleDeleteSelected}
                sx={{ flexGrow: 1, marginLeft: 1 }}
            >
              Удалить выбранные
            </Button>
          </div>
        </div>

        {/* Кнопки Отменить и Сохранить */}
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
