'use client';

import React, { useState, useRef, useEffect } from 'react';

// SVG Icons
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const LoadingIcon = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3"></path>
    <path d="M3.05 11a9 9 0 1 1 .5 4"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

interface HistoryItem {
  question: string;
  answer: string;
  timestamp: number;
}

const AiEchoPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [showHistoryCard, setShowHistoryCard] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    // Reset height to auto to properly calculate new height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Reset textarea height when question changes externally (e.g., from history)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');
    setCurrentHistoryIndex(-1);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages: [
            {
              "role": "system", 
              "content": "博学多识的文学顾问 Echo，精通中外古今经典著作。请基于用户的问题或主题，从不同时期、不同文化背景的作品中，找出三个相关的原文引述。引述内容可以长短不一，每个引述都应当准确标注出处，并提供深入的分析解释。\n\n输出格式要求：\n相似观点：\n[原文引用]——《作品名称》，[作者]，[年代/朝代]\n[原文引用]——《作品名称》，[作者]，[年代/朝代]\n[原文引用]——《作品名称》，[作者]，[年代/朝代]\n\n解析：\n[综合分析提问内容和这三段引文的共同点、差异点，以及在当代的现实意义，表达语言通俗简单，直击人心]"
            },
            {"role": "user", "content": question}
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API 请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let accumulatedResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              accumulatedResponse += content;
              setAnswer(accumulatedResponse);
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      // Add to history after successful response
      const newHistoryItem = {
        question,
        answer: accumulatedResponse,
        timestamp: Date.now()
      };
      setHistory(prev => [...prev, newHistoryItem]);

    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryNavigation = (direction: 'prev' | 'next') => {
    if (history.length === 0) return;

    let newIndex;
    if (currentHistoryIndex === -1) {
      newIndex = direction === 'prev' ? history.length - 1 : 0;
    } else {
      newIndex = direction === 'prev' 
        ? Math.max(0, currentHistoryIndex - 1)
        : Math.min(history.length - 1, currentHistoryIndex + 1);
    }

    setCurrentHistoryIndex(newIndex);
    const historyItem = history[newIndex];
    setQuestion(historyItem.question);
    setAnswer(historyItem.answer);
  };

  const handleShowHistory = () => {
    setShowHistoryCard(true);
    if (history.length > 0) {
      setCurrentHistoryIndex(history.length - 1);
      setQuestion(history[history.length - 1].question);
      setAnswer(history[history.length - 1].answer);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="w-full max-w-[800px] mx-auto">
          <div className="bg-[#f8f9fa] rounded-lg shadow-md p-8">
            <h1 className="text-[#333] text-center mb-6 font-sans">输入你的笔记，Echo 会引用书籍回答</h1>
            <div className="mb-4">
              <div className="flex flex-col relative">
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={handleQuestionChange}
                  placeholder="请输入..."
                  className="w-full p-3 pr-12 border border-[#ddd] rounded-md text-base focus:outline-none focus:border-orange-500 min-h-[42px] resize-none overflow-hidden font-sans leading-relaxed placeholder:text-gray-400"
                  rows={1}
                  style={{ height: 'auto' }}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={isLoading}
                  className="absolute right-3 bottom-2.5 text-orange-500 hover:text-orange-600 disabled:text-gray-300 transition-colors duration-200"
                  aria-label={isLoading ? '请求中...' : '提问'}
                >
                  {isLoading ? <LoadingIcon /> : <SendIcon />}
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 text-[#721c24] bg-[#f8d7da] border-[#f5c6cb] rounded-md font-sans">
                {error}
              </div>
            )}
            {(!answer && !showHistoryCard && history.length > 0) && (
              <button
                onClick={handleShowHistory}
                className="mt-2 flex items-center gap-2 text-orange-500 hover:text-orange-600 mx-auto font-medium"
              >
                <HistoryIcon /> 查看历史回答
              </button>
            )}
            {(answer || showHistoryCard) && (
              <div className="relative mt-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 mb-8 leading-relaxed text-[15px]">{answer}</pre>
                <button
                  onClick={handleCopy}
                  className="absolute bottom-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
                  aria-label="复制内容"
                >
                  <span className="absolute hidden group-hover:block -top-8 -left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {isCopied ? '已复制!' : '复制内容'}
                  </span>
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            )}
            {(answer || showHistoryCard) && history.length > 0 && (
              <div className="flex justify-center items-center gap-8 mt-6">
                <button
                  onClick={() => handleHistoryNavigation('prev')}
                  className="text-orange-500 hover:text-orange-600 transition-colors disabled:text-gray-300 disabled:hover:text-gray-300"
                  disabled={currentHistoryIndex <= 0}
                >
                  <ArrowLeftIcon />
                </button>
                <span className="text-sm min-w-[3em] text-center text-gray-600 font-medium">
                  {currentHistoryIndex + 1} / {history.length}
                </span>
                <button
                  onClick={() => handleHistoryNavigation('next')}
                  className="text-orange-500 hover:text-orange-600 transition-colors disabled:text-gray-300 disabled:hover:text-gray-300"
                  disabled={currentHistoryIndex === history.length - 1}
                >
                  <ArrowRightIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiEchoPage;