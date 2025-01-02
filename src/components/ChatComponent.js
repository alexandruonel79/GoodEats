import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(""); // State for new message input

  useEffect(() => {
    // Fetch initial messages when the component loads
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/chat/messages"); // Replace with your API endpoint
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent empty messages

    try {
      // Send the new message to the backend
      const response = await axios.post("http://localhost:5000/chat/messages", {
        message: newMessage,
      });

      // Update the chat with the new message
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage(""); // Clear the input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            {msg.message}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    width: "400px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
  },
  messagesContainer: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    maxHeight: "300px",
    backgroundColor: "#f9f9f9",
  },
  message: {
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#e0e0e0",
    borderRadius: "5px",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

export default ChatComponent;
