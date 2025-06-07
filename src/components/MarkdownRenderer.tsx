import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const renderMarkdown = (text: string) => {
    // 处理换行
    let html = text.replace(/\n/g, '<br>');
    
    // 处理粗体 **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 处理斜体 *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理标题 # ## ###
    html = html.replace(/^### (.*?)(<br>|$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h3>');
    html = html.replace(/^## (.*?)(<br>|$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h2>');
    html = html.replace(/^# (.*?)(<br>|$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h1>');
    
    // 处理列表项 - item
    html = html.replace(/^- (.*?)(<br>|$)/gm, '<li class="ml-4 mb-1 text-gray-800 dark:text-gray-200">• $1</li>');
    
    // 处理数字列表 1. item
    html = html.replace(/^\d+\. (.*?)(<br>|$)/gm, '<li class="ml-4 mb-1 text-gray-800 dark:text-gray-200 list-decimal">$1</li>');
    
    // 处理代码块 `code`
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // 处理链接 [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    return html;
  };

  return (
    <div 
      className={`prose prose-gray dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default MarkdownRenderer; 