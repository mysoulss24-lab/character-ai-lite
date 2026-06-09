import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import CharacterEdit from './pages/CharacterEdit';
import Settings from './pages/Settings';
import { useState, useEffect } from 'react';
import api from './services/api';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Password protection state
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check initial settings from backend
    if (isAuthenticated) {
      api.getSettings().then(res => {
        if (res.data) {
          setIsDarkMode(res.data.dark_mode);
        }
      }).catch(err => console.error("Could not load settings", err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1234') { // Default password
      setIsAuthenticated(true);
      localStorage.setItem('isAuth', 'true');
    } else {
      setError('ভুল পাসওয়ার্ড! (Wrong Password)');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-xl w-80 text-center">
          <h2 className="text-2xl font-bold mb-6">Character AI Lite</h2>
          <p className="mb-6 text-sm text-gray-400">প্রবেশ করার জন্য পাসওয়ার্ড দিন</p>
          <input
            type="password"
            placeholder="পাসওয়ার্ড..."
            className="w-full p-3 rounded bg-gray-700 mb-4 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700">লগ-ইন</button>
        </form>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Home toggleSidebar={toggleSidebar} />} />
              <Route path="/chat/:chatId" element={<Chat toggleSidebar={toggleSidebar} />} />
              <Route path="/character/new" element={<CharacterEdit toggleSidebar={toggleSidebar} />} />
              <Route path="/character/:id/edit" element={<CharacterEdit toggleSidebar={toggleSidebar} />} />
              <Route path="/settings" element={<Settings toggleSidebar={toggleSidebar} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
