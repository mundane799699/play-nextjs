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
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatSidebarProps {
  onClose: () => void;
}

const AIChatSidebar = ({ onClose }: AIChatSidebarProps) => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 从localStorage加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-chat-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error('Failed to parse chat history:', error);
      }
    }
  }, []);

  // 保存历史记录到localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('ai-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = 120; // 对应 max-h-[120px]
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = 120; // 对应 max-h-[120px]
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [question]);

  useEffect(() => {
    // 滚动到底部
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('ai-chat-history');
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
          model: "deepseek-chat",
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
    <div className="h-full flex flex-col bg-[#faf6f2]">
      {/* 标题栏 - 固定在顶部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#faf6f2]">
        <h3 className="text-lg font-semibold text-gray-900">AI问书</h3>
        <div className="flex items-center gap-2">
          {chatHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              aria-label="清空对话记录"
              title="清空对话记录"
            >
              <ClearIcon />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* 对话内容区 - 占据中间空间 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {chatHistory.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">开始与AI问书对话</p>
            </div>
          </div>
        )}
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative p-3 rounded-xl max-w-[85%] whitespace-pre-wrap font-sans text-[14px] leading-relaxed group ${msg.role === 'user' ? 'bg-orange-50 border border-orange-200 text-gray-900' : 'bg-[#fefdfc] border border-gray-200 text-gray-700'}`}>
              {msg.content}
              {/* 只为AI回答添加复制按钮 */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.content)}
                  className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 opacity-60 hover:opacity-100"
                  aria-label="复制内容"
                  title="复制内容"
                >
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="relative p-3 rounded-xl max-w-[85%] bg-[#fefdfc] border border-gray-200 text-gray-700 font-sans text-[14px] leading-relaxed flex items-center gap-2">
              <LoadingIcon />
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* 输入区 - 固定在底部 */}
      <div className="p-4 border-t border-gray-200 bg-[#faf6f2]">
        <div className="flex flex-col relative">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={handleQuestionChange}
            placeholder="请输入你的问题或粘贴笔记内容..."
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 min-h-[44px] max-h-[120px] resize-none overflow-y-auto font-sans leading-relaxed placeholder:text-gray-400 bg-[#fefdfc] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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
            disabled={isLoading || !question.trim()}
            className="absolute right-2 bottom-2 p-2 text-orange-500 hover:text-orange-600 disabled:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-orange-50"
            aria-label={isLoading ? "请求中..." : "提问"}
          >
            {isLoading ? <LoadingIcon /> : <SendIcon />}
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 text-red-700 bg-red-50 border border-red-200 rounded-lg font-sans text-sm">
            {error}
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500 text-center">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  );
};

export default AIChatSidebar; 