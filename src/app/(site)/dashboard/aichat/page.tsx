'use client';
import React, { useState, useRef, useEffect } from "react";

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const LoadingIcon = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AIBookChatPage = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question]);

  useEffect(() => {
    // 滚动到底部
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  useEffect(() => {
    // 禁止body滚动
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setError(null);
    // 先追加用户消息
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    setQuestion("");
    try {
      const messages = [
        {
          role: "system",
          content:
            "你是一位善于解读书籍和笔记的AI助手。所有回答都要围绕用户的书籍、笔记内容展开，提供有针对性的分析、总结、推荐等。回答要简明、实用、有启发性。"
        },
        ...chatHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: question }
      ];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API 请求失败: ${response.status}`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      let accumulatedResponse = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              accumulatedResponse += content;
              // 实时更新最后一条assistant消息
              setChatHistory(prev => {
                // 如果最后一条是assistant，更新内容，否则追加
                if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') {
                  return [
                    ...prev.slice(0, -1),
                    { role: 'assistant', content: accumulatedResponse }
                  ];
                } else {
                  return [...prev, { role: 'assistant', content: accumulatedResponse }];
                }
              });
            } catch (e) {
              // ignore chunk parse error
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生未知错误");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f2] flex flex-col">
      {/* 内容区填满Tab下方剩余空间 */}
      <div className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-[800px] flex-1 flex flex-col justify-end">
          <div className="flex-1 overflow-y-auto px-2 pt-8" style={{minHeight:0}}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative p-4 rounded-xl border border-gray-200 shadow-sm max-w-[80%] whitespace-pre-wrap font-sans text-[15px] leading-relaxed ${msg.role === 'user' ? 'bg-white text-gray-900' : 'bg-[#faf6f2] text-gray-700'}`}>
                  {msg.content}
                  <button
                    onClick={() => handleCopy(msg.content)}
                    className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
                    aria-label="复制内容"
                  >
                    <span className="absolute hidden group-hover:block -top-8 -left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {isCopied ? "已复制!" : "复制内容"}
                    </span>
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="relative p-4 rounded-xl border border-gray-200 shadow-sm max-w-[80%] bg-[#faf6f2] text-gray-700 font-sans text-[15px] leading-relaxed">
                  <LoadingIcon />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
          <div className="bg-[#faf6f2] w-full p-4 border-t border-gray-200 sticky bottom-0">
            <div className="flex flex-col relative">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={handleQuestionChange}
                placeholder="请输入你的问题或粘贴笔记内容..."
                className="w-full p-3 pr-12 border border-[#ddd] rounded-md text-base focus:outline-none focus:border-orange-500 min-h-[42px] resize-none overflow-hidden font-sans leading-relaxed placeholder:text-gray-400"
                rows={1}
                style={{ height: "auto" }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskQuestion();
                  }
                }}
              />
              <button
                onClick={handleAskQuestion}
                disabled={isLoading}
                className="absolute right-3 bottom-2.5 text-orange-500 hover:text-orange-600 disabled:text-gray-300 transition-colors duration-200"
                aria-label={isLoading ? "请求中..." : "提问"}
              >
                {isLoading ? <LoadingIcon /> : <SendIcon />}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 text-[#721c24] bg-[#f8d7da] border-[#f5c6cb] rounded-md font-sans">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBookChatPage; 