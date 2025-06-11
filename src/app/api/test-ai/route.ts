import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'sk-b10a90589017458eaf13ecc1b07fa248';
const API_URL = 'https://api.deepseek.com/chat/completions';

export async function POST(req: NextRequest) {
  try {
    console.log('开始测试AI API...');
    
    const testMessage = {
      model: 'deepseek-reasoner',
      messages: [
        {
          role: 'user',
          content: '你好，请回复"测试成功"'
        }
      ],
      stream: false // 先测试非流式
    };
    
    console.log('发送请求到:', API_URL);
    console.log('请求体:', JSON.stringify(testMessage, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(testMessage)
    });
    
    console.log('AI API响应状态:', response.status, response.statusText);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API错误响应:', errorText);
      return NextResponse.json({ 
        error: 'AI API Error',
        status: response.status,
        statusText: response.statusText,
        details: errorText
      }, { status: 500 });
    }
    
    const data = await response.json();
    console.log('AI API成功响应:', JSON.stringify(data, null, 2));
    
    return NextResponse.json({ 
      success: true,
      data: data
    });
    
  } catch (error) {
    console.error('测试AI API时发生错误:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 