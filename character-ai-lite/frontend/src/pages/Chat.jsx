import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ChatWindow from '../components/ChatWindow';
import api from '../services/api';
import { Loader2, Bookmark } from 'lucide-react';

export default function Chat({ toggleSidebar }) {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getChat(chatId)
      .then(res => {
        setChat(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load chat", err);
        navigate('/');
      });
  }, [chatId, navigate]);

  const handleSaveChat = async () => {
    try {
      await api.saveChat(chatId);
      setChat(prev => ({ ...prev, is_saved: true }));
    } catch (err) {
      console.error("Failed to save chat", err);
    }
  };

  const handleSendMessage = async (content) => {
    // Optimistically update UI
    const tempUserMsg = { role: 'user', content };
    setChat(prev => ({ ...prev, messages: [...prev.messages, tempUserMsg] }));
    setIsGenerating(true);

    try {
      const res = await api.sendMessage(chatId, content);
      // Update with real messages (both user and AI) from server next time, but for now just append AI response
      setChat(prev => ({ ...prev, messages: [...prev.messages, res.data] }));
    } catch (err) {
      console.error("Failed to send message", err);
      // Remove optimistic message if failed
      setChat(prev => ({ ...prev, messages: prev.messages.filter(m => m !== tempUserMsg) }));
      alert("Failed to send message. Please check API configuration.");
    } finally {
      setIsGenerating(false);
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
    <div className="flex flex-col h-full">
      <TopBar 
        toggleSidebar={toggleSidebar} 
        title={chat.character.name} 
        subtitle={chat.is_saved ? "Saved Chat" : "Temporary Chat"}
      >
        {!chat.is_saved && (
          <button
            onClick={handleSaveChat}
            className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Bookmark className="w-4 h-4 mr-1.5" />
            Save Chat
          </button>
        )}
      </TopBar>
      <div className="flex-1 overflow-hidden relative">
        <ChatWindow 
          messages={chat.messages} 
          character={chat.character} 
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
