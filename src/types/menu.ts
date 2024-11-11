export type Menu = {
  id: number;
  title: string;
  path?: string;
  path2?: string;
  newTab: boolean;
  submenu?: Menu[];
};
