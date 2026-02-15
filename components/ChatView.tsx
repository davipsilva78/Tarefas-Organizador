
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChatConversation, ChatMessage, User } from '../types';
import Icon from './Icon';

interface ChatMessageDisplayProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  sender: User | undefined;
}

const ChatMessageDisplay: React.FC<ChatMessageDisplayProps> = ({ message, isCurrentUser, sender }) => {
  const alignment = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isCurrentUser ? 'bg-custom-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';

  return (
    <div className={`flex items-end gap-2 ${alignment} mb-4`}>
      {!isCurrentUser && (
        <img src={sender?.avatarUrl} alt={sender?.name} className="w-8 h-8 rounded-full flex-shrink-0" />
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${bubbleColor}`}>
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isCurrentUser && (
        <img src={sender?.avatarUrl} alt={sender?.name} className="w-8 h-8 rounded-full flex-shrink-0" />
      )}
    </div>
  );
};


interface ChatViewProps {
  currentUser: User;
  users: { [key: string]: User };
  conversations: ChatConversation[];
  messages: ChatMessage[];
  onSendMessage: (conversationId: string, text: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ currentUser, users, conversations, messages, onSendMessage }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversations[0]?.id || null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
        const timeA = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
        const timeB = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
        return timeB - timeA;
    });
  }, [conversations]);

  const filteredMessages = useMemo(() => {
    return messages
      .filter(m => m.conversationId === selectedConversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversationId) {
      onSendMessage(selectedConversationId, messageText);
      setMessageText('');
    }
  };
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Sidebar de Conversas */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Conversas</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedConversations.map(conv => {
            const otherParticipantId = conv.participantIds.find(id => id !== currentUser.id);
            const otherUser = otherParticipantId ? users[otherParticipantId] : null;

            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${selectedConversationId === conv.id ? 'bg-custom-light-blue dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
              >
                <img src={otherUser?.avatarUrl} alt={otherUser?.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{otherUser?.name || conv.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Janela de Chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{selectedConversation.name}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
              {filteredMessages.map(msg => (
                <ChatMessageDisplay
                  key={msg.id}
                  message={msg}
                  isCurrentUser={msg.senderId === currentUser.id}
                  sender={users[msg.senderId]}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-blue"
                    />
                    <button type="submit" className="bg-custom-blue text-white rounded-full p-3 hover:bg-custom-dark-blue transition-colors flex-shrink-0">
                        <Icon name="send" className="w-6 h-6" />
                    </button>
                </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <Icon name="chat" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">Selecione uma conversa para começar a conversar.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;
