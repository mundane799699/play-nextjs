import { Note } from "@/types/note";

export interface AIInsightResponse {
  content: string;
  error?: string;
}

export const getAIInsightStream = async (
  note: Note,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<void> => {
  try {
    const noteContent = `
书籍：${note.bookName || "未知"}
章节：${note.chapterName || ""}
标记文本：${note.markText || ""}
笔记内容：${note.noteContent || ""}
    `.trim();

    console.log("发送AI洞察请求:", { noteContent });
    
    const response = await fetch("/api/ai-insight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noteContent,
      }),
    });

    console.log("AI洞察响应状态:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `API请求失败: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("解析错误响应失败:", e);
      }
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法读取响应流");
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data && data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              console.log("前端解析错误:", e, "数据:", data);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("AI洞察流请求失败:", error);
    onError(error instanceof Error ? error.message : "未知错误");
  }
};

// 简单的非流式API
export const getAIInsight = async (note: Note): Promise<AIInsightResponse> => {
  try {
    const noteContent = `
书籍：${note.bookName || "未知"}
章节：${note.chapterName || ""}
标记文本：${note.markText || ""}
笔记内容：${note.noteContent || ""}
    `.trim();

    console.log("发送简单AI洞察请求:", { noteContent });
    
    const response = await fetch("/api/ai-insight-simple", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noteContent,
      }),
    });

    console.log("简单AI洞察响应状态:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `API请求失败: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("解析错误响应失败:", e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data.content) {
      return {
        content: data.content,
      };
    } else {
      throw new Error("API响应格式错误");
    }
  } catch (error) {
    console.error("AI洞察请求失败:", error);
    return {
      content: "",
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}; 