import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

function NavigationItem({ item }) {
    const { t, i18n } = useTranslation();

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `text-lg font-medium px-4 py-2 rounded-md transition ${isActive
                    ? 'bg-beige-dark text-white'
                    : 'text-beige-dark hover:bg-beige-light hover:text-beige-dark'
                }`
            }
        >
            {t(`navItems.${[item.tKey]}`)}
        </NavLink>
    );
}

export default NavigationItem;
