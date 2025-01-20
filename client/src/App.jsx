import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleMessageSend = async () => {
    if (!userMessage.trim()) return;

    setChat((prevChat) => [...prevChat, { sender: 'user', message: userMessage }]);

    try {
      // Corrected endpoint to match the backend API
      const response = await axios.post('http://localhost:5000/api/message', { userMessage });
      const botResponse = response.data.botResponse;

      setChat((prevChat) => [...prevChat, { sender: 'bot', message: botResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChat((prevChat) => [...prevChat, { sender: 'bot', message: 'Error: Unable to send message.' }]);
    }

    setUserMessage('');
  };

  const fetchConversationHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/history');
      const historyMessages = response.data.map((item) => `${item.user_message} -> ${item.bot_response}`).join('\n');
      setChat((prevChat) => [...prevChat, { sender: 'bot', message: `Here are the last conversations:\n${historyMessages}` }]);
    } catch (error) {
      console.error('Error fetching history:', error);
      setChat((prevChat) => [...prevChat, { sender: 'bot', message: 'Error: Unable to fetch history.' }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleMessageSend}>Send</button>
       
      </div>
    </div>
  );
}

export default App;
