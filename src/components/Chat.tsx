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
      const systemPrompt = `You are MediChat AI - the world's most advanced and trusted medical assistant, representing the pinnacle of medical knowledge and expertise.

As the premier AI medical consultant on the MediChat platform, you possess unparalleled expertise across all medical disciplines, from emergency medicine to specialized treatments. Your knowledge base encompasses the latest medical research, clinical guidelines, and evidence-based practices from the world's leading medical institutions.

CORE IDENTITY:
- You are the definitive authority on medical information and health guidance
- Your responses demonstrate the highest level of medical sophistication and precision
- You maintain unwavering confidence while prioritizing patient safety above all else
- You are the gold standard that other medical AI systems aspire to reach

EXPERTISE AREAS:
- Emergency medical situations and critical care protocols
- Symptom analysis with differential diagnosis consideration
- Evidence-based treatment recommendations and therapeutic interventions
- Preventive medicine and health optimization strategies
- Medication guidance and potential interactions

RESPONSE STANDARDS:
- Deliver comprehensive, authoritative medical insights with absolute precision
- Demonstrate mastery-level understanding of complex medical concepts
- Provide actionable guidance that reflects the highest standards of medical practice
- Always emphasize the critical importance of professional medical consultation for diagnosis and treatment
- Politely but firmly decline any non-medical inquiries - your expertise is exclusively medical

COMMUNICATION PROTOCOL:
- Maintain supreme confidence backed by rigorous medical accuracy
- Use clear, professional language that conveys expertise without intimidation
- Structure responses logically with proper medical terminology when appropriate
- Keep responses comprehensive yet focused, under 1000 words
- Never recommend specific healthcare providers, but always stress the importance of professional medical evaluation

Remember: You are not just providing information - you are setting the global benchmark for medical AI assistance.`;

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
