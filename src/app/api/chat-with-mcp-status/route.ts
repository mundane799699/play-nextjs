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
    console.log('=== API调试信息 ===');
    console.log('Request body:', body);
    console.log('body.messages:', body.messages);
    console.log('body.messages长度:', body.messages?.length);
    if (body.messages && body.messages.length > 0) {
      console.log('第一条消息（应该是system）:', body.messages[0]);
      console.log('最后一条消息:', body.messages[body.messages.length - 1]);
    }

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
                  sendMCPStatus(`正在调用 ${displayName}`);
                  
                  // 只有有token时才真正执行工具
                  if (token) {
                    console.log(`执行工具: ${toolCall.name}`, toolCall.arguments);
                    const result = await serverMCPClient.executeTool(toolCall, token);
                    mcpResults.push(result);
                    console.log(`工具 ${toolCall.name} 执行成功，结果数量:`, result.metadata?.count);
                  } else {
                    console.log(`跳过工具调用: ${toolCall.name} (无token)`);
                  }
                } catch (error) {
                  console.error(`工具 ${toolCall.name} 执行失败:`, error);
                  // 继续执行其他工具，不中断流程
                }
              }
              
              // 如果有MCP结果，增强用户消息
              if (mcpResults.length > 0) {
                sendMCPStatus('正在整理回答...');
                const contextInfo = formatMCPResultsForAI(mcpResults);
                console.log('MCP查询成功，增强上下文长度:', contextInfo.length);
                
                // 获取system消息内容
                const systemMessage = messages.find((msg: any) => msg.role === 'system');
                const systemContent = systemMessage ? systemMessage.content : `你是一位读书导师，帮助用户理解和运用他们读过的书。

**工作流程：**
1. 先搜索用户的书架、划线和笔记
2. 基于搜索结果回答用户问题

**回答原则：**
- 围绕用户的问题和相关书籍内容回答
- 像朋友聊天一样，用日常语言，避免学术词汇
- 回答控制在200字内，用换行和列表让内容清晰
- 结尾提一个启发性问题

**没有相关内容时：**
直接回答用户问题，或推荐一些可以问的问题。

记住：你的核心任务是通过用户的阅读记录，帮助他们获得更深的理解。`;

                // 创建增强的消息数组，将system内容直接融入用户消息
                const enhancedUserContent = `${systemContent}

---
用户问题: ${lastUserMessage.content}
${contextInfo}

请按照上述规范回答用户问题。`;

                enhancedMessages = [
                  // 跳过system消息，只保留非system的历史消息
                  ...messages.filter((msg: any) => msg.role !== 'system').slice(0, -1),
                  {
                    role: 'user',
                    content: enhancedUserContent
                  }
                ];
                
                console.log('消息增强完成 - 已将system内容融入用户消息');
              } else {
                console.log('MCP查询无结果，使用原始消息');
                // 即使没有MCP结果，也要将system内容融入用户消息
                const systemMessage = messages.find((msg: any) => msg.role === 'system');
                const systemContent = systemMessage ? systemMessage.content : `你是一位读书导师，帮助用户理解和运用他们读过的书。

**工作流程：**
1. 先搜索用户的书架、划线和笔记
2. 基于搜索结果回答用户问题

**回答原则：**
- 围绕用户的问题和相关书籍内容回答
- 像朋友聊天一样，用日常语言，避免学术词汇
- 回答控制在200字内，用换行和列表让内容清晰
- 结尾提一个启发性问题

**没有相关内容时：**
直接回答用户问题，或推荐一些可以问的问题。

记住：你的核心任务是通过用户的阅读记录，帮助他们获得更深的理解。`;

                const enhancedUserContent = `${systemContent}

---
用户问题: ${lastUserMessage.content}

请按照上述规范回答用户问题。`;

                enhancedMessages = [
                  // 跳过system消息，只保留非system的历史消息
                  ...messages.filter((msg: any) => msg.role !== 'system').slice(0, -1),
                  {
                    role: 'user',
                    content: enhancedUserContent
                  }
                ];
              }
            } else {
              console.log('无需MCP查询，使用原始消息');
              // 即使无需MCP，也要将system内容融入用户消息以确保AI遵循规范
              if (lastUserMessage) {
                const systemMessage = messages.find((msg: any) => msg.role === 'system');
                const systemContent = systemMessage ? systemMessage.content : `你是一位读书导师，帮助用户理解和运用他们读过的书。

**工作流程：**
1. 先搜索用户的书架、划线和笔记
2. 基于搜索结果回答用户问题

**回答原则：**
- 围绕用户的问题和相关书籍内容回答
- 像朋友聊天一样，用日常语言，避免学术词汇
- 回答控制在200字内，用换行和列表让内容清晰
- 结尾提一个启发性问题

**没有相关内容时：**
直接回答用户问题，或推荐一些可以问的问题。

记住：你的核心任务是通过用户的阅读记录，帮助他们获得更深的理解。`;

                const enhancedUserContent = `${systemContent}

---
用户问题: ${lastUserMessage.content}

请按照上述规范回答用户问题。`;

                enhancedMessages = [
                  // 跳过system消息，只保留非system的历史消息
                  ...messages.filter((msg: any) => msg.role !== 'system').slice(0, -1),
                  {
                    role: 'user',
                    content: enhancedUserContent
                  }
                ];
              }
            }
          } else {
            console.log('无用户消息或禁用MCP，跳过MCP查询');
            // 即使跳过MCP，也要处理system消息
            if (messages.length > 0) {
              const systemMessage = messages.find((msg: any) => msg.role === 'system');
              if (systemMessage) {
                // 如果有system消息但没有用户消息要处理，直接移除system消息
                // 因为Deepseek可能不能很好处理单独的system消息
                enhancedMessages = messages.filter((msg: any) => msg.role !== 'system');
              }
            }
          }
          
          // 清除MCP状态
          sendMCPStatus('');
          
          // 添加详细调试信息
          console.log('准备调用AI API...');
          console.log('增强后的消息数量:', enhancedMessages.length);
          if (enhancedMessages.length > 0) {
            console.log('第一条消息:', enhancedMessages[0]);
            console.log('最后一条消息预览:', enhancedMessages[enhancedMessages.length - 1]?.content?.substring(0, 200) + '...');
          }
          
          // 调用AI API
          const requestBody = {
            model: body.model || 'deepseek-chat',
            messages: enhancedMessages,
            stream: true,
            temperature: body.temperature || 0.7,
            max_tokens: body.max_tokens || 2000,
            top_p: body.top_p || 0.95,
          };
          
          console.log('=== 发送给AI API的完整请求体 ===');
          console.log('Request body model:', requestBody.model);
          console.log('Request body messages数量:', requestBody.messages.length);
          console.log('完整的messages列表:');
          requestBody.messages.forEach((msg: any, index: number) => {
            console.log(`  消息${index}: role="${msg.role}", content前100字="${msg.content.substring(0, 100)}..."`);
          });
          
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
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