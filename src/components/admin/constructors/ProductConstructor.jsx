import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Popup from '../../Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import * as Yup from "yup";
import Loading from '../../Loading';
import ErrorPage from '../../ErrorPage';
import ImageInput from './ImageInput';

function ProductConstructor({ mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [activeCategories, setActiveCategories] = useState([]);
  const [inactiveCategories, setInactiveCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [filters, setFilters] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({
    ingredients: false,
    options: false,
    filters: false,
    sizes: false,
  });
  const [imageInputs, setImageInputs] = useState([]);
  const [nextId, setNextId] = useState(0);

  const closePopup = () => setPopupVisible(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesActiveRes, categoriesInactiveRes, sizesRes, optionsRes, filtersRes, ingredientsRes] = await Promise.all([
          fetch('/api/categories/isactive/true'),
          fetch('/api/categories/isactive/false'),
          fetch('/api/sizes'),
          fetch('/api/options'),
          fetch('/api/filters'),
          fetch('/api/ingredients'),
        ]);

        if (!categoriesActiveRes.ok || !categoriesInactiveRes.ok || !sizesRes.ok || !optionsRes.ok || !filtersRes.ok || !ingredientsRes.ok) {
          throw new Error('Ошибка загрузки данных');
        }

        const [categoriesActive, categoriesInactive, sizesData, optionsData, filtersData, ingredientsData] = await Promise.all([
          categoriesActiveRes.json(),
          categoriesInactiveRes.json(),
          sizesRes.json(),
          optionsRes.json(),
          filtersRes.json(),
          ingredientsRes.json(),
        ]);

        setActiveCategories(categoriesActive);
        setInactiveCategories(categoriesInactive);
        setSizes(sizesData);
        setOptions(optionsData);
        setFilters(filtersData);
        setIngredients(ingredientsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchUpdate = async () => {
      try {
        if (id) {
          const response = await fetch(`/api/product/${id}`);
          if (!response.ok) throw new Error('Не удалось загрузить продукт');
          const data = await response.json();
          formik.setValues({
            categoryid: data.categoryid || '',
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
    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      categoryid: '',
      title_ru: '',
      title_de: '',
      description_ru: '',
      description_de: '',
      image: [],
      sizes: [],
      ingredients: [],
      options: [],
      filters: [],
      isActive: true,
    },
    validationSchema: Yup.object({
      categoryid: Yup.string()
        .required("Обязательное"),
      title_ru: Yup.string()
        .min(2, "Минимум 2 символа")
        .max(40, "Максимум 40 символов")
        .required("Обязательное"),
      title_de: Yup.string()
        .min(2, "Минимум 2 символа")
        .max(40, "Максимум 40 символов")
        .required("Обязательное"),
      image: Yup.array()
        .min(1, "Должно быть хотя бы одно изображение")
        .max(20, "Не может быть больше 20 изображений"),
      sizes: Yup.array()
        .min(1, "Должнен быть хотя бы 1 размер")
        .required("Обязательное"),
      ingredients: Yup.array()
        .min(1, "Должна быть хотя бы одна начинка")
        .required("Обязательное"),
    }),
    onSubmit: async (values) => {
      try {
        const path = mode === 'Добавить' ? '/api/product' : `/api/product/${id}`;
        const response = await fetch(path, {
          method: mode === 'Добавить' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'multipart/form-data' },
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

  const toggleDropdown = (field) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [field]: !prev[field],
      ingredients: field === 'ingredients' ? !prev.ingredients : false,
      options: field === 'options' ? !prev.options : false,
      filters: field === 'filters' ? !prev.filters : false,
    }));
  };

  const handleCheckboxChange = (e, field) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const currentValues = formik.values[field] || [];
    if (checked) {
      formik.setFieldValue(field, [...currentValues, +value]);
    } else {
      formik.setFieldValue(field, currentValues.filter((item) => item !== +value));
    }
  };

  const handleClickInsideDropdown = (e, field) => {
    e.stopPropagation();
  };

  const renderDropdown = (field, items) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => toggleDropdown(field)}
        className="input-txt w-full mb-0"
      >
        Выберите {field === 'ingredients' ? 'начинки' : field === 'options' ? 'опции' : field === 'sizes' ? 'размеры' : 'фильтры'}
      </button>
      {dropdownOpen[field] && (
        <div
          className="absolute bg-cream border border-beige-dark mt-1 max-h-48 overflow-auto w-full z-10"
          onClick={(e) => handleClickInsideDropdown(e, field)}
        >
          {items.map((item) => (
            <label key={item.id} className="block px-4 py-2">
              <input
                type="checkbox"
                value={item.id}
                checked={formik.values[field].includes(item.id)}
                onChange={(e) => handleCheckboxChange(e, field)}
                className="mr-2"
              />
              {item.title_ru}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const handleCancel = () => {
    navigate(`/admin/categories`);
  };

  const addImageInput = () => {
    if (imageInputs.length < 10) {
      setImageInputs((prev) => [...prev, { id: nextId }]);
      setNextId((prevId) => prevId + 1);
    }
  };

  const handleImageDelete = (idToRemove) => {
    setImageInputs((prev) => prev.filter((input) => input.id !== idToRemove));
  };

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorPage message={"Ошибка загрузки" + error} />;
  }

  return (
    <form className="bg-cream px-4" onSubmit={formik.handleSubmit}>
      <h1 className="flex justify-center py-3 text-3xl text-beige">{mode} продукт</h1>
      <label className="text-beige text-xl">
        Категория:
        <select
          name="categoryid"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.categoryid}
          className="input-txt mt-1 mb-0"
        >
          <option value="">Выберите категорию (Обязательное)</option>
          {activeCategories.map((category) => (
            <option className='bg-cream-dark' key={category.id} value={category.id}>
              {category.title_ru}
            </option>
          ))}
          {inactiveCategories.map((category) => (
            <option className='bg-red-dark' key={category.id} value={category.id}>
              {category.title_ru}
            </option>
          ))}
        </select>
      </label>
      {formik.touched.categoryid && formik.errors.categoryid ? <p className='text-red text-sm'>{formik.errors.categoryid}</p> : null}
      <label className="text-beige text-xl block mt-3">
        Русский:
        <input
          id="title_ru"
          name="title_ru"
          type="text"
          placeholder="Заголовок продукта на русском (Обязательное)"
          className="input-txt w-full mt-1 mb-0"
          value={formik.values.title_ru}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title_ru && formik.errors.title_ru ? <p className='text-red text-sm'>{formik.errors.title_ru}</p> : null}
      </label>

      <label className="text-beige text-xl block mt-3">
        Немецкий:
        <input
          id="title_de"
          name="title_de"
          type="text"
          placeholder="Заголовок продукта на немецком (Обязательное)"
          className="input-txt w-full mt-1 mb-0"
          value={formik.values.title_de}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title_de && formik.errors.title_de ? <p className='text-red text-sm'>{formik.errors.title_de}</p> : null}
      </label>

      <div className="mt-4">
        <label className="text-beige text-xl block mt-3">Изображения</label>
        {imageInputs.map((input) => (
          <ImageInput
            key={input.id}
            id={input.id}
            deleteText='Удалить'
            handleImageDelete={handleImageDelete}
          />
        ))}
        <div className="flex">
          <Button
            variant="contained"
            color="secondary"
            onClick={addImageInput}
            sx={{ flexGrow: 1, marginRight: 0, marginTop: 0 }}
            disabled={imageInputs.length >= 10}
          >
            Добавить изображение
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {renderDropdown('sizes', sizes)}
        {renderDropdown('ingredients', ingredients)}
        {renderDropdown('options', options)}
        {renderDropdown('filters', filters)}
      </div>

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

      {isPopupVisible && (
        <Popup message={popupMessage} onClose={closePopup} />
      )}
    </form>
  );
}

export default ProductConstructor;
