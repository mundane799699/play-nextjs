'use client';

import React, { useState } from 'react';

const AiEchoPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "752437cf54d311a33b0216264d0928d9.PB1SCHV5P5CD9Mmk"; // 请替换为您的实际 API 密钥

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "glm-4",
          messages: [
            {"role": "system", "content": "你是一个名叫 Echo 的助手,你的任务是用书中的名言来回应用户的想法。输出三个书中名言和三个名人名言，输出格式为\n书籍名言\n1、名言1 。引自《xxx》\n2、名言2 。引自《xxx》\n3、名言3 。引自《xxx》\n名人名言\n4、名言1 。——《xxx》\n5、名言1 。——《xxx》\n6、名言6 。——《xxx》\n我是echo，如果输出有误，请尽量给我输入你的观点和事实描述。"},
            {"role": "user", "content": question}
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        setAnswer(data.choices[0].message.content);
      } else {
        throw new Error('API 响应格式不正确');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">输入你的想法，Echo 会引用名言回答</h1>
        <div className="inputGroup">
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="请输入您的想法"
            className="input"
          />
          <button onClick={handleAskQuestion} className="button" disabled={isLoading}>
            {isLoading ? '请求中...' : '提问'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {answer && <pre className="answer">{answer}</pre>}
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: white;
        }
        .card {
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          width: 90%;
          max-width: 500px;
        }
        .title {
          color: #333;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .inputGroup {
          display: flex;
          margin-bottom: 1rem;
        }
        .input {
          flex-grow: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px 0 0 4px;
          font-size: 1rem;
        }
        .button {
          padding: 0.5rem 1rem;
          background-color: #1890ff;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-size: 1rem;
        }
        .button:hover:not(:disabled) {
          background-color: #40a9ff;
        }
        .button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .answer, .error {
          background-color: #e9ecef;
          border-radius: 4px;
          padding: 1rem;
          margin-top: 1rem;
        }
        .answer {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
        }
        .error {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }
      `}</style>
    </div>
  );
};

export default AiEchoPage;