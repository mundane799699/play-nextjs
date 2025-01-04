import axios from "./ajax";

export async function notesService(
  bookId: string,
  bookName: string,
  token: any,
): Promise<any> {
  // 本地开发环境模拟数据
  if (process.env.NODE_ENV === 'development') {
    return {
      code: 200,
      total: 125, // 所有笔记的总数
      rows: [
        {
          reviewId: '1',
          bookName: '深入理解计算机系统',
          chapterName: '第一章 计算机系统漫游',
          noteContent: '程序员必读的经典著作，本章从一个hello程序开始，解释了从源代码到可执行文件的整个过程。',
          markText: '计算机系统是由硬件和系统软件组成的。',
          noteTime: Date.now() - 2 * 24 * 60 * 60 * 1000
        },
        {
          reviewId: '2',
          bookName: '深入理解计算机系统',
          chapterName: '第二章 信息的表示和处理',
          noteContent: '本章介绍了计算机如何表示数字、字符等不同类型的数据。',
          markText: '在几乎所有的计算机中，字节都是最小的可寻址的内存单位。',
          noteTime: Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      ],
      bookName: bookName || '全部笔记'
    };
  }

  return await axios.get(`/wxread/notes/noteslist`, {
    params: {
      bookId,
      bookName,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function exportNotesService(bookId: string) {
  // 本地开发环境模拟导出功能
  if (process.env.NODE_ENV === 'development') {
    // 创建一个简单的CSV内容作为Excel文件的替代
    const mockContent = `书名,章节,标记内容,笔记内容,时间
测试书籍1,第一章,这是标记的文本内容,这是一条测试笔记内容，用于本地开发时查看UI效果。,${new Date().toLocaleString()}
测试书籍1,第二章,这是另一段标记的文本,第二条测试笔记内容，包含更多的文字来测试UI的展示效果。这条笔记稍微长一些，可以测试长文本的显示效果。,${new Date().toLocaleString()}`;
    
    const blob = new Blob([mockContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "测试书籍1_笔记.csv");
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  try {
    const response = await axios({
      method: "POST",
      url: "/wxread/notes/download",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        bookId,
      },
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    let filename = "file.xlsx";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.*)/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ""));
      }
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("下载文件时发生错误:", error);
  }
}

export async function exportNotesMdService(bookId: string) {
  // 本地开发环境模拟导出功能
  if (process.env.NODE_ENV === 'development') {
    const mockContent = `# 测试书籍1

## 第一章
> 这是标记的文本内容

这是一条测试笔记内容，用于本地开发时查看UI效果。

## 第二章
> 这是另一段标记的文本

第二条测试笔记内容，包含更多的文字来测试UI的展示效果。这条笔记稍微长一些，可以测试长文本的显示效果。
`;
    const blob = new Blob([mockContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "测试书籍1_笔记.md");
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  try {
    const response = await axios({
      method: "POST",
      url: "/wxread/notes/downloadMd",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        bookId,
      },
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    let filename = "file.md";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.*)/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ""));
      }
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("下载文件时发生错误:", error);
  }
}

export async function getRandomReview(): Promise<any> {
  // 本地开发环境模拟数据
  if (process.env.NODE_ENV === 'development') {
    // 模拟数据库中的笔记总数
    const totalCount = 5;
    // 模拟已经回顾的笔记数
    const readCount = 2;
    
    return {
      code: 200,
      data: {
        readCount,
        totalCount,
        allFinished: false,
        note: {
          reviewId: Math.random().toString(36).substring(7),
          bookName: '深入理解计算机系统',
          chapterName: '第一章 计算机系统漫游',
          noteContent: '程序员必读的经典著作，本章从一个hello程序开始，解释了从源代码到可执行文件的整个过程，包括编译、链接等步骤。这种自顶向下的讲解方式非常适合初学者理解计算机系统的基本概念。',
          markText: '计算机系统是由硬件和系统软件组成的，它们共同工作来运行应用程序。',
          noteTime: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 // 随机1-30天内的时间
        }
      },
      msg: 'success'
    };
  }

  return await axios.get("/wxread/notes/getRandomReview");
}
