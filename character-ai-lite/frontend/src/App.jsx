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

  useEffect(() => {
    // Check initial settings from backend
    api.getSettings().then(res => {
      if (res.data) {
        setIsDarkMode(res.data.dark_mode);
      }
    }).catch(err => console.error("Could not load settings", err));
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
