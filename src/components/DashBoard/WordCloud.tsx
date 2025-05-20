import React, { useEffect, useRef } from 'react';

export interface WordCloudProps {
  words: Array<{
    text: string;
    value: number;
  }>;
}

const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !words.length) return;

    // 模拟词云显示
    const container = containerRef.current;
    container.innerHTML = '';
    
    // 创建简单的展示
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-wrap justify-center items-center h-full gap-2 p-4';
    
    // 根据词频生成不同大小的标签
    words.slice(0, 40).forEach((word) => {
      const fontSize = calculateFontSize(word.value, words);
      const element = document.createElement('span');
      element.textContent = word.text;
      element.style.fontSize = `${fontSize}px`;
      element.style.fontWeight = fontSize > 16 ? 'bold' : 'normal';
      element.style.color = getRandomColor();
      element.style.padding = '4px';
      element.style.lineHeight = '1';
      element.style.display = 'inline-block';
      wrapper.appendChild(element);
    });
    
    container.appendChild(wrapper);
  }, [words]);
  
  // 计算字体大小
  const calculateFontSize = (value: number, words: Array<{text: string, value: number}>): number => {
    const maxValue = Math.max(...words.map(w => w.value));
    const minValue = Math.min(...words.map(w => w.value));
    const minSize = 12;
    const maxSize = 36;
    
    if (maxValue === minValue) return (minSize + maxSize) / 2;
    
    return minSize + ((value - minValue) / (maxValue - minValue)) * (maxSize - minSize);
  };
  
  // 获取随机颜色
  const getRandomColor = (): string => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return <div ref={containerRef} className="w-full h-full bg-white rounded-lg" />;
};

export default WordCloud; 