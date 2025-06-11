import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = "sk-b10a90589017458eaf13ecc1b07fa248";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

const SYSTEM_PROMPT = `请按以下结构分析这段笔记，保持简洁犀利的风格：

1. **一句话总结** - 用最直白的话概括核心观点
2. **核心逻辑** - 3-4句话解释为什么这样，直击本质
3. **实际例子** - 给出对比鲜明的高低级做法
4. **更深一层** - 挖掘背后的深层原理
5. **实用技巧** - 2-3个可操作的要点
6. **相关推荐** - 4本相关书籍，简述核心价值
7. **作者/思想背景** - 简介作者特点和观点来源
8. **核心洞察** - 最后用金句式总结，点出反直觉的智慧

风格要求：
- 语言简洁有力，避免废话
- 多用短句，节奏感强
- 敢于直言，不绕弯子
- 结合人性洞察
- 既有理论高度又接地气
- 每段控制在50字以内
- 用"记住："、"就像"、"区别在于"等过渡词增强说服力`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noteContent } = body;

    if (!noteContent) {
      return NextResponse.json(
        { error: "笔记内容不能为空" },
        { status: 400 }
      );
    }

    console.log("收到AI洞察请求:", { noteContent: noteContent.substring(0, 100) + "..." });

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: noteContent,
          },
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log("DeepSeek API响应状态:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API错误:", response.status, errorText);
      return NextResponse.json(
        { error: `API请求失败: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("DeepSeek API响应:", data.choices?.[0]?.message?.content?.substring(0, 100) + "...");
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return NextResponse.json({
        content: data.choices[0].message.content,
      });
    } else {
      console.error("API响应格式错误:", data);
      return NextResponse.json(
        { error: "API响应格式错误" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("AI洞察API错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
} 