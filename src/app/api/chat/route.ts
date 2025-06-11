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
    console.log('Request body:', body);  // Debug log

    // 获取用户token用于MCP调用
    const token = req.cookies.get("Admin-Token")?.value;
    const useMCP = body.useMCP !== false; // 默认启用MCP
    
    // 提取用户的最新消息
    const messages = body.messages || [];
    const lastUserMessage = messages.filter((msg: any) => msg.role === 'user').pop();
    
    let enhancedMessages = messages;
    
    // 如果有用户消息且有token且启用MCP，尝试使用MCP增强上下文
    if (lastUserMessage && token && useMCP) {
      try {
        console.log('开始MCP查询，用户问题:', lastUserMessage.content);
        
        // 分析用户问题，决定调用哪些MCP工具
        const toolCalls = analyzeUserQuestion(lastUserMessage.content);
        console.log('分析得到的工具调用:', toolCalls);
        
        if (toolCalls.length > 0) {
          // 执行MCP工具调用
          const mcpResults: MCPResult[] = [];
          
          for (const toolCall of toolCalls) {
            try {
              console.log(`执行工具: ${toolCall.name}`, toolCall.arguments);
              const result = await serverMCPClient.executeTool(toolCall, token);
              mcpResults.push(result);
              console.log(`工具 ${toolCall.name} 执行成功，结果数量:`, result.metadata?.count);
            } catch (error) {
              console.error(`工具 ${toolCall.name} 执行失败:`, error);
              // 继续执行其他工具，不中断流程
            }
          }
          
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
      } catch (mcpError) {
        console.error('MCP处理失败，继续普通对话:', mcpError);
        // 出错时使用原始消息，不中断对话流程
      }
    } else {
      console.log('无token或无用户消息，跳过MCP查询');
    }

    // 调用AI API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: body.model || 'deepseek-chat',
        messages: enhancedMessages,
        stream: true,
        temperature: body.temperature,
        max_tokens: body.max_tokens,
        top_p: body.top_p,
        // 不直接展开body，避免覆盖messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepseek API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json({ 
        error: `Deepseek API error: ${response.status} ${response.statusText}`,
        details: errorText 
      }, { status: response.status });
    }

    // Forward the streaming response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value);
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
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
