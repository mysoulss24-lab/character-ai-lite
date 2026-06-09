import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Settings, PlusCircle, MessageSquare, X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, [location]); // Refresh chats when location changes

  const fetchChats = async () => {
    try {
      const res = await api.getChats();
      setChats(res.data);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  const handleDeleteChat = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this chat?")) {
      try {
        await api.deleteChat(id);
        if (location.pathname === `/chat/${id}`) {
          navigate('/');
        } else {
          fetchChats();
        }
      } catch (err) {
        console.error("Failed to delete chat", err);
      }
    }
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
      transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400" onClick={() => setIsOpen(false)}>
          Character AI Lite
        </Link>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <Link to="/" onClick={() => setIsOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        
        <Link to="/character/new" onClick={() => setIsOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${location.pathname === '/character/new' ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
          <PlusCircle size={20} />
          <span>Create Character</span>
        </Link>

        <div className="pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Chats</p>
        </div>

        {chats.map(chat => (
          <div key={chat.id} className={`group flex items-center justify-between p-2 rounded-lg transition-colors ${location.pathname === `/chat/${chat.id}` ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            <Link to={`/chat/${chat.id}`} onClick={() => setIsOpen(false)} className="flex-1 flex items-center space-x-2 truncate">
              <MessageSquare size={16} className="flex-shrink-0" />
              <span className="truncate text-sm">{chat.title}</span>
            </Link>
            <button onClick={(e) => handleDeleteChat(chat.id, e)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link to="/settings" onClick={() => setIsOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${location.pathname === '/settings' ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
