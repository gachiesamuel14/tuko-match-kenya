import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { AuthUser, Message } from '../types';
import { getMatches, getMessages, addMessage } from '../lib/storage';
import { MOCK_USERS } from '../data/mockUsers';

interface Props {
  user: AuthUser;
}

export default function Chat({ user }: Props) {
  const { matchId } = useParams<{ matchId: string }>();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const match = getMatches().find((m) => m.id === matchId);
  const other = match ? MOCK_USERS.find((u) => u.id === match.userId) : null;

  useEffect(() => {
    if (matchId) {
      setMessages(getMessages(matchId));
    }
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!text.trim() || !matchId || !user) return;
    const msg: Message = {
      id: 'msg_' + Date.now(),
      matchId,
      senderId: user.id,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    addMessage(msg);
    setMessages((prev) => [...prev, msg]);
    setText('');

    // Demo auto-reply after a short delay
    setTimeout(() => {
      if (!other) return;
      const replies = [
        'Hey! Nice to match with you 😊',
        'Hi there! How is your day going?',
        'Hello! I saw we both like similar things.',
        'Sasa! How are you?',
        'Habari! Looking forward to chatting.',
      ];
      const reply: Message = {
        id: 'msg_' + (Date.now() + 1),
        matchId,
        senderId: other.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
        read: false,
      };
      addMessage(reply);
      setMessages((prev) => [...prev, reply]);
    }, 1200 + Math.random() * 1500);
  };

  if (!match || !other) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Match not found</p>
        <Link to="/matches" className="text-rose-600 font-medium mt-4 inline-block">
          Back to matches
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0">
        <Link to="/matches" className="p-1 -ml-1 text-gray-600 hover:text-rose-600">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <img
          src={other.photos[0]}
          alt={other.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-gray-900">{other.name}</h2>
          <p className="text-xs text-gray-500">
            {other.isOnline ? 'Online' : other.lastActive || other.county}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">You matched with {other.name}!</p>
            <p className="text-gray-400 text-xs mt-1">Say hello 👋</p>
          </div>
        )}
        {messages.map((m) => {
          const mine = m.senderId === user.id;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  mine
                    ? 'bg-rose-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-rose-500 text-sm"
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="w-11 h-11 rounded-full bg-rose-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-rose-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
