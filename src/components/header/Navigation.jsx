import NavigationItem from './NavigationItem';
import { navItems } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

function Navigation() {
    return (
        <nav className="mt-4">
            <div className="flex space-x-4 justify-center">
                {navItems.map((item) => (
                    <NavigationItem key={item.path} item={item} />
                ))}
            </div>
        </nav>
    );
}

export default Navigation;
