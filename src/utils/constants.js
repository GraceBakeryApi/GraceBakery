import CategoryConstructor from "../components/admin/constructors/CategoryConstructor";
import FilterConstructor from "../components/admin/constructors/FilterConstructor";
import IngredientConstructor from "../components/admin/constructors/IngredientConstructor";
import OptionConstructor from "../components/admin/constructors/OptionConstructor";
import ProductConstructor from "../components/admin/constructors/ProductConstructor";
import SectionConstructor from "../components/admin/constructors/SectionConstructor";
import SizeConstructor from "../components/admin/constructors/SizeConstructor";

export const navItems = [
    { title: 'Войти', path: '/login' },
    { title: 'Зарегистрироваться', path: '/registration' },
    { title: 'Инструменты администратора', path: '/admin' },
    { title: 'Мой профиль', path: '/profile' },
    { title: 'Обо мне', path: '/about' }
];

export const adminNavItems = [
    {
        title: 'Разделы',
        path: '/sections',
        constructor: SectionConstructor,
        columns: [
            "id",
            "title_de",
            "title_ru",
            "description_de",
            "description_ru",
            "image",
            "isActive"
        ]
    },
    {
        title: 'Категории',
        path: '/categories',
        constructor: CategoryConstructor,
        columns: [
            "id",
            "sectionid",
            "title_de",
            "title_ru",
            "description_de",
            "description_ru",
            "image",
            "isActive"
        ]
    },
    {
        title: 'Продукты',
        path: '/products',
        constructor: ProductConstructor,
        columns: [
            "id",
            "sectionid",
            "categoryid",
            "title_de",
            "title_ru",
            "description_de",
            "description_ru",
            "image",
            "isActive"
        ]
    },
    {
        title: 'Опции',
        path: '/options',
        constructor: OptionConstructor,
        columns: [
            "id",
            "title_de",
            "title_ru",
            "description_de",
            "description_ru",
            "image",
            "price"
        ]
    },
    {
        title: 'Размеры',
        path: '/sizes',
        constructor: SizeConstructor,
        columns: [
            "id",
            "title_de",
            "title_ru",
            "mass",
            "diameter",
            "persons"
        ]
    },
    {
        title: 'Фильтры',
        path: '/filters',
        constructor: FilterConstructor,
        columns: [
            "id",
            "title_de",
            "title_ru"
        ]
    },
    {
        title: 'Начинки',
        path: '/ingredients',
        constructor: IngredientConstructor,
        columns: [
            "id",
            "sizeid",
            "title_de",
            "title_ru",
            "description_de",
            "description_ru",
            "image_de",
            "image_ru"
        ]
    },
]