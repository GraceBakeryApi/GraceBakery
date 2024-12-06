import { NavLink } from "react-router-dom"

function SettingListItem({ item }) {
    return (
        <li className="m-2">
            <NavLink
                to={"/admin" + item.path}
                className={({ isActive }) =>
                    `block text-lg font-medium px-4 py-2 rounded-md transition ${isActive
                        ? 'bg-beige-dark text-white'
                        : 'text-beige-dark hover:bg-beige-light hover:text-cream'
                    }`
                }
            >
                {item.title}
            </NavLink>
        </li>
    )
}

export default SettingListItem