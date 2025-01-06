export interface Note {
  reviewId: string;
  bookName: string;
  chapterName?: string;
  noteContent: string;
  markText: string;
  noteTime: number;
}