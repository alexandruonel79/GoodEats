import React, { useState } from "react";
import { MessageBox, MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input) return;

        const userMessage = { position: "right", text: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();
            const aiMessage = { position: "left", text: data.reply };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
        }

        setInput("");
    };

    return (
        <div>
            <MessageList className="message-list" dataSource={messages} />
            <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
        </div>
    );
};

export default Chat;
