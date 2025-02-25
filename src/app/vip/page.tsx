"use client";

import { BsBookHalf, BsDownload, BsEnvelopeAt } from "react-icons/bs";
import { AiOutlineRobot, AiOutlineTag } from "react-icons/ai";
import { BiSync } from "react-icons/bi";
import Link from "next/link";
import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";

const features = [
  {
    title: "同步微信读书笔记",
    description: "不限制微信读书笔记的数量同步",
    icon: <BsBookHalf className="h-8 w-8" />,
  },
  {
    title: "导出笔记到本地",
    description: "不限制笔记的导出",
    icon: <BsDownload className="h-8 w-8" />,
  },
  {
    title: "每日邮件回顾",
    description: "每天收到一封过去笔记的汇总",
    icon: <BsEnvelopeAt className="h-8 w-8" />,
  },
  {
    title: "AI总结和推荐",
    description: "智能挖掘笔记，相关书籍推荐",
    icon: <AiOutlineRobot className="h-8 w-8" />,
  },
  {
    title: "新标签页回顾",
    description: "沉浸式回顾所有笔记",
    icon: <AiOutlineTag className="h-8 w-8" />,
  },
  {
    title: "更多功能，敬请期待",
    description: "同步到第三方笔记；导入笔记；修改笔记等",
    icon: <BiSync className="h-8 w-8" />,
  },
];

export default function VIPPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"MONTHLY" | "YEARLY">(
    "MONTHLY",
  );

  const handleOpenModal = (planType: "MONTHLY" | "YEARLY") => {
    setSelectedPlan(planType);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold">
            <span className="text-[#EE7A66]">订阅 Readecho Pro</span>
          </h2>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-[#EE7A66]">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-12 flex flex-col justify-center gap-6 sm:flex-row">
          <button
            className="min-w-[160px] rounded-lg border-2 border-[#EE7A66] px-10 py-3 text-base text-[#EE7A66] transition-colors duration-300 hover:opacity-80"
            onClick={() => handleOpenModal("MONTHLY")}
          >
            月会员 9.9¥/月
          </button>
          <button
            className="relative flex min-w-[200px] flex-col items-center rounded-lg bg-[#EE7A66] px-10 py-3 text-base text-white transition-colors duration-300 hover:opacity-80"
            onClick={() => handleOpenModal("YEARLY")}
          >
            <span className="mb-1">年会员 68¥/年</span>
            <span className="text-xs opacity-90">立省 43%</span>
          </button>
        </div>

        <div className="mb-4 text-center text-sm">
          <Link
            href="mailto:contact@example.com"
            className="text-[#EE7A66] transition-opacity duration-300 hover:opacity-80"
          >
            联系我们，添加你想要的功能
          </Link>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planType={selectedPlan}
      />
    </div>
  );
}
