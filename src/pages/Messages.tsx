import { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { channels, people } from '@/data/mockData';
import Avatar from '@/components/Avatar';
import { Send, Hash, Search, AtSign } from 'lucide-react';
import type { Channel, Message } from '@/types';

export default function Messages() {
  const currentUser = useStore((s) => s.currentUser);
  const customMessages = useStore((s) => s.customMessages);
  const addMessage = useStore((s) => s.addMessage);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  // Filter channels to only those the user is a member of
  const myChannels = useMemo(() => {
    return channels.filter((ch) => ch.memberIds.includes(currentUser.id));
  }, [currentUser.id]);

  // Auto-select first channel
  useEffect(() => {
    if (!activeChannelId && myChannels.length > 0) {
      setActiveChannelId(myChannels[0].id);
    }
  }, [myChannels, activeChannelId]);

  const activeChannel = myChannels.find((ch) => ch.id === activeChannelId) || null;

  const getMessages = (channel: Channel): Message[] => {
    return [...channel.messages, ...(customMessages[channel.id] || [])];
  };

  const getPerson = (id: string) => people.find((p) => p.id === id);

  const filteredChannels = myChannels.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!input.trim() || !activeChannel) return;
    const msg: Message = {
      id: `m-custom-${Date.now()}`,
      senderId: currentUser.id,
      text: input,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    addMessage(activeChannel.id, msg);
    setInput('');
    setMentionQuery(null);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    // Detect @mention
    const lastAt = val.lastIndexOf('@');
    if (lastAt !== -1 && val.slice(lastAt + 1).indexOf(' ') === -1) {
      setMentionQuery(val.slice(lastAt + 1).toLowerCase());
      setMentionStart(lastAt);
    } else {
      setMentionQuery(null);
    }
  };

  const mentionSuggestions = useMemo(() => {
    if (!mentionQuery || !activeChannel) return [];
    return activeChannel.memberIds
      .filter((id) => id !== currentUser.id)
      .map((id) => getPerson(id))
      .filter((p): p is NonNullable<typeof p> => !!p)
      .filter((p) => p.name.toLowerCase().includes(mentionQuery));
  }, [mentionQuery, activeChannel, currentUser.id]);

  const insertMention = (name: string) => {
    const before = input.slice(0, mentionStart);
    const after = input.slice(input.lastIndexOf('@') + mentionQuery!.length + 1);
    setInput(`${before}@${name.split(' ')[0]} ${after}`);
    setMentionQuery(null);
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] animate-fade-in">
      {/* Channel list */}
      <div className="w-64 surface border-r flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold mb-3">Messages</h1>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search channels..."
              className="input w-full pl-8 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChannels.map((ch) => {
            const msgs = getMessages(ch);
            const lastMsg = msgs[msgs.length - 1];
            const lastPerson = lastMsg ? getPerson(lastMsg.senderId) : null;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannelId(ch.id)}
                className={`w-full text-left px-4 py-3 border-b border-border hover:bg-surface-2 transition-colors ${
                  activeChannelId === ch.id ? 'bg-primary-soft/30 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {ch.type === 'channel' ? (
                    <Hash size={14} className="text-muted shrink-0" />
                  ) : (
                    <div className="w-5 h-5 shrink-0">
                      {ch.memberIds.filter((id) => id !== currentUser.id).map((id) => {
                        const p = getPerson(id);
                        return p ? <Avatar key={id} name={p.name} avatarUrl={p.avatarUrl} size={20} /> : null;
                      })}
                    </div>
                  )}
                  <span className="font-medium text-sm truncate">{ch.name}</span>
                </div>
                {lastMsg && (
                  <div className="text-xs text-muted mt-1 truncate ml-6">
                    {lastPerson?.name.split(' ')[0]}: {lastMsg.text}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChannel ? (
          <>
            {/* Channel header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              {activeChannel.type === 'channel' ? <Hash size={18} className="text-muted" /> : null}
              <h2 className="font-bold">{activeChannel.name}</h2>
              <span className="text-xs text-muted ml-2">
                {activeChannel.memberIds.length} members
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {getMessages(activeChannel).map((msg) => {
                const person = getPerson(msg.senderId);
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {person && <Avatar name={person.name} avatarUrl={person.avatarUrl} size={36} />}
                    <div className={`max-w-[70%] ${isMe ? 'items-end' : ''} flex flex-col`}>
                      <div className={`flex items-center gap-2 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm font-medium">{person?.name}</span>
                        <span className="text-xs text-muted">{msg.time}</span>
                      </div>
                      <div className={`rounded-2xl px-4 py-2 text-sm ${
                        isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface-2 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-3 border-t border-border relative">
              {mentionQuery && mentionSuggestions.length > 0 && (
                <div className="absolute bottom-full left-5 right-5 mb-1 card shadow-lg py-1 z-10 animate-fade-in">
                  <div className="px-3 py-1.5 text-xs text-muted flex items-center gap-1">
                    <AtSign size={12} /> Members in this channel
                  </div>
                  {mentionSuggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => insertMention(p.name)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-2 transition-colors text-left"
                    >
                      <Avatar name={p.name} avatarUrl={p.avatarUrl} size={24} />
                      <span className="text-sm">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message... Use @ to mention"
                  className="input flex-1"
                />
                <button onClick={handleSend} disabled={!input.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            Select a channel to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
