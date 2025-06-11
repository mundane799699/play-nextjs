'use client';

import React, { useState } from 'react';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export default function MCPTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async (testType: string, params?: any) => {
    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      let url = `/api/mcp/test?type=${testType}`;
      if (params?.keyword) {
        url += `&keyword=${encodeURIComponent(params.keyword)}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      setTestResults(prev => [...prev, {
        success: result.success,
        data: result.result,
        error: result.error,
        timestamp: `${timestamp} - ${testType}`
      }]);
    } catch (error: any) {
      setTestResults(prev => [...prev, {
        success: false,
        error: error.message,
        timestamp: `${timestamp} - ${testType}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const testAIChat = async () => {
    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [
            { role: 'user', content: '从我的阅读中，关于时间管理有什么深刻的智慧启发？' }
          ],
          useMCP: true
        })
      });

      if (response.ok) {
        setTestResults(prev => [...prev, {
          success: true,
          data: 'AI Chat with MCP integration working',
          timestamp: `${timestamp} - AI Chat`
        }]);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      setTestResults(prev => [...prev, {
        success: false,
        error: error.message,
        timestamp: `${timestamp} - AI Chat`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const testQuota = async () => {
    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      // 测试获取配额信息
      const getResponse = await fetch('/api/chat-quota?userId=test&memberType=FREE');
      const getResult = await getResponse.json();
      
      if (getResult.code === 200) {
        setTestResults(prev => [...prev, {
          success: true,
          data: {
            action: 'Get Quota',
            quota: getResult.data
          },
          timestamp: `${timestamp} - Get Quota`
        }]);
        
        // 测试使用配额
        const useResponse = await fetch('/api/chat-quota', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'test',
            memberType: 'FREE'
          })
        });
        
        const useResult = await useResponse.json();
        
        setTestResults(prev => [...prev, {
          success: useResult.code === 200,
          data: {
            action: 'Use Quota',
            quota: useResult.data || useResult.error
          },
          timestamp: `${timestamp} - Use Quota`
        }]);
      } else {
        throw new Error(getResult.error || 'Get quota failed');
      }
    } catch (error: any) {
      setTestResults(prev => [...prev, {
        success: false,
        error: error.message,
        timestamp: `${timestamp} - Quota Test`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-[#faf6f2] py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">MCP功能测试</h1>
          
          {/* 导航链接 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">测试页面</h2>
            <div className="flex gap-4">
              <a
                href="/dashboard/quota-test"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                配额功能测试页面
              </a>
            </div>
          </div>
          
          {/* 测试按钮区域 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">MCP工具测试</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => runTest('tools')}
                disabled={isLoading}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                获取工具列表
              </button>
              
              <button
                onClick={() => runTest('bookshelf')}
                disabled={isLoading}
                className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                获取书架
              </button>
              
              <button
                onClick={() => runTest('search_books', { keyword: '时间' })}
                disabled={isLoading}
                className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
              >
                搜索书籍
              </button>
              
              <button
                onClick={() => runTest('search_notes', { keyword: '管理' })}
                disabled={isLoading}
                className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                搜索笔记
              </button>
            </div>
          </div>

          {/* AI对话测试 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">AI对话集成测试</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testAIChat}
                disabled={isLoading}
                className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                测试AI问书（MCP集成）
              </button>
              
              <button
                onClick={() => testQuota()}
                disabled={isLoading}
                className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
              >
                测试对话次数限制
              </button>
            </div>
          </div>

          {/* 测试结果区域 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">测试结果</h2>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                清空结果
              </button>
            </div>
            
            {isLoading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">测试进行中...</p>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-600">
                      {result.timestamp}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        result.success
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {result.success ? '成功' : '失败'}
                    </span>
                  </div>
                  
                  {result.success ? (
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-red-600 text-sm">{result.error}</p>
                  )}
                </div>
              ))}
              
              {testResults.length === 0 && !isLoading && (
                <p className="text-gray-500 text-center py-8">
                  暂无测试结果，请点击上方按钮开始测试
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 