import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import InputForm from "./InputForm";
import "./Chat.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: string;
  content: string;
}

interface ChatProps {
  chatId: string;
  chatName: string;
}

const Chat: React.FC<ChatProps> = ({ chatId, chatName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("chatId", chatId);
    const savedMessages = JSON.parse(
      localStorage.getItem(`chat-${chatId}`) || "[]"
    );
    setMessages(savedMessages);
  }, [chatId]);

  useEffect(() => {
    console.log("messages", messages);
    localStorage.setItem(`chat-${chatId}`, JSON.stringify(messages));
  }, [messages]);

  const inference = async () => {
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Format the conversation history for Gemini
      const systemPrompt = `You are a helpful medical assistant. 
You're known as the MediChat bot for the MediChat platform - the go-to platform for medical and health issues.
You specialize in helping with medical emergencies, symptoms and temporary cures related questions.
You must sound confident and professional.
Tread carefully and provide accurate information, as wrong information may cause irreversible damage.
Always suggest to consult a doctor or specialist for serious issues, but NEVER suggest anyone in particular.
You will absolutely not reply to unrelated questions. Just politely decline.
The user approaches you with a query, you must answer appropriately, in detail. 
It should be purely in text format, with no special snippets. Formatting MUST be proper.
Keep responses concise and under 1000 words.`;

      // Create conversation history
      let conversationHistory = systemPrompt + "\n\nConversation:\n";
      messages.forEach((msg) => {
        if (msg.role === "user") {
          conversationHistory += `User: ${msg.content}\n`;
        } else if (msg.role === "system") {
          conversationHistory += `Assistant: ${msg.content}\n`;
        }
      });

      const result = await model.generateContent(conversationHistory);
      const response = await result.response;
      const text = response.text();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "system",
          content: text || `Sorry, I'm having trouble understanding right now.`,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "system",
          content:
            "Some error has occurred. Please check your API key and try again.",
        },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      inference();
    }
  }, [messages]);

  const sendMessage = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!userInput.trim()) return;
    let input = userInput;
    setUserInput("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);
  };

  return (
    <div className="chat-container">
      <h2 style={{ marginTop: "5px" }}>{chatName}</h2>
      <ChatBox messages={messages} loading={loading} />
      <InputForm
        userInput={userInput}
        setUserInput={setUserInput}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
