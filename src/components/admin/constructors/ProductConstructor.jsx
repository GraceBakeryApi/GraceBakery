import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Popup from '../../Popup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { MoonLoader } from 'react-spinners';

function ProductConstructor({ mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};
  const [activeSections, setActiveSections] = useState([]);
  const [inactiveSections, setInactiveSections] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [inactiveCategories, setInactiveCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [filters, setFilters] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const closePopup = () => setPopupVisible(false);

  const [dropdownOpen, setDropdownOpen] = useState({
    ingredients: false,
    options: false,
    filters: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsActiveRes, sectionsInactiveRes, categoriesActiveRes, categoriesInactiveRes, optionsRes, filtersRes, ingredientsRes] = await Promise.all([
          fetch('/api/sections/isactive/true'),
          fetch('/api/sections/isactive/false'),
          fetch('/api/categories/isactive/true'),
          fetch('/api/categories/isactive/false'),
          fetch('/api/option'),
          fetch('/api/filter'),
          fetch('/api/ingredient'),
        ]);

        if (!sectionsActiveRes.ok || !sectionsInactiveRes.ok || !categoriesActiveRes.ok || !categoriesInactiveRes.ok || !optionsRes.ok || !filtersRes.ok || !ingredientsRes.ok) {
          throw new Error('Ошибка загрузки данных');
        }

        const [sectionsActive, sectionsInactive, categoriesActive, categoriesInactive, optionsData, filtersData, ingredientsData] = await Promise.all([
          sectionsActiveRes.json(),
          sectionsInactiveRes.json(),
          categoriesActiveRes.json(),
          categoriesInactiveRes.json(),
          optionsRes.json(),
          filtersRes.json(),
          ingredientsRes.json(),
        ]);

        setActiveSections(sectionsActive);
        setInactiveSections(sectionsInactive);
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
        if (id) {
          const response = await fetch(`/api/product/${id}`);
          if (!response.ok) throw new Error('Не удалось загрузить продукт');
          const data = await response.json();
          formik.setValues({
            sectionid: data.sectionid || '',
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
      sectionid: '',
      categoryid: '',
      title_ru: '',
      title_de: '',
      description_ru: '',
      description_de: '',
      image: '',
      ingredients: [],
      options: [],
      filters: [],
      isActive: true,
    },
    onSubmit: async (values) => {
      try {
        const path = mode === 'Добавить' ? '/api/product' : `/api/product/${id}`;
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

  const toggleDropdown = (field) => {
    setDropdownOpen((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCheckboxChange = (e, field) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const currentValues = formik.values[field];
    formik.setFieldValue(
      field,
      checked ? [...currentValues, value] : currentValues.filter((item) => item !== value)
    );
  };

  const renderDropdown = (field, items) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => toggleDropdown(field)}
        className="input-txt w-full"
      >
        Выберите {field === 'ingredients' ? 'ингредиенты' : field === 'options' ? 'опции' : 'фильтры'}
      </button>
      {dropdownOpen[field] && (
        <div className="absolute bg-cream border border-beige-dark mt-1 max-h-48 overflow-auto w-full z-10">
          {items.map((item) => (
            <label key={item.id} className="block px-4 py-2">
              <input
                type="checkbox"
                value={item.id}
                checked={formik.values[field].includes(item.id)}
                onChange={(e) => handleCheckboxChange(e, field)}
                className="mr-2"
              />
              {item.title}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const handleCancel = () => {
    navigate(`/admin/categories`);
  };

  if (loading) {
    return <div className='flex justify-center mt-12'><MoonLoader size={'45 rem'} /></div>;
  }

  if (error) {
    return <div className="text-red-dark text-4xl">Ошибка загрузки: {error}</div>;
  }

  return (
    <form className="bg-cream px-4" onSubmit={formik.handleSubmit}>
      <h1 className="flex justify-center py-3 text-3xl text-beige">{mode} продукт</h1>
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
            <option className='bg-red-900' key={section.id} value={section.id}>
              {section.title_ru}
            </option>
          ))}
        </select>
      </label>
      <label className="text-beige text-xl">
        Категория:
        <select
          name="categoryid"
          onChange={formik.handleChange}
          value={formik.values.categoryid}
          className="input-txt"
        >
          <option value="">Выберите категорию</option>
          {activeCategories.map((category) => (
            <option className='bg-cream-dark' key={category.id} value={category.id}>
              {category.title_ru}
            </option>
          ))}
          {inactiveCategories.map((category) => (
            <option className='bg-red-900' key={category.id} value={category.id}>
              {category.title_ru}
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
          placeholder="Заголовок продукта на русском"
          className="input-txt"
        />
        <input
          type="text"
          autocomplete="off"
          name="description_ru"
          onChange={formik.handleChange}
          value={formik.values.description_ru}
          placeholder="Описание продукта на русском"
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
          placeholder="Заголовок продукта на немецком"
          className="input-txt"
        />
        <input
          type="text"
          autocomplete="off"
          name="description_de"
          onChange={formik.handleChange}
          value={formik.values.description_de}
          placeholder="Описание продукта на немецком"
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
      <label className="text-beige text-xl">Начинки:</label>
      {renderDropdown('ingredients', ingredients)}
      <label className="text-beige text-xl">Опции:</label>
      {renderDropdown('options', options)}
      <label className="text-beige text-xl">Фильтры:</label>
      {renderDropdown('filters', filters)}
      <label className="text-xl">
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

export default ProductConstructor;