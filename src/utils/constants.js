import CategoryConstructor from "../components/admin/constructors/CategoryConstructor";
import FilterConstructor from "../components/admin/constructors/FilterConstructor";
import IngredientConstructor from "../components/admin/constructors/IngredientConstructor";
import OptionConstructor from "../components/admin/constructors/OptionConstructor";
import ProductConstructor from "../components/admin/constructors/ProductConstructor";
import SectionConstructor from "../components/admin/constructors/SectionConstructor";
import SizeConstructor from "../components/admin/constructors/SizeConstructor";

export const navItems = [
    { tKey: 'logIn', path: '/login' },
    { tKey: 'registration', path: '/registration' },
    { tKey: 'adminPanel', path: '/admin' },
    { tKey: 'catalog', path: '/catalog' },
    { tKey: 'profile', path: '/profile' },
    { tKey: 'aboutMe', path: '/about' }
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
        ],
        deletable: false
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
        ],
        deletable: false
    },
    {
        title: 'Продукты',
        path: '/products',
        constructor: ProductConstructor,
        columns: [
            "id",
            "categoryid",
            "title_de",
            "title_ru",
            "description_de",
            "description_ru",
            "isActive"
        ],
        deletable: false
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
            "sizeId", 
            "price",
            "isActive"
        ],
        deletable: false
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
        ],
        deletable: null
    },
    {
        title: 'Фильтры',
        path: '/filters',
        constructor: FilterConstructor,
        columns: [
            "id",
            "title_de",
            "title_ru"
        ],
        deletable: true
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
        ],
        deletable: null
    },
]