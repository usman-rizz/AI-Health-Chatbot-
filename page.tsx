"use client";

import { useEffect, useRef, useState } from "react";

import {
  HeartPulse,
  MessageSquare,
  History,
  Send,
  Sparkles,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function Home() {

  // =========================================
  // STATES
  // =========================================

  const [darkMode, setDarkMode] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<
      {
        role: "user" | "assistant";
        content: string;
      }[]
    >([]);

  const [chatHistory, setChatHistory] =
  
    useState<string[]>([]);
useEffect(() => {
  const saved = localStorage.getItem("chatHistory");
  if (saved) setChatHistory(JSON.parse(saved));
}, []);


useEffect(() => {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}, [chatHistory]);
  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  // =========================================
  // CARDS
  // =========================================

  const allCards = [
    "What causes a sore throat?",
    "Is paracetamol safe for children?",
    "How much water should I drink daily?",
    "What are symptoms of vitamin D deficiency?",
    "When should I see a doctor for a headache?",
    "What is a normal resting heart rate?",
  ];

  const [cards, setCards] =
    useState<string[]>([]);

  useEffect(() => {
    setCards(allCards);
  }, []);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage = async (
    customMessage?: string
  ) => {

    const finalMessage =
      customMessage || input;

    if (!finalMessage.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: finalMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setChatHistory((prev) => [
      finalMessage,
      ...prev,
    ]);

    setLoading(true);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "44px";
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: finalMessage,
          }),
        }
      );

      const data =
        await response.json();
const reply =
  data?.response && typeof data.response === "string"
    ? data.response
    : "No response from AI.";

setMessages((prev) => [
  ...prev,
  { role: "assistant", content: reply },
]);
      const botMessage = {
        role: "assistant" as const,
        content:
          data.response ||
          "No response from AI.",
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (error) {

      console.error(error);

      const errorMessage = {
        role: "assistant" as const,
        content:
          "Backend connection failed.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // ENTER SEND
  // =========================================

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =========================================
  // THEME COLORS
  // =========================================

  const bgMain = darkMode
    ? "bg-[#0B1120] text-white"
    : "bg-gradient-to-br from-[#F4F7FB] via-[#EEF4FF] to-[#F8FAFC] text-[#111827]";

  const sidebarBg = darkMode
    ? "bg-[#0A0F1C]"
    : "bg-white/80 backdrop-blur-xl";

  const cardBg = darkMode
    ? "bg-[#111827]"
    : "bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)]";

  const borderColor = darkMode
    ? "border-[#1F2937]"
    : "border-[#E5EAF2]";

  const textSecondary = darkMode
    ? "text-gray-400"
    : "text-[#5B6475]";
const [showHistoryPanel, setShowHistoryPanel] = useState(false);
const [historySearch, setHistorySearch] = useState("");

const filteredHistory = chatHistory.filter((item) =>
  item.toLowerCase().includes(historySearch.toLowerCase())
);

const exportHistory = () => {
  const blob = new Blob(
    [JSON.stringify(chatHistory, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chat-history.json";
  a.click();
};
  return (

    <main
    
      className={`
        h-screen
        flex
        overflow-hidden
        transition-all
        duration-300
        ${bgMain}
      `}
    >
{showHistoryPanel && (
  <div className="fixed right-0 top-0 w-[320px] h-full bg-black/80 backdrop-blur-md z-50 p-4 overflow-y-auto">
    
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-white font-bold">History</h2>
      <button onClick={() => setShowHistoryPanel(false)}>✕</button>
    </div>

    <input
      value={historySearch}
      onChange={(e) => setHistorySearch(e.target.value)}
      placeholder="Search history..."
      className="w-full p-2 mb-3 rounded bg-white/10 text-white"
    />

    <button
      onClick={exportHistory}
      className="text-cyan-400 mb-3 text-sm"
    >
      Export History
    </button>

    <div className="space-y-2">
      {filteredHistory.map((h, i) => (
        <div key={i} className="p-2 bg-white/10 rounded text-white text-sm">
          {h}
        </div>
      ))}
    </div>

  </div>
)}
      {/* SIDEBAR */}

      <aside
        className={`
          ${sidebarOpen
            ? "w-[260px]"
            : "w-[82px]"
          }
          ${sidebarBg}
          border-r
          ${borderColor}
          transition-all
          duration-300
          flex
          flex-col
          justify-between
          shrink-0
        `}
      >

        <div>

          {/* LOGO */}

          <div
            className={`
              flex
              items-center
              ${sidebarOpen
                ? "justify-between"
                : "justify-center"
              }
              px-4
              py-5
            `}
          >

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              onClick={() =>
                window.location.reload()
              }
              className="
                flex
                items-center
                gap-3
                cursor-pointer
                overflow-hidden
              "
            >

              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(34,211,238,0.3)",
                    "0 0 24px rgba(34,211,238,0.7)",
                    "0 0 10px rgba(34,211,238,0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="
                  min-w-[42px]
                  w-[42px]
                  h-[42px]
                  rounded-xl
                  bg-gradient-to-br
                  from-cyan-400
                  to-teal-500
                  flex
                  items-center
                  justify-center
                "
              >

                <HeartPulse
                  size={20}
                  className="text-black"
                />

              </motion.div>

              <AnimatePresence>

                {sidebarOpen && (

                  <motion.div
                    className="min-w-max"
                  >

                    <h1 className="text-[18px] font-semibold leading-none">
                      MediGuide
                    </h1>

                    <p className="text-[12px] text-gray-400 mt-1">
                      Health Assistant
                    </p>

                  </motion.div>

                )}

              </AnimatePresence>

            </motion.div>

            {sidebarOpen && (

              <button
                onClick={() =>
                  setSidebarOpen(false)
                }
                className="
                  cursor-pointer
                  hover:text-cyan-400
                  transition-all
                "
              >

                <PanelLeftClose size={18} />

              </button>

            )}

          </div>

          {!sidebarOpen && (

            <div className="flex justify-center mt-2">

              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
              >

                <PanelLeftOpen size={18} />

              </button>

            </div>

          )}

          {/* NEW CHAT */}

          <div className="px-4 mt-5">

            <button
              onClick={() => {
                setMessages([]);
                setInput("");
              }}
              className={`
                w-full
                bg-gradient-to-r
                from-cyan-400
                to-teal-400
                hover:scale-[1.02]
                text-black
                rounded-xl
                transition-all
                font-medium
                cursor-pointer
                text-[14px]

                ${sidebarOpen
                  ? "py-3"
                  : "h-[50px] flex items-center justify-center"
                }
              `}
            >

              {sidebarOpen ? (
                "+ New Chat"
              ) : (
                <MessageSquare size={18} />
              )}

            </button>

          </div>

          {/* MENU */}

          <div className="mt-5 px-3 space-y-3">

            {/* CHAT */}

            <div
              className={`
                ${cardBg}
                border
                ${borderColor}
                rounded-xl
                transition-all
                cursor-pointer
              `}
            >

              <div
                className={`
                  flex
                  items-center
                  text-[14px]

                  ${sidebarOpen
                    ? "gap-3 px-4 py-3"
                    : "justify-center h-[52px]"
                  }
                `}
              >

                <MessageSquare size={18} />

                {sidebarOpen && (
                  <span>Chat</span>
                )}

              </div>

            </div>

            {/* HISTORY */}

            <div
             onClick={() => setShowHistoryPanel(true)}
              className={`
                ${cardBg}
                border
                ${borderColor}
                rounded-xl
                transition-all
                cursor-pointer
              `}
            >

              <div
                className={`
                  flex
                  items-center
                  text-[14px]

                  ${sidebarOpen
                    ? "gap-3 px-4 py-3"
                    : "justify-center h-[52px]"
                  }
                `}
              >

                <History size={18} />

                {sidebarOpen && (
                  <span>History</span>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="p-4">

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className={`
              w-full
              ${cardBg}
              border
              ${borderColor}
              rounded-xl
              transition-all
              cursor-pointer

              ${sidebarOpen
                ? "py-3"
                : "h-[52px] flex items-center justify-center"
              }
            `}
          >

            <div className="flex items-center justify-center">

              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}

            </div>

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <section className="
        flex-1
        overflow-y-auto
      ">

        {/* TOP */}

        <div
          className={`
            h-[70px]
            border-b
            ${borderColor}
            px-6
            flex
            items-center
            justify-between
            sticky
            top-0
            z-30
          `}
        >

          <h2 className="
            text-[20px]
            font-semibold
          ">
            AI-Health ChatBot
          </h2>

          <div className="
            px-4
            py-1.5
            rounded-full
            bg-cyan-400/20
            text-cyan-300
            text-[12px]
            font-medium
          ">
            MediGuide
          </div>

        </div>

        {/* CENTER */}

        <div className="
          max-w-5xl
          mx-auto
          px-6
          pt-6 pb-6
          flex
          flex-col
          items-center
        ">

          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              w-[70px]
              h-[70px]
              rounded-[26px]
              bg-cyan-400/10
              flex
              items-center
              justify-center
            "
          >

            <Sparkles
              size={28}
              className="text-cyan-400"
            />

          </motion.div>

          <h1 className="
            text-center
            text-[35px]
            md:text-[40px]
            font-bold
            mt-4
          ">
            Ask me anything about your health
          </h1>

          <p className={`
            text-center
            text-[17px]
            mt-5
            ${textSecondary}
          `}>
            I can explain symptoms,
            medications, wellness tips,
            and when to see a doctor.
          </p>

          {/* CARDS */}

          <div className="
            w-full
            max-w-4xl
            mt-6
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          ">

            {cards.map((card, index) => (

              <motion.div
                key={index}
                onClick={() =>
                  sendMessage(card)
                }
                whileHover={{
                  scale: 1.02,
                  y: -4,
                }}
                className={`
                  ${cardBg}
                  border
                  ${borderColor}
                  rounded-2xl
                  px-5
                  py-5
                  text-[16px]
                  leading-7
                  cursor-pointer
                `}
              >

                {card}

              </motion.div>

            ))}

          </div>

          {/* CHAT */}

          <div className="
            w-full
            max-w-5xl
            mt-6
          ">

            <div className="
              space-y-4
              mb-5
              max-h-[400px]
              overflow-y-auto
            ">

              {messages.map(
                (msg, index) => (

                  <div
                    key={index}
                    className={`
                      p-4
                      rounded-2xl
                      text-[15px]
                      leading-7

                      ${msg.role === "user"

                        ? "bg-cyan-400 text-black ml-auto max-w-[80%]"

                        : `
                          ${cardBg}
                          border
                          ${borderColor}
                          max-w-[80%]
                        `
                      }
                    `}
                  >

                    {msg.content}

                  </div>

                )
              )}

              {loading && (

                <div
                  className={`
                    ${cardBg}
                    border
                    ${borderColor}
                    max-w-[80%]
                    p-4
                    rounded-2xl
                  `}
                >
                  Thinking...
                </div>

              )}

            </div>

            {/* INPUT */}

            <div className={`
              ${cardBg}
              border
              ${borderColor}
              rounded-[28px]
              px-5
              py-4
              flex
              items-end
              gap-4
            `}>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {

                  setInput(e.target.value);

                  if (
                    textareaRef.current
                  ) {

                    textareaRef.current.style.height =
                      "auto";

                    textareaRef.current.style.height =
                      textareaRef.current.scrollHeight + "px";
                  }
                }}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask a health question..."
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  resize-none
                  text-[15px]
                  leading-7
                "
              />

              <button
                onClick={() =>
                  sendMessage()
                }
                className="
                  shrink-0
                  w-12
                  h-12
                  rounded-2xl
                  bg-cyan-400
                  hover:bg-cyan-300
                  flex
                  items-center
                  justify-center
                "
              >

                <Send
                  size={19}
                  className="text-black"
                />

              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
