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

function ProductConstructor({ mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [activeCategories, setActiveCategories] = useState([]);
  const [inactiveCategories, setInactiveCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [filters, setFilters] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({
    ingredients: false,
    options: false,
    filters: false
  });
  const [imageInputs, setImageInputs] = useState([]);
  const [nextId, setNextId] = useState(0);

  const closePopup = () => setPopupVisible(false);

  useEffect(() => { //UseEffect для дропдаунов
    const handleClickOutside = (e) => {
      const isAnyDropdownOpen = Object.values(dropdownOpen).some(status => status);
      if (!isAnyDropdownOpen) return;

      setDropdownOpen({
        ingredients: false,
        options: false,
        filters: false
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => { //UseEffect для загрузки компонента
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

    const fetchData = async () => {
      try {
        const [categoriesActiveRes, categoriesInactiveRes, optionsRes, filtersRes, ingredientsRes] = await Promise.all([
          fetch('/api/categories/isactive/true'),
          fetch('/api/categories/isactive/false'),
          fetch('/api/options'),
          fetch('/api/filters'),
          fetch('/api/ingredients'),
        ]);

        if (!categoriesActiveRes.ok || !categoriesInactiveRes.ok || !optionsRes.ok || !filtersRes.ok || !ingredientsRes.ok) {
          throw new Error('Ошибка загрузки данных');
        }

        const [categoriesActive, categoriesInactive, optionsData, filtersData, ingredientsData] = await Promise.all([
          categoriesActiveRes.json(),
          categoriesInactiveRes.json(),
          optionsRes.json(),
          filtersRes.json(),
          ingredientsRes.json(),
        ]);

        setActiveCategories(categoriesActive);
        setInactiveCategories(categoriesInactive);
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
        if (!id) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/product/${id}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить продукт');
        }

        const data = await response.json();
        let formattedImages = [];

        //Images
        if (data.image && Array.isArray(data.image) && data.image.length > 0) {
          const initialImageInputs = data.image.map(img => ({
            id: img.id
          }));
          setImageInputs(initialImageInputs);

          const imageIds = data.image.map(img => img.id);
          const nextIdValue = Math.max(...imageIds, 0) + 1;
          setNextId(nextIdValue);

          formattedImages = data.image.map(img => ({
            id: img.id,
            url: img.image
          }));
        }

        //SizePrices
        const sizeprices = Array.isArray(data.sizeprices)
          ? data.sizeprices.map(item => ({
            price: item.price || '',
            sizeid: item.sizeid || '',
            selected: false
          }))
          : [];

        const selectedIngredients = data.ingredients?.map(item => item.id) || [];
        const selectedOptions = data.bakeryoptionals?.map(item => item.id) || [];
        const selectedFilters = data.filters?.map(item => item.id) || [];

        formik.setValues({
          categoryid: data.categoryid?.toString() || '',
          title_ru: data.title_ru || '',
          title_de: data.title_de || '',
          description_ru: data.description_ru || '',
          description_de: data.description_de || '',
          image: formattedImages,
          isActive: Boolean(data.isActive),
          sizeprices: sizeprices,
          ingredients: selectedIngredients,
          options: selectedOptions,
          filters: selectedFilters
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUpdate();
    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      categoryid: null,
      title_ru: '',
      title_de: '',
      description_ru: '',
      description_de: '',
      image: [],
      sizeprices: [],
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
      ingredients: Yup.array()
        .min(1, "Должна быть хотя бы одна начинка")
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
        const { options, ...restValues } = values;

        const formattedValues = {
          ...restValues,
          categoryid: Number(values.categoryid),
          ingredients: values.ingredients?.map(id => ({ id })) || [],
          bakeryoptionals: values.options?.map(id => ({ id })) || [],
          filters: values.filters?.map(id => ({ id })) || [],
          sizeprices: values.sizeprices
            .filter(sp => sp.sizeid && sp.price)
            .map(sp => ({
              sizeid: Number(sp.sizeid),
              price: Number(sp.price)
            }))
        };

        const path = mode === 'Добавить' ? '/api/product' : `/api/product/${id}`;
        const response = await fetch(path, {
          method: mode === 'Добавить' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedValues),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка сервера');
        }

        setPopupMessage('Успешно');
        if (mode === 'Добавить') formik.resetForm();
      } catch (error) {
        console.error('Error:', error);
        setPopupMessage(error.message || 'Не удалось подключиться к серверу.');
      }
      setPopupVisible(true);
    },
  });

  const toggleDropdown = (field) => {
    setDropdownOpen(prev => ({
      ...prev,
      [field]: !prev[field],
      ...(Object.fromEntries(
        Object.keys(prev)
          .filter(key => key !== field)
          .map(key => [key, false])
      ))
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

  const handleClickInsideDropdown = (e) => {
    e.stopPropagation();
  };

  const renderDropdown = (field, items) => (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown(field);
        }}
        className="input-txt w-full mb-0"
      >
        Выберите {field === 'ingredients' ? 'начинки' : field === 'options' ? 'опции' : field === 'sizes' ? 'размеры' : 'фильтры'}
      </button>
      {dropdownOpen[field] && (
        <div
          className="absolute bg-cream border border-beige-dark mt-1 max-h-48 overflow-auto w-full z-10"
          onClick={handleClickInsideDropdown}
          onMouseDown={(e) => e.preventDefault()}
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
      const newId = nextId;
      setImageInputs(prev => [...prev, { id: newId }]);
      setNextId(prevId => prevId + 1);

      formik.setFieldValue('image', [
        ...formik.values.image,
        { id: newId, url: '' }
      ]);
    }
  };

  const handleImageDelete = (idToRemove) => {
    setImageInputs(prev => prev.filter(input => input.id !== idToRemove));
    formik.setFieldValue(
      'image',
      formik.values.image.filter(img => img.id !== idToRemove)
    );
  };

  //Для SizePrice
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
            <option className='bg-red-dark text-cream-dark' key={category.id} value={category.id}>
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
          autoComplete="off"
          placeholder="Заголовок продукта на русском (Обязательное)"
          className="input-txt w-full mt-1 mb-0"
          value={formik.values.title_ru}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title_ru && formik.errors.title_ru ? <p className='text-red text-sm'>{formik.errors.title_ru}</p> : null}
        <input
          id="description_ru"
          name="description_ru"
          type="text"
          autoComplete="off"
          placeholder="Описание продукта на русском"
          className="input-txt w-full mt-2 mb-0"
          value={formik.values.description_ru}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </label>

      <label className="text-beige text-xl block mt-3">
        Немецкий:
        <input
          id="title_de"
          name="title_de"
          type="text"
          autoComplete="off"
          placeholder="Заголовок продукта на немецком (Обязательное)"
          className="input-txt w-full mt-1 mb-0"
          value={formik.values.title_de}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title_de && formik.errors.title_de ? <p className='text-red text-sm'>{formik.errors.title_de}</p> : null}
        <input
          id="description_de"
          name="description_de"
          type="text"
          autoComplete="off"
          placeholder="Описание продукта на немецком"
          className="input-txt w-full mt-2 mb-0"
          value={formik.values.description_de}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </label>

      <div className="mt-4">
        <label className="text-beige text-xl block mt-3">Изображения</label>
        {imageInputs.map((input) => (
          <ImageInput
            key={input.id}
            id={input.id}
            formik={formik}
            deleteText='Удалить'
            handleImageDelete={handleImageDelete}
            instanceId={id ? id : 0}
            instanceName='product_id'
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
            Добавить {imageInputs.length > 0 ? '' : "главное "}изображение
          </Button>
        </div>
        {formik.errors.images ? <p className='text-red text-sm'>{formik.errors.images}</p> : null}
      </div>

      {/* SizePrice */}
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
      {formik.touched.sizeprices && formik.errors.sizeprices ?
        <p className='text-red text-sm'>
          {typeof formik.errors.sizeprices === 'string'
            ? formik.errors.sizeprices
            : 'Пожалуйста, проверьте правильность заполнения размеров и цен'}
        </p>
        : null}

      <div className="mt-3">
        {renderDropdown('ingredients', ingredients)}
        {renderDropdown('options', options)}
        {renderDropdown('filters', filters)}
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

      {isPopupVisible && (
        <Popup message={popupMessage} onClose={closePopup} />
      )}
    </form>
  );
}

export default ProductConstructor;