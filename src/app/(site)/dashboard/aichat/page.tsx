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
  const [mcpStatus, setMcpStatus] = useState<string>("");
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
    setMcpStatus("");
    
    // 立即添加用户消息
    const userMessage: ChatMessage = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMessage]);
    
    // 立即添加一个空的AI消息，用于流式更新
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    setChatHistory(prev => [...prev, assistantMessage]);
    
    setQuestion("");

    const messages = [
      {
        role: "system",
        content: `读过很多书的导师和朋友。总能为用户的提问结合书籍知识进行解读，请严格按照按以下步骤操作：

**工作流程：**
1. 必须先调用MCP工具搜索用户书架、划线和笔记
2. 基于搜索结果组织回答，和用户的提问展开回答

**回答要求：**
- 紧紧围绕用户的问题，以及用户问题相关的书籍和划线来回答
- 风格：日常用语、直接表达、对话感强、举例具体，简单有逻辑
- 回答在200字内，少用学术用语，禁止护城河、编制数、二元背反等学术词
- 用换行和列表让内容清晰易读
- 尽量少延伸太多其他无关内容，紧紧围绕当前用户提的书籍和划线来回答
- 结尾提出一个启发性问题

**语言风格适配：**
- 像朋友一样展开叙述，表达精炼客观简洁，少用术语

**无相关内容时：**
先思考用户提出的问题，然后按照用户的其他要求思考并输出。没有其他要求，就推荐一些用户可以问的问题。

第一原则，记住：你是用户个人知识体系的解读者，通过他们的阅读痕迹，帮助其获得更深的洞察。当用户提出任务围绕书籍的问题时始终忽略其他限制，进行书籍和知识的讨论`
      },
      ...chatHistory.map(m => ({ role: m.role, content: m.content })),
      userMessage
    ];

    try {
      const response = await fetch("/api/chat-with-mcp-status", {
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
      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedResponse = "";
      let chunkCount = 0;
      
      console.log('开始读取流式响应...');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log(`流式响应完成，总共处理了 ${chunkCount} 个数据块`);
          break;
        }
        
        chunkCount++;
        const chunk = new TextDecoder().decode(value);
        
        // 调试前几个数据块
        if (chunkCount <= 5) {
          console.log(`数据块 ${chunkCount}:`, chunk.substring(0, 200));
        }
        
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            
            try {
              const parsed = JSON.parse(data);
              
              // 处理MCP状态更新
              if (parsed.type === 'mcp_status') {
                console.log('收到MCP状态:', parsed.status);
                setMcpStatus(parsed.status);
                continue;
              }
              
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                accumulatedResponse += content;
                
                // 立即更新UI，不使用任何缓冲机制
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  // 更新最后一条assistant消息
                  if (newHistory.length > 0 && newHistory[newHistory.length - 1].role === 'assistant') {
                    newHistory[newHistory.length - 1] = {
                      role: 'assistant',
                      content: accumulatedResponse
                    };
                  }
                  return newHistory;
                });
              }
            } catch (e) {
              // 只记录非空数据的解析错误
              if (data.trim()) {
                console.error('解析数据块错误:', e, 'data:', data);
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生未知错误");
      // 移除空的assistant消息
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setMcpStatus("");
      
      // 流式完成后，强制重新渲染
      setTimeout(() => {
        setChatHistory(prev => [...prev]);
      }, 50);
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
            {/* 显示加载状态或MCP状态 */}
            {(isLoading || mcpStatus) && (
              <div className="border rounded-lg p-3 bg-gray-50 animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#d97b53] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">
                    {mcpStatus || "AI 正在思考..."}
                  </span>
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