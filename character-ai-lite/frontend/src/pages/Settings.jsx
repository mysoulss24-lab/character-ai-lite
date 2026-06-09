import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import api from '../services/api';
import { Save, Loader2, Moon, Sun, Image as ImageIcon } from 'lucide-react';

export default function Settings({ toggleSidebar, isDarkMode, setIsDarkMode }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    ai_provider: 'groq',
    image_generation_enabled: false,
    dark_mode: true
  });

  useEffect(() => {
    api.getSettings()
      .then(res => {
        setSettings(res.data);
        setIsDarkMode(res.data.dark_mode);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load settings", err);
        setLoading(false);
      });
  }, [setIsDarkMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setSettings(prev => ({ ...prev, [name]: val }));
    
    if (name === 'dark_mode') {
      setIsDarkMode(val);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      alert("Settings saved successfully.");
    } catch (err) {
      console.error("Failed to save settings", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
        <TopBar toggleSidebar={toggleSidebar} title="Settings" />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <TopBar toggleSidebar={toggleSidebar} title="Settings" />
      
      <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-8">
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                {settings.dark_mode ? <Moon className="text-indigo-400" /> : <Sun className="text-amber-500" />}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="dark_mode"
                  checked={settings.dark_mode}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">AI Configuration</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-3">
                <label className="block font-medium text-gray-900 dark:text-white">Primary AI Provider</label>
                <select
                  name="ai_provider"
                  value={settings.ai_provider}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                >
                  <option value="groq">Groq (Recommended - Fast & Free)</option>
                  <option value="openrouter">OpenRouter</option>
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Ensure you have set the corresponding API keys in the backend `.env` file (`GROQ_API_KEY` or `OPENROUTER_API_KEY`).
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="text-pink-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Image Generation Prompts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow AI to generate image descriptions if explicitly requested.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="image_generation_enabled"
                    checked={settings.image_generation_enabled}
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
