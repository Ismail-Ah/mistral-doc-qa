import React, { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from "react";
import { MessageCircle, Send, Bot, User, Trash2 } from "lucide-react";
import { askQuestion } from "../api";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

function AskQuestion() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentQuestion.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: currentQuestion,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAsking(true);

    const question = currentQuestion;
    setCurrentQuestion("");

    try {
      const response = await askQuestion(question);
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: "Sorry, I couldn't process your question. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI Chat</h2>
            <p className="text-sm text-gray-500">Ask questions about your documents</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm">Ask me anything about your uploaded documents</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "ai" && (
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : ""}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                </div>
                <p
                  className={`text-xs text-gray-400 mt-1 ${
                    message.type === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === "user" && (
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex-shrink-0 mt-1 order-3">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {isAsking && (
          <div className="flex gap-3 justify-start">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0 mt-1">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <p>Thinking...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <textarea
            value={currentQuestion}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCurrentQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentQuestion.trim() || isAsking}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AskQuestion;
