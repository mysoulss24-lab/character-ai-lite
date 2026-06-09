import { Link } from 'react-router-dom';
import { MessageSquare, Edit, Trash2 } from 'lucide-react';

export default function CharacterCard({ character, onStartChat, onDeleteCharacter }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
        <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700">
          {character.avatar_url ? (
            <img src={character.avatar_url} alt={character.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400">
              {character.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 flex space-x-2">
          <Link to={`/character/${character.id}/edit`} className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors block text-white" title="Edit">
            <Edit size={16} />
          </Link>
          <button onClick={() => onDeleteCharacter(character.id)} className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full backdrop-blur-sm transition-colors block text-white" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="pt-12 p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{character.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3 line-clamp-2">{character.description}</p>
        
        <button 
          onClick={() => onStartChat(character.id)}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl transition-colors font-medium text-sm"
        >
          <MessageSquare size={16} />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
}
