export default function MessageBubble({ message, character }) {
  const isUser = message.role === 'user';

  const formatMessageContent = (text) => {
    if (isUser) return text;
    
    const regex = /(\*[^*]+\*|\([^)]+\)|\*\*[^*]+\*\*)/g;
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="font-bold">{part.slice(2, -2)}</span>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={i} className="italic opacity-80">{part}</span>;
      }
      if (part.startsWith('(') && part.endsWith(')')) {
        return <span key={i} className="italic opacity-80">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
            {character?.avatar_url ? (
              <img src={character.avatar_url} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                {character?.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={`max-w-[80%] sm:max-w-[70%] ${isUser ? 'order-1' : 'order-2'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-none border border-gray-100 dark:border-gray-700'
        }`}>
          <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans">{formatMessageContent(message.content)}</div>
        </div>
      </div>
    </div>
  );
}
