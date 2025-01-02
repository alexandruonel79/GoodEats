import React, { useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    try {
      setLoading(true);
      setError("");

      // Send the message to the backend
      const response = await axios.post("http://localhost:8000/chat", {
        message: message,
      });

      // Check if response is valid
      if (response && response.data) {
        setReply(response.data.reply);
      } else {
        setError("No reply received from the server.");
      }
    } catch (err) {
      // If an error occurs, handle it
      console.error(err);
      if (err.response) {
        setError("Error: " + (err.response.data.error || "An error occurred"));
      } else {
        setError("Error sending message: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <h1 style={styles.header}>Chat with Chatbot</h1>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
          style={styles.textArea}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          style={{
            ...styles.button,
            backgroundColor: loading ? "#ccc" : "#007bff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {reply && (
          <div style={styles.replyBox}>
            <strong>Reply:</strong>
            <p style={styles.reply}>{reply}</p>
          </div>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
  },
  chatBox: {
    width: "500px",
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  header: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
    textAlign: "center",
  },
  textArea: {
    width: "95%",
    height: "100px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ced4da",
    marginBottom: "15px",
    resize: "none",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  replyBox: {
    marginTop: "20px",
    backgroundColor: "#e9ecef",
    padding: "10px",
    borderRadius: "5px",
  },
  reply: {
    marginTop: "5px",
    color: "#495057",
  },
  error: {
    marginTop: "20px",
    color: "#d9534f",
    textAlign: "center",
  },
};

export default ChatPage;
