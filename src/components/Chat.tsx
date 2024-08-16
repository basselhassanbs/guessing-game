'use client';
import { useEffect, useState } from 'react';

export default function Chat({ ws }: { ws: WebSocket | null }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = async (event: any) => {
        const data = JSON.parse(event.data);

        if (data.type == 'chatMessage') {
          setMessages((prev) => [...prev, data.message]);
        }
      };
    }
  }, [ws]);

  const sendMessage = () => {
    if (ws && message) {
      ws.send(JSON.stringify({ type: 'chatMessage', message }));
      setMessage('');
    }
  };

  return (
    <div className='h-full flex flex-col'>
      <h3>Chat</h3>
      <div className='border rounded flex flex-col h-full'>
        <div className='p-3 flex-1'>
          <div className='overflow-y-scroll max-h-[100px]'>
            {messages.map((msg, index) => (
              <div key={index} className='bg-slate-200 p-2 rounded w-fit mb-2'>
                {msg}
              </div>
            ))}
          </div>
        </div>
        <div className='flex gap-2 p-2'>
          <input
            className='border rounded w-full p-2'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className='border rounded px-4 py-2' onClick={sendMessage}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
