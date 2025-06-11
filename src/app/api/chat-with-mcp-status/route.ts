import { NextRequest, NextResponse } from 'next/server';
import { 
  serverMCPClient, 
  analyzeUserQuestion, 
  formatMCPResultsForAI,
  MCPResult 
} from '@/lib/mcpClient';

// Hardcode the API key temporarily for testing
const API_KEY = 'sk-5541239aecd84baf8bb20c2432836dd6';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Request body:', body);

    // 获取用户token用于MCP调用
    const token = req.cookies.get("Admin-Token")?.value;
    const useMCP = body.useMCP !== false; // 默认启用MCP
    
    // 提取用户的最新消息
    const messages = body.messages || [];
    const lastUserMessage = messages.filter((msg: any) => msg.role === 'user').pop();
    
    let enhancedMessages = messages;
    
    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // 发送MCP工具调用状态的辅助函数
        const sendMCPStatus = (status: string) => {
          const statusData = `data: ${JSON.stringify({
            type: 'mcp_status', 
            status: status
          })}\n\n`;
          controller.enqueue(encoder.encode(statusData));
        };
        
        try {
          // 如果有用户消息且启用MCP，尝试使用MCP增强上下文
          if (lastUserMessage && useMCP) {
            console.log('开始MCP查询，用户问题:', lastUserMessage.content);
            
            // 分析用户问题，决定调用哪些MCP工具
            const toolCalls = analyzeUserQuestion(lastUserMessage.content);
            console.log('分析得到的工具调用:', toolCalls);
            
            if (toolCalls.length > 0) {
              // 执行MCP工具调用
              const mcpResults: MCPResult[] = [];
              
              for (const toolCall of toolCalls) {
                try {
                  // 发送工具调用状态
                  const toolDisplayNames: Record<string, string> = {
                    "get_bookshelf": "获取书架",
                    "search_books": "搜索书籍", 
                    "search_notes": "搜索笔记",
                    "get_book_notes": "获取笔记"
                  };
                  const displayName = toolDisplayNames[toolCall.name] || toolCall.name;
                  sendMCPStatus(`正在调用 ${toolCall.name} (${displayName})`);
                  
                  // 让用户看清工具调用状态 - 稍作延迟
                  await new Promise(resolve => setTimeout(resolve, 800));
                  
                  // 只有有token时才真正执行工具
                  if (token) {
                    console.log(`执行工具: ${toolCall.name}`, toolCall.arguments);
                    const result = await serverMCPClient.executeTool(toolCall, token);
                    mcpResults.push(result);
                    console.log(`工具 ${toolCall.name} 执行成功，结果数量:`, result.metadata?.count);
                  } else {
                    console.log(`模拟工具调用: ${toolCall.name} (无token)`);
                    // 模拟执行时间
                    await new Promise(resolve => setTimeout(resolve, 1200));
                  }
                  
                  // 工具执行完成后的短暂延迟
                  await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                  console.error(`工具 ${toolCall.name} 执行失败:`, error);
                  // 继续执行其他工具，不中断流程
                }
              }
              
              // 发送整理状态
              sendMCPStatus('正在整理回答...');
              
              // 让用户看清整理状态
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // 如果有MCP结果，增强用户消息
              if (mcpResults.length > 0) {
                const contextInfo = formatMCPResultsForAI(mcpResults);
                console.log('MCP查询成功，增强上下文长度:', contextInfo.length);
                
                // 创建增强的消息数组
                enhancedMessages = [
                  ...messages.slice(0, -1), // 除最后一条用户消息外的所有消息
                  {
                    ...lastUserMessage,
                    content: lastUserMessage.content + contextInfo
                  }
                ];
                
                console.log('消息增强完成');
              } else {
                console.log('MCP查询无结果，使用原始消息');
              }
            } else {
              console.log('无需MCP查询，使用原始消息');
            }
          } else {
            console.log('无用户消息或禁用MCP，跳过MCP查询');
          }
          
          // 清除MCP状态
          sendMCPStatus('');
          
          // 添加详细调试信息
          console.log('准备调用AI API...');
          console.log('增强后的消息数量:', enhancedMessages.length);
          console.log('最后一条消息预览:', enhancedMessages[enhancedMessages.length - 1]?.content?.substring(0, 200) + '...');
          
          // 调用AI API
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
              model: 'deepseek-chat', // 必需的model字段
              ...body,
              messages: enhancedMessages,
              stream: true
            })
          });

          console.log('AI API响应状态:', response.status, response.statusText);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Deepseek API error:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText
            });
            throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`);
          }

          console.log('开始读取AI响应流...');
          
          // 转发AI响应流
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No reader available');
          }

          const decoder = new TextDecoder();
          let chunkCount = 0;
          let firstChunk = true;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log(`AI响应流结束，总共处理了 ${chunkCount} 个数据块`);
              controller.close();
              break;
            }

            chunkCount++;
            const chunk = decoder.decode(value);
            
            // 过滤掉keep-alive信号，只处理有效的AI响应
            if (chunk.trim() === ': keep-alive' || chunk.trim() === '') {
              continue; // 跳过keep-alive和空白信号
            }
            
            // 调试前几个数据块
            if (chunkCount <= 3) {
              console.log(`AI响应数据块 ${chunkCount}:`, chunk.substring(0, 100) + '...');
            }
            
            // 确保不与MCP状态混淆
            if (firstChunk) {
              console.log('首个AI数据块:', chunk);
              firstChunk = false;
            }
            
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('Stream error:', error);
          // 发送详细的错误信息
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('详细错误信息:', errorMessage);
          
          try {
            // 发送错误状态
            const errorData = `data: ${JSON.stringify({
              type: 'error',
              error: `AI服务调用失败: ${errorMessage}`
            })}\n\n`;
            controller.enqueue(encoder.encode(errorData));
            
            // 发送一个基本的错误回复
            const fallbackResponse = `data: {"choices":[{"delta":{"content":"抱歉，AI服务暂时不可用。错误信息：${errorMessage}"}}]}\n\n`;
            controller.enqueue(encoder.encode(fallbackResponse));
          } catch (controllerError) {
            console.error('控制器已关闭，无法发送错误信息:', controllerError);
          }
          
          try {
            controller.close();
          } catch (closeError) {
            console.error('关闭控制器时出错:', closeError);
          }
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 