export interface Note {
  reviewId: string;
  bookName: string;
  bookAuthor?: string;
  chapterName?: string;
  noteContent: string;
  markText: string;
  noteTime: number;
  bookId: string;
}
