import React, { useState } from "react";
import axios from "axios";
import { FaMoon, FaSun, FaDownload, FaUpload } from "react-icons/fa";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message,
      });

      const botMessage = {
        role: "assistant",
        content: response.data.reply,
      };

      setTimeout(() => {
        setChat((prev) => [...prev, botMessage]);
        setLoading(false);
      }, 1000); // Typing delay
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const exportChat = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chat));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "chat.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importChat = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setChat(JSON.parse(event.target.result));
    };
    fileReader.readAsText(e.target.files[0]);
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header>
        <h2>AI Chatbot</h2>
        <div className="icons">
          <button onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={exportChat}><FaDownload /></button>
          <label className="upload-btn">
            <FaUpload />
            <input type="file" accept=".json" onChange={importChat} hidden />
          </label>
        </div>
      </header>

      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={msg.role}>
            <strong>{msg.role === "user" ? "You" : "AI"}: </strong>
            {msg.content}
          </div>
        ))}
        {loading && <div className="typing">AI is typing...</div>}
      </div>

      <div className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
