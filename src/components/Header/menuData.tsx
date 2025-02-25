import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "首页",
    path: "/",
    newTab: false,
    needLogin: false,
  },
  {
    id: 2,
    title: "笔记",
    path: "/dashboard",
    newTab: false,
    needLogin: true,
  },
  {
    id: 3,
    title: "回顾",
    path: "/review",
    newTab: true,
    needLogin: true,
  },
  {
    id: 4,
    title: "Pro版",
    path: "/vip",
    newTab: false,
    needLogin: false,
  },
];

export default menuData;
