import { NextRequest, NextResponse } from "next/server";

const mockBooks = {
  code: 200,
  rows: [
    {
      bookId: "mock-1",
      bookName: "深入理解 TypeScript",
      author: "张三",
      cover: "https://picsum.photos/200/300",
      progress: 35,
      noteCount: 12,
      lastReadTime: Date.now() - 24 * 60 * 60 * 1000, // 昨天
    },
    {
      bookId: "mock-2",
      bookName: "React 设计模式与最佳实践",
      author: "李四",
      cover: "https://picsum.photos/200/300",
      progress: 68,
      noteCount: 25,
      lastReadTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // 前天
    },
    {
      bookId: "mock-3",
      bookName: "Next.js 实战指南",
      author: "王五",
      cover: "https://picsum.photos/200/300",
      progress: 92,
      noteCount: 45,
      lastReadTime: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5天前
    }
  ]
};

export async function GET(request: NextRequest) {
  return NextResponse.json(mockBooks);
}
