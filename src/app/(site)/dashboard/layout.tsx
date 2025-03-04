import TabComponent from "@/components/DashBoard/TabComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的笔记",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf6f2] pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
      <div className="container">
        <TabComponent />
        {children}
      </div>
    </div>
  );
}
