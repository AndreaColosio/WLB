import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const NavItem = ({ to, icon: Icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 min-h-[44px] ${
          isActive
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </NavLink>
  );
};

export default NavItem;
