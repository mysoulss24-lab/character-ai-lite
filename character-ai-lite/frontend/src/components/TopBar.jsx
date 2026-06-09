import { Menu } from 'lucide-react';

export default function TopBar({ toggleSidebar, title, subtitle, children }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10 sticky top-0 w-full">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center">{children}</div>}
    </header>
  );
}
