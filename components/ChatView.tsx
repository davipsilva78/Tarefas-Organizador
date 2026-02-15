

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
  onStartConversation: (participantId: string) => void;
  selectedConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ currentUser, users, conversations, messages, onSendMessage, onStartConversation, selectedConversationId, onSelectConversation }) => {
  const [isSelectingUser, setIsSelectingUser] = useState(false);
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

  const handleSelectUserToChat = (participantId: string) => {
    onStartConversation(participantId);
    setIsSelectingUser(false);
  }
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  // FIX: Add explicit type to the filter callback parameter to allow property access.
  const otherUsers = Object.values(users).filter((u: User) => u.id !== currentUser.id);

  const conversationListPanel = (
    <div className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedConversationId && 'hidden'} md:flex`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {isSelectingUser ? 'Nova Conversa' : 'Conversas'}
        </h2>
        {isSelectingUser ? (
          <button onClick={() => setIsSelectingUser(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Voltar">
            <Icon name="x" className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        ) : (
          <button onClick={() => setIsSelectingUser(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Nova Conversa">
            <Icon name="plus" className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {isSelectingUser ? (
          <div>
            {otherUsers.map(user => (
              <button key={user.id} onClick={() => handleSelectUserToChat(user.id)} className="w-full text-left p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
                <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
              </button>
            ))}
          </div>
        ) : (
          <div>
            {sortedConversations.map((conv: ChatConversation) => {
              const otherParticipantId = conv.participantIds.find(id => id !== currentUser.id);
              const otherUser = otherParticipantId ? users[otherParticipantId] : null;
              if (!otherUser) return null;

              return (
                <button key={conv.id} onClick={() => onSelectConversation(conv.id)} className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${selectedConversationId === conv.id ? 'bg-custom-light-blue dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                  <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{otherUser.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const chatWindowPanel = (
    <div className={`flex-1 flex-col ${!selectedConversationId && 'hidden'} md:flex`}>
      {selectedConversation ? (
        <>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0">
             <button onClick={() => onSelectConversation(null)} className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Icon name="arrow-left" className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{selectedConversation.name}</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
            {filteredMessages.map(msg => (
              <ChatMessageDisplay key={msg.id} message={msg} isCurrentUser={msg.senderId === currentUser.id} sender={users[msg.senderId]} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-blue" />
              <button type="submit" className="bg-custom-blue text-white rounded-full p-3 hover:bg-custom-dark-blue transition-colors flex-shrink-0">
                <Icon name="send" className="w-6 h-6" />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center text-center">
          <div>
            <Icon name="chat" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Selecione uma conversa para começar a conversar.</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {conversationListPanel}
      {chatWindowPanel}
    </div>
  );
};

export default ChatView;