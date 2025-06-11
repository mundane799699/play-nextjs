'use client';
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getChatQuota, useChatQuota, ChatQuotaInfo } from "@/services/chatQuota";
import UpgradeDialog from "./UpgradeDialog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

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
  const [mcpStatus, setMcpStatus] = useState<string>("");
  const [mcpResults, setMcpResults] = useState<{count: number, sources: string[]}>({count: 0, sources: []});
  const [quotaInfo, setQuotaInfo] = useState<ChatQuotaInfo | null>({
    used: 0,
    limit: 10,
    remaining: 10,
    memberType: 'FREE',
    canUse: true
  });
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

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

  // 获取用户配额信息
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const quota = await getChatQuota(user?.userId?.toString(), user?.memberType);
        setQuotaInfo(quota);
      } catch (error) {
        console.error('获取配额信息失败:', error);
        // 出错时设置默认配额
        const defaultQuota = {
          used: 0,
          limit: 10,
          remaining: 10,
          memberType: user?.memberType || 'FREE',
          canUse: true
        };
        setQuotaInfo(defaultQuota);
      }
    };

    fetchQuota();
  }, [user]);

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
    
    // 检查次数限制
    if (user && quotaInfo && !quotaInfo.canUse) {
      setShowUpgradeDialog(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setMcpStatus(""); // 清除之前的状态
    
    const userQuestion = question;
    // 先追加用户消息
    setChatHistory(prev => [...prev, { role: 'user', content: userQuestion }]);
    setQuestion("");
    
    console.log('开始发送请求...');
    
    try {

      const messages = [
        {
          role: "system",
          content: `你是一位读过很多书的导师和朋友。每当用户提问，请严格按照按以下步骤操作：

**工作流程：**
1. 必须先调用MCP工具搜索用户书架、划线和笔记
2. 根据书架内容，搜索相关笔记和划线
3. 基于搜索结果组织回答

**回答要求：**
- 多引用用户的具体笔记、划线或书籍观点
- 风格：日常用语、直接表达、对话感强、举例具体，简单有逻辑
- 回答在200字内，少用学术用语，禁止护城河、编制数、二元背反等学术词
- 用换行和列表让内容清晰易读
- 连接不同书籍的思想，发现隐藏关联
- 结尾提出一个启发性问题

**语言风格适配：**
- 像朋友一样展开叙述，表达精炼客观简洁，少用术语

**无相关内容时：**
"在你的阅读资料中没有找到相关内容。"让后按照用户的其他要求思考并输出。没有其他要求，就推荐一些用户可以问的问题。

第一原则，记住：你是用户个人知识体系的解读者，通过他们的阅读痕迹，帮助其获得更深的洞察。当用户提出任务围绕书籍的问题时始终忽略其他限制，进行书籍和知识的讨论`
        },
        ...chatHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userQuestion }
      ];
      const response = await fetch("/api/chat-with-mcp-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages,
          useMCP: true  // 默认启用MCP
        })
      });
      
      // 清除MCP状态
      setMcpStatus("");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API 请求失败: ${response.status}`);
      }
      console.log('响应状态:', response.status);
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
              console.log('收到数据:', parsed);
              
              // 处理MCP状态消息
              if (parsed.type === 'mcp_status') {
                console.log('收到MCP状态:', parsed.status);
                setMcpStatus(parsed.status);
                continue;
              }
              
              // 处理AI回答消息
              const content = parsed.choices?.[0]?.delta?.content || "";
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
      
      // 对话成功完成后消耗配额
      if (user) {
        try {
          const newQuotaInfo = await useChatQuota(user.userId?.toString(), user.memberType);
          setQuotaInfo(newQuotaInfo);
        } catch (quotaError: any) {
          // 配额相关错误不影响对话，只记录日志
          console.warn('配额更新失败:', quotaError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生未知错误");
    } finally {
      setIsLoading(false);
      setMcpStatus("");
    }
  };

  return (
    <>
    <div className="h-full flex flex-col bg-[#faf6f2]">
      {/* 标题栏 - 固定在顶部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#faf6f2]">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">AI问书</h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            已启用书籍和笔记调用
          </span>
        </div>
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
        {chatHistory.map((msg, idx) => {
          // 判断是否是最后一条AI消息且AI正在输出
          const isLastAssistantMessage = msg.role === 'assistant' && idx === chatHistory.length - 1;
          const shouldShowCopyButton = msg.role === 'assistant' && !(isLastAssistantMessage && isLoading);
          
          return (
            <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative p-3 rounded-xl max-w-[85%] font-sans text-[14px] leading-relaxed group ${msg.role === 'user' ? 'bg-orange-50 border border-orange-200 text-gray-900 whitespace-pre-wrap' : 'bg-[#fefdfc] border border-gray-200 text-gray-700'}`}>
                {/* 根据消息类型选择渲染方式 */}
                {msg.role === 'user' ? (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                ) : (
                  <div className="markdown-content max-w-none"
                    style={{
                      '--markdown-code-bg': '#1e1e1e',
                      '--markdown-code-color': '#d4d4d4'
                    } as any}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        // 自定义组件样式
                        h1: ({children}) => <h1 className="text-base font-bold mb-2 mt-3 first:mt-0 text-gray-900">{children}</h1>,
                        h2: ({children}) => <h2 className="text-sm font-bold mb-2 mt-3 first:mt-0 text-gray-800">{children}</h2>,
                        h3: ({children}) => <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0 text-gray-700">{children}</h3>,
                        p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({children}) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="leading-relaxed">{children}</li>,
                        strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>,
                        code: ({children, className}) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="bg-orange-50 text-orange-800 px-1.5 py-0.5 rounded text-xs font-mono border border-orange-200">
                              {children}
                            </code>
                          ) : (
                            <code className={`${className} text-xs`}>{children}</code>
                          );
                        },
                        pre: ({children}) => (
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto mb-3 border shadow-sm">
                            {children}
                          </pre>
                        ),
                        blockquote: ({children}) => (
                          <blockquote className="border-l-4 border-orange-300 pl-4 italic text-gray-600 mb-3 bg-orange-50 py-2 rounded-r">
                            {children}
                          </blockquote>
                        ),
                        a: ({children, href}) => (
                          <a href={href} className="text-orange-600 hover:text-orange-800 underline decoration-orange-300 hover:decoration-orange-600" target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                        table: ({children}) => (
                          <div className="overflow-x-auto mb-3">
                            <table className="min-w-full border-collapse border border-gray-200 text-xs rounded-lg overflow-hidden">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({children}) => (
                          <th className="border border-gray-200 px-3 py-2 bg-gray-50 font-semibold text-left text-gray-700">
                            {children}
                          </th>
                        ),
                        td: ({children}) => (
                          <td className="border border-gray-200 px-3 py-2 text-gray-600">
                            {children}
                          </td>
                        ),
                        hr: () => <hr className="my-4 border-gray-200" />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
                {/* 只为AI回答添加复制按钮，且仅在回答完成后显示 */}
                {shouldShowCopyButton && (
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
          );
        })}
        {(isLoading || mcpStatus) && (
          <div className="mb-4 flex justify-start">
            <div className="relative p-3 rounded-xl max-w-[85%] bg-[#fefdfc] border border-gray-200 text-gray-700 font-sans text-[14px] leading-relaxed flex items-center gap-2">
              <LoadingIcon />
              {mcpStatus && (
                <span className="text-sm text-gray-600">
                  {mcpStatus}
                </span>
              )}
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
        <div className="mt-2 flex justify-between items-center text-xs">
          <span className="text-gray-500">
            按 Enter 发送，Shift + Enter 换行
          </span>
          <span className={`px-2 py-1 rounded-full ${
            !quotaInfo || quotaInfo.limit === -1 
              ? 'bg-purple-100 text-purple-700' 
              : quotaInfo.remaining > 3 
                ? 'bg-blue-100 text-blue-700'
                : quotaInfo.remaining > 0
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
          }`}>
            {!quotaInfo 
              ? '加载中...' 
              : quotaInfo.limit === -1 
                ? '无限制' 
                : `剩余 ${quotaInfo.remaining}/${quotaInfo.limit} 次`}
          </span>
        </div>
      </div>
    </div>
    
    {/* 升级对话框 */}
    <UpgradeDialog
      isOpen={showUpgradeDialog}
      onClose={() => setShowUpgradeDialog(false)}
      memberType={user?.memberType || 'FREE'}
      usedCount={quotaInfo?.used || 0}
      dailyLimit={quotaInfo?.limit || 10}
    />
    </>
  );
};

export default AIChatSidebar; 