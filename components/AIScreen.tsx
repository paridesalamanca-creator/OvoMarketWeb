'use client';

import { useState, useEffect, useRef } from 'react';
import AIClient from '@/lib/ai';

export default function AIScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: Date.now(), text, isUser: true }]);
    setInputText('');
    setLoading(true);

    try {
      const ai = new AIClient();
      const response = await ai.ask(text);
      setMessages((prev) => [...prev, { id: Date.now(), text: response, isUser: false }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: 'Unable to get AI response. DATA NOT AVAILABLE', isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '16px',
      maxWidth: '500px',
      margin: '0 auto',
    }}>
      <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '700' }}>Ovo AI</h1>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#cbd5e1',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
            <p>Ask me about your store</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  backgroundColor: msg.isUser ? '#2563eb' : '#111827',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '12px',
                  wordWrap: 'break-word',
                  fontSize: '14px',
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: '#111827',
                color: '#cbd5e1',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '14px',
              }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
      }}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 12px',
            backgroundColor: '#111827',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !inputText.trim()}
          style={{
            padding: '10px 16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: loading || !inputText.trim() ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
