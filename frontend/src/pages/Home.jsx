import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import CharacterCard from '../components/CharacterCard';
import api from '../services/api';
import { Search, Loader2 } from 'lucide-react';

export default function Home({ toggleSidebar }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getCharacters()
      .then(res => {
        setCharacters(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load characters", err);
        setLoading(false);
      });
  }, []);

  const handleStartChat = async (characterId) => {
    try {
      const res = await api.createChat({ character_id: characterId, title: "New Chat" });
      navigate(`/chat/${res.data.id}`);
    } catch (err) {
      console.error("Failed to create chat", err);
    }
  };

  const handleDeleteCharacter = async (characterId) => {
    if (window.confirm("আপনি কি নিশ্চিত যে আপনি এই ক্যারেক্টারটি ডিলিট করতে চান? (Are you sure you want to delete this character?)")) {
      try {
        await api.deleteCharacter(characterId);
        setCharacters(characters.filter(c => c.id !== characterId));
      } catch (err) {
        console.error("Failed to delete character", err);
      }
    }
  };

  const filteredCharacters = characters.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <TopBar toggleSidebar={toggleSidebar} title="Characters" />
      
      <div className="p-4 md:p-8 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search characters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No characters found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or create a new character.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCharacters.map(char => (
                <CharacterCard key={char.id} character={char} onStartChat={handleStartChat} onDeleteCharacter={handleDeleteCharacter} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
