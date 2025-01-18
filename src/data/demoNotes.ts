import { Note } from "@/types/note";

const baseTime = new Date('2025-01-01').getTime() / 1000;

export const demoNotes: Note[] = [
  {
    reviewId: "demo1",
    bookName: "人生的智慧",
    bookAuthor: "叔本华",
    chapterName: "幸福人生的智慧",
    noteContent: "读到这里我陷入了深深的思考，看看周围那些富有的人，他们真的快乐吗？也许幸福的秘诀就是学会知足，放下无尽的欲望。",
    markText: "一个人的幸福不在于他拥有什么，而在于他如何看待所拥有的。",
    noteTime: baseTime,
    bookId: "demo_book_1"
  },
  {
    reviewId: "demo2",
    bookName: "活法",
    bookAuthor: "稻盛和夫",
    chapterName: "付出不亚于任何人的努力",
    noteContent: "写下这句话时眼眶湿润了，多少次我因为没有立刻看到成果就放弃，却忘了努力本身就是一种成长。今天的我终于明白了这个道理。",
    markText: "不要回避困难，不要害怕失败，人生的意义在于全力以赴。",
    noteTime: baseTime,
    bookId: "demo_book_2"
  },
  {
    reviewId: "demo3",
    bookName: "被讨厌的勇气",
    bookAuthor: "岸见一郎",
    chapterName: "人际关系的课题分离",
    noteContent: "这个观点太醍醐灌顶了！原来我一直在为别人的事情徒增烦恼，试图掌控他人的想法。从今天起，我要学会专注于自己的人生课题。",
    markText: "你所烦恼的事情，十之八九都是别人的课题。",
    noteTime: baseTime,
    bookId: "demo_book_3"
  },
  {
    reviewId: "demo4",
    bookName: "富爸爸穷爸爸",
    bookAuthor: "罗伯特·清崎",
    chapterName: "金钱观念",
    noteContent: "看到这句话时我恍然大悟，原来我一直在用错误的方式对待金钱。与其抱怨工资太低，不如思考如何让资产为我工作。",
    markText: "穷人为钱工作，富人让钱为他工作。",
    noteTime: baseTime,
    bookId: "demo_book_4"
  },
  {
    reviewId: "demo5",
    bookName: "非暴力沟通",
    bookAuthor: "马歇尔·卢森堡",
    chapterName: "观察而不评判",
    noteContent: "想起最近和家人的争执，我总是急于下判断，导致对话变成了互相指责。原来倾听和理解才是沟通的开始。",
    markText: "暴力来自于人们以为他们'应该'是什么样子的评判。",
    noteTime: baseTime,
    bookId: "demo_book_5"
  },
  {
    reviewId: "demo6",
    bookName: "认知觉醒",
    bookAuthor: "周宇",
    chapterName: "觉醒篇 · 大脑的神奇法则",
    noteContent: "看到这句话时我热泪盈眶，那些日复一日的坚持，那些不被理解的固执，原来都是在为未来的自己铺路。",
    markText: "成长就是要脱离舒适区，进入成长区。",
    noteTime: baseTime,
    bookId: "demo_book_6"
  },
  {
    reviewId: "demo7",
    bookName: "当下的力量",
    bookAuthor: "埃克哈特·托利",
    chapterName: "当下",
    noteContent: "读到这里我突然意识到自己总是活在过去的遗憾或未来的焦虑中。原来真正的幸福就在当下，在此时此刻的呼吸与感受中。",
    markText: "生命中真正重要的东西，都是当下发生的。",
    noteTime: baseTime,
    bookId: "demo_book_7"
  },
  {
    reviewId: "demo8",
    bookName: "原则",
    bookAuthor: "瑞·达利欧",
    chapterName: "生活原则",
    noteContent: "这个公式太精辟了！回想过去的低谷，正是那些痛苦的经历让我获得了最大的成长。原来挫折不是敌人，而是生命赠予的礼物。",
    markText: "拥抱现实，应对现实，是一切进步的起点。",
    noteTime: baseTime,
    bookId: "demo_book_8"
  },
  {
    reviewId: "demo9",
    bookName: "把时间当作朋友",
    bookAuthor: "李笑来",
    chapterName: "开启自己的心智",
    noteContent: "在这个浮躁的时代，我总是急于求成，却忽视了沉淀的重要性。这句话让我明白，真正的成长需要时间的积累。",
    markText: "任何领域的真正成功，都是时间的函数。",
    noteTime: baseTime,
    bookId: "demo_book_9"
  },
  {
    reviewId: "demo10",
    bookName: "微习惯",
    bookAuthor: "斯蒂芬·盖斯",
    chapterName: "微习惯的力量",
    noteContent: "读到这里我感慨万分，多少次我都在等待完美的时机开始改变。现在我懂了，与其等待，不如从一个微小的习惯开始。",
    markText: "伟大的改变，始于微小的坚持。",
    noteTime: baseTime,
    bookId: "demo_book_10"
  }
];
