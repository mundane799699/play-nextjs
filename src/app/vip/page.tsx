"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BsCheckCircle } from "react-icons/bs";
import PaymentModal from "@/components/PaymentModal";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { fetchMemberInfo } from "@/services/user";

export default function VIPPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"PLUS" | "PRO">("PLUS");
  const { theme } = useTheme();
  const { user } = useAuth();
  const [userMemberType, setUserMemberType] = useState<string>("");

  useEffect(() => {
    // 获取用户会员信息
    if (user) {
      fetchMemberInfo().then((res: any) => {
        const { code, data } = res;
        if (code === 200) {
          setUserMemberType(data.memberType || "FREE");
        }
      }).catch(() => {
        // 如果获取失败，使用用户基本信息中的memberType
        setUserMemberType(user.memberType || "FREE");
      });
    } else {
      setUserMemberType("FREE");
    }
  }, [user]);

  const handleOpenModal = (planType: "PLUS" | "PRO") => {
    setSelectedPlan(planType);
    setIsModalOpen(true);
  };

  // 获取主题相关颜色
  const primaryColor = "#d97b53"; // 从tailwind.config.ts中获取的主题色

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 mt-24 text-center">
          <h2 className="text-4xl font-bold dark:text-white">
            <span className="text-primary">升级套餐</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            选择最适合您的套餐
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Free 套餐 */}
          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Free</h3>
              <div className="mt-4 flex items-end">
                <span className="align-top text-3xl font-bold">¥</span>
                <span className="text-5xl font-bold">0</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                免费使用
              </p>
            </div>

            <div className="mb-8">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                基础笔记同步功能
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <BsCheckCircle className="mr-2 mt-1 text-primary" />
                  <span className="text-sm">同步最多200条笔记</span>
                </li>
                <li className="flex items-start">
                  <BsCheckCircle className="mr-2 mt-1 text-primary" />
                  <span className="text-sm">笔记查看与导出</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto">
              {userMemberType === "FREE" ? (
                <button
                  disabled
                  className="w-full rounded-lg bg-white border border-gray-200 px-4 py-3 text-sm font-medium text-dark transition-colors"
                >
                  您当前的套餐
                </button>
              ) : null}
            </div>
          </div>

          {/* Plus 套餐 */}
          <div className="flex flex-col rounded-lg border border-primary bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800">
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Plus</h3>
              <div className="mt-4 flex items-end">
                <span className="align-top text-3xl font-bold">¥</span>
                <span className="text-5xl font-bold">49</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                永久同步
              </p>
            </div>

            <div className="mb-8">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                无限量笔记同步
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <BsCheckCircle className="mr-2 mt-1 text-primary" />
                  <span className="text-sm">无限量笔记同步与保存</span>
                </li>
                <li className="flex items-start">
                  <BsCheckCircle className="mr-2 mt-1 text-primary" />
                  <span className="text-sm">
                    多种导出格式支持(Markdown, excel)
                  </span>
                </li>
                <li className="flex items-start">
                  <BsCheckCircle className="mr-2 mt-1 text-primary" />
                  <span className="text-sm">可随时补差价升级为Pro版</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto">
              {userMemberType === "PLUS" ? (
                <div>
                  <button
                    disabled
                    className="w-full rounded-lg bg-white border border-gray-200 px-4 py-3 text-sm font-medium text-dark transition-colors"
                  >
                    您当前的套餐
                  </button>
                  <Link 
                    href="https://v3oxu28gnc.feishu.cn/docx/EQvqdMm3WoqlBjxT7ASc3u0wnKf"
                    className="mt-2 block text-xs text-center text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    联系我们补差价升级为Pro版
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenModal("PLUS")}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
                >
                  获取 Plus
                </button>
              )}
            </div>
          </div>

          {/* Pro 套餐 */}
          <div className="relative flex flex-col rounded-lg border-2 border-primary bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800">
            <div className="absolute -top-3 right-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              推荐
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Pro</h3>
              <div className="mt-4 flex items-end">
                <span className="align-top text-3xl font-bold">¥</span>
                <span className="text-5xl font-bold">99</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                永久同步+一年增值服务
              </p>
            </div>

            <div className="mb-8">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                尽先体验所有高级功能
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <BsCheckCircle className="mr-2 mt-1 text-primary" />
                  <span className="text-sm">包含Plus全部功能（永久使用）</span>
                </li>
                <li className="flex items-start">
                  <BsCheckCircle className="mr-2 mt-1 text-primary" />
                  <span className="text-sm">
                    自定义笔记邮件回顾（一年使用）
                  </span>
                </li>
                <li className="flex items-start">
                  <BsCheckCircle className="mr-2 mt-1 text-primary" />
                  <span className="text-sm">优先获取新功能</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto">
              {userMemberType === "PRO" ? (
                <button
                  disabled
                  className="w-full rounded-lg bg-white border border-gray-200 px-4 py-3 text-sm font-bold text-dark transition-colors"
                >
                  您当前的套餐
                </button>
              ) : (
                <button
                  onClick={() => handleOpenModal("PRO")}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
                >
                  获取 Pro
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="https://v3oxu28gnc.feishu.cn/docx/EQvqdMm3WoqlBjxT7ASc3u0wnKf"
            className="text-primary transition-opacity duration-300 hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
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
