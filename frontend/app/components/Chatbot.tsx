"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Lottie from "lottie-react";

export default function Chatbot({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string; data?: any[]; columns?: string[]; sql?: string }[]
  >([]);
  const [animation, setAnimation] = useState<any>(null);

  const chatRef = useRef<HTMLDivElement>(null);

  // Load animation
  useEffect(() => {
    fetch("/chatbot.json")
      .then((res) => res.json())
      .then(setAnimation);
  }, []);

  // Auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: userMsg,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error" },
      ]);
    }
  };

  return (
    <>
      {/* CHAT PANEL */}
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#edecec",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "10px",
            background: "#0B132B",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          AI Assistant
          <span
            onClick={() => setOpen(false)}
            style={{ cursor: "pointer" }}
          >
            ✖
          </span>
        </div>

        {/* Messages */}
        <div
          ref={chatRef}
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  background:
                    msg.sender === "user" ? "#7B61FF" : "#1C2541",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  display: "inline-block",
                  fontWeight: 400,
                  fontSize: "14px",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              border: "none",
              padding: "10px",
              outline: "none",
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            style={{
              background: "#7b61ff",
              color: "white",
              border: "none",
              padding: "10px 15px",
            }}
          >
            ➤
          </button>
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: open ? "32%" : "40px",
          width: "80px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          zIndex: 999,
        }}
      >
        {animation && <Lottie animationData={animation} loop />}
      </div>
    </>
  );
}