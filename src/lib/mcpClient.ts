// 服务端MCP客户端 - 用于后端API调用
import { notesService } from "@/services/notes";
import { booksService } from "@/services/books";

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPResult {
  content: any;
  metadata?: {
    source: string;
    count: number;
    query?: string;
  };
}

class ServerMCPClient {
  private static instance: ServerMCPClient;

  static getInstance(): ServerMCPClient {
    if (!ServerMCPClient.instance) {
      ServerMCPClient.instance = new ServerMCPClient();
    }
    return ServerMCPClient.instance;
  }

  // 定义可用工具
  getAvailableTools(): MCPTool[] {
    return [
      {
        name: "get_bookshelf",
        description: "获取用户的书架列表，包含所有书籍信息",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "search_books",
        description: "根据关键词搜索书籍",
        inputSchema: {
          type: "object",
          properties: {
            keyword: {
              type: "string",
              description: "搜索关键词，可以是书名或作者名"
            }
          },
          required: ["keyword"]
        }
      },
      {
        name: "get_book_notes",
        description: "获取指定书籍的所有笔记和划线",
        inputSchema: {
          type: "object",
          properties: {
            bookId: {
              type: "string",
              description: "书籍ID"
            },
            bookName: {
              type: "string",
              description: "书籍名称（可选，用于辅助查询）"
            }
          },
          required: ["bookId"]
        }
      },
      {
        name: "search_notes",
        description: "全局搜索笔记内容",
        inputSchema: {
          type: "object",
          properties: {
            keyword: {
              type: "string",
              description: "搜索关键词，在笔记内容和划线文本中搜索"
            },
            bookId: {
              type: "string",
              description: "可选：限制在特定书籍中搜索"
            }
          },
          required: ["keyword"]
        }
      }
    ];
  }

  // 执行工具调用
  async executeTool(toolCall: MCPToolCall, token: string): Promise<MCPResult> {
    try {
      switch (toolCall.name) {
        case "get_bookshelf":
          return await this.executeGetBookshelf(token);
        case "search_books":
          return await this.executeSearchBooks(toolCall.arguments as { keyword: string }, token);
        case "get_book_notes":
          return await this.executeGetBookNotes(toolCall.arguments as { bookId: string; bookName?: string }, token);
        case "search_notes":
          return await this.executeSearchNotes(toolCall.arguments as { keyword: string; bookId?: string }, token);
        default:
          throw new Error(`未知的工具: ${toolCall.name}`);
      }
    } catch (error: any) {
      console.error(`执行工具 ${toolCall.name} 失败:`, error);
      throw error;
    }
  }

  private async executeGetBookshelf(token: string): Promise<MCPResult> {
    const result = await booksService(token);
    if (result.code !== 200) {
      throw new Error(result.msg || "获取书架失败");
    }
    return {
      content: {
        books: result.rows || [],
        total: result.total || 0
      },
      metadata: {
        source: "bookshelf",
        count: result.rows?.length || 0
      }
    };
  }

  private async executeSearchBooks(params: { keyword: string }, token: string): Promise<MCPResult> {
    const bookshelf = await this.executeGetBookshelf(token);
    
    // 改进的搜索匹配算法
    const keyword = params.keyword.toLowerCase();
    const filteredBooks = bookshelf.content.books.filter((book: any) => {
      const bookName = (book.bookName || '').toLowerCase();
      const bookAuthor = (book.bookAuthor || '').toLowerCase();
      
      // 1. 完全匹配 (最高优先级)
      if (bookName.includes(keyword) || bookAuthor.includes(keyword)) {
        return true;
      }
      
      // 2. 分词匹配 - 处理中文分词和空格分隔
      const keywordParts = keyword.split(/[\s]+/).filter(part => part.length > 0);
      for (const part of keywordParts) {
        if (bookName.includes(part) || bookAuthor.includes(part)) {
          return true;
        }
      }
      
      // 3. 字符匹配 - 对于中文单字匹配
      if (keyword.length === 1 && (bookName.includes(keyword) || bookAuthor.includes(keyword))) {
        return true;
      }
      
      return false;
    });
    
    return {
      content: {
        books: filteredBooks,
        total: filteredBooks.length,
        keyword: params.keyword
      },
      metadata: {
        source: "book_search",
        count: filteredBooks.length,
        query: params.keyword
      }
    };
  }

  private async executeGetBookNotes(params: { bookId: string; bookName?: string }, token: string): Promise<MCPResult> {
    const result = await notesService(params.bookId, params.bookName || "", token);
    if (result.code !== 200) {
      throw new Error(result.msg || "获取笔记失败");
    }
    
    return {
      content: {
        notes: result.rows || [],
        bookName: result.bookName,
        total: result.total || 0
      },
      metadata: {
        source: "book_notes",
        count: result.rows?.length || 0
      }
    };
  }

  private async executeSearchNotes(params: { keyword: string; bookId?: string }, token: string): Promise<MCPResult> {
    let allNotes: any[] = [];
    
    if (params.bookId) {
      // 在特定书籍中搜索
      const bookNotes = await this.executeGetBookNotes({ bookId: params.bookId }, token);
      allNotes = bookNotes.content.notes;
    } else {
      // 全局搜索：搜索所有书籍的笔记
      const bookshelf = await this.executeGetBookshelf(token);
      const allBooks = bookshelf.content.books; // 移除限制，搜索所有书籍
      
      console.log(`开始搜索所有 ${allBooks.length} 本书的笔记...`);
      
      // 并行获取笔记以提高性能
      const notePromises = allBooks.map(async (book: any) => {
        try {
          const bookNotes = await this.executeGetBookNotes({ bookId: book.bookId }, token);
          return bookNotes.content.notes || [];
        } catch (error) {
          console.error(`获取书籍 ${book.bookName} 笔记失败:`, error);
          return [];
        }
      });
      
      const allNotesArrays = await Promise.all(notePromises);
      allNotes = allNotesArrays.flat();
      
      console.log(`获取到总计 ${allNotes.length} 条笔记和划线`);
    }
    
    // 改进的笔记搜索匹配算法
    const keyword = params.keyword.toLowerCase();
    const filteredNotes = allNotes.filter((note: any) => {
      const markText = (note.markText || '').toLowerCase();
      const noteContent = (note.noteContent || '').toLowerCase();
      const bookName = (note.bookName || '').toLowerCase();
      const chapterName = (note.chapterName || '').toLowerCase();
      
      // 1. 完全匹配搜索
      if (markText.includes(keyword) || 
          noteContent.includes(keyword) || 
          bookName.includes(keyword) ||
          chapterName.includes(keyword)) {
        return true;
      }
      
      // 2. 分词匹配
      const keywordParts = keyword.split(/[\s]+/).filter(part => part.length > 0);
      for (const part of keywordParts) {
        if (markText.includes(part) || 
            noteContent.includes(part) || 
            bookName.includes(part) ||
            chapterName.includes(part)) {
          return true;
        }
      }
      
      // 3. 模糊匹配 - 对于较短的关键词
      if (keyword.length <= 3) {
        const allText = `${markText} ${noteContent} ${bookName} ${chapterName}`;
        if (allText.includes(keyword)) {
          return true;
        }
      }
      
      return false;
    });
    
    console.log(`关键词 "${params.keyword}" 匹配到 ${filteredNotes.length} 条相关笔记`);
    
    return {
      content: {
        notes: filteredNotes, // 返回所有匹配的结果，不再限制数量
        total: filteredNotes.length,
        keyword: params.keyword
      },
      metadata: {
        source: "note_search",
        count: filteredNotes.length,
        query: params.keyword
      }
    };
  }
}

// 智能分析用户问题并决定调用哪些工具
export function analyzeUserQuestion(question: string): MCPToolCall[] {
  const questionLower = question.toLowerCase();
  const toolCalls: MCPToolCall[] = [];

  // 提取关键词 - 改进版
  const extractKeywords = (text: string): string[] => {
    // 提取书名（引号内容）
    const bookMatches = text.match(/[《"'](.*?)[》"']/g);
    const bookKeywords = bookMatches ? bookMatches.map(match => match.replace(/[《》"']/g, '')) : [];
    
    // 提取其他关键词（精简停用词列表）
    const stopWords = ['的', '了', '我', '在', '和', '与', '或', '也', '都', '很', '这', '那'];
    
    // 先按标点符号分句，再按空格分词
    const sentences = text.replace(/[，。！？；：]/g, '|').split('|');
    const allWords: string[] = [];
    
    for (const sentence of sentences) {
      const words = sentence.trim().split(/\s+/)
        .filter(word => word.length > 0 && !stopWords.includes(word));
      allWords.push(...words);
    }
    
    // 去重并保持顺序，不限制关键词数量
    const allKeywords = [...bookKeywords, ...allWords];
    const uniqueWords = allKeywords.filter((word, index) => allKeywords.indexOf(word) === index);
    return uniqueWords; // 返回所有提取到的关键词
  };

  const keywords = extractKeywords(questionLower);

  // 判断是否需要书架信息
  if (questionLower.includes('书架') || 
      questionLower.includes('书籍列表') || 
      questionLower.includes('读过的书') ||
      questionLower.includes('看过') ||
      questionLower.includes('有哪些书')) {
    toolCalls.push({
      name: "get_bookshelf",
      arguments: {}
    });
  }

  // 判断是否需要搜索特定书籍
  if (keywords.length > 0 && (
      /书.*?([《"].*?[》"]|叫.*?的|名.*?的)/.test(questionLower) ||
      questionLower.includes('推荐') ||
      questionLower.includes('找书')
    )) {
    // 为所有关键词都执行书籍搜索
    for (const keyword of keywords) {
      toolCalls.push({
        name: "search_books",
        arguments: { keyword }
      });
    }
  }

  // 判断是否需要搜索笔记 - 扩展更多哲理性关键词
  if (keywords.length > 0 && (
      questionLower.includes('笔记') ||
      questionLower.includes('划线') ||
      questionLower.includes('思考') ||
      questionLower.includes('感想') ||
      questionLower.includes('学到') ||
      questionLower.includes('启发') ||
      questionLower.includes('观点') ||
      questionLower.includes('理解') ||
      questionLower.includes('感悟') ||
      questionLower.includes('体会') ||
      questionLower.includes('领悟') ||
      questionLower.includes('心得') ||
      questionLower.includes('见解') ||
      questionLower.includes('智慧') ||
      questionLower.includes('道理') ||
      questionLower.includes('哲理') ||
      questionLower.includes('意义') ||
      questionLower.includes('价值') ||
      questionLower.includes('反思') ||
      questionLower.includes('什么') ||
      questionLower.includes('如何') ||
      questionLower.includes('为什么')
    )) {
    // 为所有关键词都执行笔记搜索
    for (const keyword of keywords) {
      toolCalls.push({
        name: "search_notes",
        arguments: { keyword }
      });
    }
  }

  // 如果没有特定需求，但有关键词，智能选择搜索策略
  if (toolCalls.length === 0 && keywords.length > 0) {
    // 为所有关键词都执行笔记搜索，提高命中率
    for (const keyword of keywords) {
      toolCalls.push({
        name: "search_notes",
        arguments: { keyword }
      });
    }
    
    // 同时搜索书籍
    for (const keyword of keywords) {
      toolCalls.push({
        name: "search_books",
        arguments: { keyword }
      });
    }
    
    // 总是获取书架作为备选
    toolCalls.push({
      name: "get_bookshelf",
      arguments: {}
    });
  }
  
  // 添加调试信息
  console.log('分析用户问题:', question);
  console.log('提取的关键词:', keywords);
  console.log('生成的工具调用:', toolCalls);

  return toolCalls;
}

// 格式化MCP结果为AI上下文
export function formatMCPResultsForAI(results: MCPResult[]): string {
  if (results.length === 0) {
    return '';
  }

  let context = '\n\n═══ 你的思想宝库中的智慧片段 ═══\n';
  
  for (const result of results) {
    const metadata = result.metadata;
    
        switch (metadata?.source) {
      case 'bookshelf':
        context += `\n◈ 你的阅读版图 (${metadata.count}本书的智慧积淀)\n`;
        const books = result.content.books; // 显示所有书籍
        context += books.map((book: any) => 
          `  ◦ 《${book.bookName}》 - ${book.bookAuthor || '佚名'} [${book.markCount || 0}条思考火花, ${book.noteCount || 0}篇心得感悟]`
        ).join('\n');
        break;
        
      case 'book_search':
        context += `\n◈ 与"${metadata.query}"相关的思想源泉 (${metadata.count}本)\n`;
        const searchBooks = result.content.books; // 显示所有搜索结果
        context += searchBooks.map((book: any) => 
          `  ◦ 《${book.bookName}》 - ${book.bookAuthor || '佚名'}`
        ).join('\n');
        break;
        
      case 'book_notes':
        context += `\n◈ 来自《${result.content.bookName}》的思考轨迹 (${metadata.count}条深度思考)\n\n`;
        const bookNotes = result.content.notes; // 显示所有笔记
        context += formatNotes(bookNotes);
        break;
        
      case 'note_search':
        context += `\n◈ 关于"${metadata.query}"的思想碎片 (${metadata.count}条相关思考)\n\n`;
        const searchNotes = result.content.notes; // 显示所有搜索到的笔记
        context += formatNotes(searchNotes);
        break;
    }
    
    context += '\n';
  }

  context += '\n\n请深度解读以上个人阅读资料，从中提炼智慧精华。连接不同思想间的深层关联，给出富有哲理的洞察。如果资料中确实没有相关内容，请直接说明"在你的阅读资料中没有找到相关内容"。\n';
  
  return context;
}

// 格式化笔记内容 - 突出哲理性和思考性
function formatNotes(notes: any[]): string {
  return notes.map((note: any, index: number) => {
    let noteText = `[思考片段 ${index + 1}]\n`;
    
    if (note.markText) {
      noteText += `原文摘录：「${note.markText}」\n`;
    }
    
    if (note.noteContent) {
      noteText += `个人思考：${note.noteContent}\n`;
    }
    
    noteText += `出处：《${note.bookName}》`;
    if (note.chapterName) {
      noteText += ` - ${note.chapterName}`;
    }
    
    // 添加创建时间
    if (note.createTime) {
      noteText += ` (${note.createTime})`;
    }
    
    return noteText;
  }).join('\n\n─────────────\n\n');
}

export const serverMCPClient = ServerMCPClient.getInstance(); 