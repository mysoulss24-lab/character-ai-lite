import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import api from '../services/api';
import { Save, Loader2, User, Plus, Trash2 } from 'lucide-react';

export default function CharacterEdit({ toggleSidebar }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar_url: '',
    description: '',
    personality: '',
    scenario: '',
    greeting_message: '',
    nationality: 'Unknown',
    appearance: '',
    speaking_style: '',
    user_description: '',
    additional_characters: '[]'
  });

  const [additionalChars, setAdditionalChars] = useState([]);

  useEffect(() => {
    if (isEditing) {
      api.getCharacter(id)
        .then(res => {
          setFormData(res.data);
          try {
            setAdditionalChars(JSON.parse(res.data.additional_characters || '[]'));
          } catch(e) {}
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch character", err);
          navigate('/');
        });
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddChar = () => {
    setAdditionalChars(prev => [...prev, { name: '', description: '', relationship: '' }]);
  };

  const handleCharChange = (index, field, value) => {
    const newChars = [...additionalChars];
    newChars[index][field] = value;
    setAdditionalChars(newChars);
  };

  const handleRemoveChar = (index) => {
    const newChars = [...additionalChars];
    newChars.splice(index, 1);
    setAdditionalChars(newChars);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSubmit = { ...formData, additional_characters: JSON.stringify(additionalChars) };
      if (isEditing) {
        await api.updateCharacter(id, dataToSubmit);
      } else {
        await api.createCharacter(dataToSubmit);
      }
      navigate('/');
    } catch (err) {
      console.error("Failed to save character", err);
      alert("Failed to save character.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
        <TopBar toggleSidebar={toggleSidebar} title="Loading..." />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <TopBar toggleSidebar={toggleSidebar} title={isEditing ? "Edit Character" : "Create Character"} />
      
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Character Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  placeholder="e.g., Sherlock Holmes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar Image (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                placeholder="e.g., Bangladeshi, Japanese"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                placeholder="A brief summary of the character"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personality</label>
                <textarea
                  name="personality"
                  value={formData.personality}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  placeholder="Describe their traits, likes, dislikes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">User Persona (Your Description)</label>
                <textarea
                  name="user_description"
                  value={formData.user_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  placeholder="Describe yourself so the AI knows who it is talking to..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scenario / Background</label>
              <textarea
                name="scenario"
                value={formData.scenario}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                placeholder="What is the context of the roleplay?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Speaking Style</label>
                <textarea
                  name="speaking_style"
                  value={formData.speaking_style}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  placeholder="e.g., Formal, polite, uses slang, sarcastic..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Appearance</label>
                <textarea
                  name="appearance"
                  value={formData.appearance}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  placeholder="Physical description..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Greeting Message</label>
              <textarea
                name="greeting_message"
                value={formData.greeting_message}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                placeholder="First message the character sends"
              />
            </div>
            
            {/* Additional Characters Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Additional Characters</h3>
                <button
                  type="button"
                  onClick={handleAddChar}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Character
                </button>
              </div>
              
              <div className="space-y-4">
                {additionalChars.map((char, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveChar(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
                        <input
                          type="text"
                          value={char.name}
                          onChange={(e) => handleCharChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Anik"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Relationship to You</label>
                        <input
                          type="text"
                          value={char.relationship}
                          onChange={(e) => handleCharChange(index, 'relationship', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Friend, Teacher"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                      <textarea
                        value={char.description}
                        onChange={(e) => handleCharChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief personality or appearance..."
                      />
                    </div>
                  </div>
                ))}
                {additionalChars.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No additional characters added.</p>
                )}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 mr-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Character
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
