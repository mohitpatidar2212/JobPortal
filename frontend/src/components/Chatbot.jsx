import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import API from "../services/api"

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    if (input.toLowerCase() === "hii" || input.toLowerCase() === "hello"){
      const botMessage = { sender: 'bot', text: "Hello, how may i assest you." };
      setMessages((prev) => [...prev, botMessage])
      return
    }

    try {
      const res = await API.post('/chatbot', {question: input});
      const botMessage = { sender: 'bot', text: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-white shadow-lg rounded-lg w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b">
            <h2 className="font-bold text-indigo-600">JobPortal Assistant</h2>
            <button onClick={() => setOpen(false)}>
            <FaTimes className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`p-2 rounded max-w-xs ${
                  msg.sender === 'user'
                  ? 'bg-indigo-100 text-right'
                  : 'bg-gray-100 text-left'
                }`}
                >
                  <span className="font-bold">
                  {msg.sender === 'user' ? 'You:' : 'Assistant:'}
                  </span>{' '}
                  {msg.text}
                </p>
              </div>
            ))}
            {/* invisible dummy element to scroll into view */}
            <div ref={chatEndRef} />
          </div>

          <div className="p-2 border-t flex">
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border px-2 py-1 rounded mr-2 text-sm"
            placeholder="Ask me anything..."
            />
            <button onClick={handleSend} className="bg-indigo-600 text-white px-3 rounded text-sm">
            Send
            </button>
          </div>
        </div>
      ) : (
          <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-800"
          >
          <FaRobot size={24} />
          </button>
      )}
    </div>
  );
}
