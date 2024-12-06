import { NavLink } from 'react-router-dom';

function NavigationItem({ item }) {
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
            {item.title}
        </NavLink>
    );
}

export default NavigationItem;
