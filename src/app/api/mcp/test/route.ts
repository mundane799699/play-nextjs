import { NextRequest, NextResponse } from "next/server";
import { serverMCPClient } from "@/lib/mcpClient";

export async function GET(request: NextRequest) {
  const testType = request.nextUrl.searchParams.get("type") || "tools";
  
  try {
    let result;
    const token = request.headers.get("Authorization")?.replace("Bearer ", "") || "";
    
    switch (testType) {
      case "tools":
        result = serverMCPClient.getAvailableTools();
        break;
      case "bookshelf":
        result = await serverMCPClient.executeTool({ name: "get_bookshelf", arguments: {} }, token);
        break;
      case "search_books":
        const bookKeyword = request.nextUrl.searchParams.get("keyword") || "测试";
        result = await serverMCPClient.executeTool({ 
          name: "search_books", 
          arguments: { keyword: bookKeyword } 
        }, token);
        break;
      case "search_notes":
        const noteKeyword = request.nextUrl.searchParams.get("keyword") || "测试";
        result = await serverMCPClient.executeTool({ 
          name: "search_notes", 
          arguments: { keyword: noteKeyword } 
        }, token);
        break;
      default:
        throw new Error(`不支持的测试类型: ${testType}`);
    }

    return NextResponse.json({
      success: true,
      testType,
      result
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      testType,
      error: error.message
    }, { status: 500 });
  }
} 