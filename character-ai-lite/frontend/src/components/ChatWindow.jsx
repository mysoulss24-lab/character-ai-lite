import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Send, Loader2 } from 'lucide-react';

export default function ChatWindow({ messages, character, onSendMessage, isGenerating }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
              {character?.avatar_url ? (
                <img src={character.avatar_url} alt={character.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                  {character?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">{character?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2 text-sm">{character?.description}</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} character={character} />
        ))}
        
        {isGenerating && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type a message... (Shift+Enter for new line)"
            className="flex-1 resize-none overflow-hidden rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white min-h-[44px] max-h-32"
            rows="1"
            style={{ minHeight: '44px' }}
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} className={input.trim() && !isGenerating ? "translate-x-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}
