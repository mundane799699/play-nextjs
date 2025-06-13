"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchMemberInfo } from "@/services/user";
import { getSubscriptionByUserId, testSendEmail, saveSubscription } from "@/services/email";
import toast from "react-hot-toast";

const memberTypeMap: Record<string, string> = {
  FREE: "免费用户",
  PLUS: "Plus会员",
  PRO: "Pro会员",
};

const SettingsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // 个人资料相关状态
  const [memberInfo, setMemberInfo] = useState<any>({
    memberType: "",
    memberExpireTime: "",
  });

  // 统计数据相关状态
  const [books, setBooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // 邮箱回顾相关状态
  const [email, setEmail] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(0);
  const [isEmailLoading, setIsEmailLoading] = useState(true);

  const isPro = user?.memberType?.toUpperCase() === "PRO";
  const toggleDisabled = !isPro || isEmailLoading;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, router, loading]);

  // 获取个人资料信息
  useEffect(() => {
    if (user) {
      fetchMemberInfo().then((res: any) => {
        const { code, data, msg } = res;
        if (code === 200) {
          setMemberInfo(data);
        }
      });
    }
  }, [user]);

  // 获取统计数据
  useEffect(() => {
    if (user) {
      Promise.all([getBooks(), getNotes()]).finally(() => {
        setStatsLoading(false);
      });
    }
  }, [user]);

  const getBooks = async () => {
    try {
      const response = await fetch("/api/books", {
        method: "GET",
      });
      if (response.ok) {
        const { code, rows } = await response.json();
        if (code === 200) {
          setBooks(rows || []);
        }
      }
    } catch (error) {
      console.error("获取书籍失败:", error);
    }
  };

  const getNotes = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "GET",
      });
      if (response.ok) {
        const { code, data } = await response.json();
        if (code === 200) {
          setNotes(data || []);
        }
      }
    } catch (error) {
      console.error("获取笔记失败:", error);
    }
  };

  // 获取邮箱回顾设置
  useEffect(() => {
    if (user) {
      setIsEmailLoading(true);
      getSubscriptionByUserId().then((res: any) => {
        const { code, data } = res;
        if (code === 200) {
          const { email, sendTime, subscriptionStatus } = data;
          setEmail(email || "");
          setSelectedTime(sendTime || "");
          setSubscriptionStatus(isPro ? subscriptionStatus : 0);
        }
      }).finally(() => {
        setIsEmailLoading(false);
      });
    }
  }, [user, isPro]);

  const validateEmailFormat = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSaveEmailSettings = () => {
    if (!email) {
      toast.error("请先输入邮箱");
      return;
    }
    if (!validateEmailFormat(email)) {
      toast.error("邮箱格式不正确");
      return;
    }
    if (!selectedTime) {
      toast.error("请先选择发送时间");
      return;
    }
    
    saveSubscription({
      email,
      sendTime: selectedTime,
      subscriptionStatus,
    })
      .then((res: any) => {
        const { code } = res;
        if (code === 200) {
          toast.success("保存成功");
        } else {
          toast.error("保存失败");
        }
      });
  };

  const testSend = () => {
    if (!email) {
      toast.error("请先输入邮箱");
      return;
    }
    if (!validateEmailFormat(email)) {
      toast.error("邮箱格式不正确");
      return;
    }

    testSendEmail(email).then((res: any) => {
      const { code } = res;
      if (code === 200) {
        toast.success("发送成功");
      }
    });
  };

  // 计算统计数据
  const calculateStats = () => {
    const totalBooks = books.length;
    
    // 计算划线总数（从书籍数据中的markCount字段）
    let totalHighlights = 0;
    books.forEach((book: any) => {
      totalHighlights += book.markCount || 0;
    });
    
    // 计算想法总数（从笔记数据）
    const totalThoughts = notes.length;

    return {
      totalBooks,
      totalHighlights,
      totalThoughts,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf6f2] p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* 个人资料部分 */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">个人资料</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">昵称</span>
              <span className="text-gray-900 font-medium">{user.nickName}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">邮箱</span>
              <span className="text-gray-900 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">会员等级</span>
              <span className="text-gray-900 font-medium">
                {memberTypeMap[memberInfo.memberType] || "免费用户"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">增值服务到期时间</span>
              <span className="text-gray-900 font-medium">
                {memberInfo.memberExpireTime || "未开通"}
              </span>
            </div>
          </div>
        </div>

        {/* 统计模块 */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">数据统计</h2>
          
          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray-600">书籍：</span>
                <span className="font-semibold text-gray-900">{stats.totalBooks}本</span>
                <span className="text-gray-600">划线：</span>
                <span className="font-semibold text-gray-900">{stats.totalHighlights}个</span>
                <span className="text-gray-600">想法：</span>
                <span className="font-semibold text-gray-900">{stats.totalThoughts}个</span>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  用
                  <a 
                    href="https://chromewebstore.google.com/detail/readecho-%E5%90%8C%E6%AD%A5%E4%BD%A0%E7%9A%84%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0/ibinnfpnfbcfdblmjpmjjmffcjlcadig"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium mx-1"
                  >
                    Readecho插件
                  </a>
                  同步更多
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 邮箱回顾设置部分 */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">邮箱回顾设置</h2>
          
          <div className="space-y-6">
            {/* 开关状态 */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">开关状态</span>
                {!isPro && (
                  <p className="text-xs text-gray-500 mt-1">
                    需要Pro会员才能开启邮箱回顾功能
                  </p>
                )}
              </div>
              {isEmailLoading ? (
                <div className="text-sm text-gray-500">正在加载...</div>
              ) : (
                <button
                  onClick={() => {
                    if (!toggleDisabled) {
                      setSubscriptionStatus(subscriptionStatus === 1 ? 0 : 1);
                    }
                  }}
                  disabled={toggleDisabled}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${subscriptionStatus === 1 ? "bg-primary" : "bg-gray-200"}
                    ${toggleDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    transition-colors duration-200 ease-in-out focus:outline-none
                  `}
                  title={isPro ? "点击切换订阅状态" : "需要Pro会员才能开启"}
                >
                  <span
                    className={`
                      ${subscriptionStatus === 1 ? "translate-x-6" : "translate-x-1"}
                      inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
                    `}
                  />
                </button>
              )}
            </div>

            {!isPro && (
              <div className="rounded-lg bg-orange-50 p-4">
                <p className="text-sm text-orange-800">
                  <a 
                    href="https://readecho.cn/vip" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    开通Pro版
                  </a>
                  ，每日收到一封读过的书籍笔记，让回顾释放阅读的价值
                </p>
              </div>
            )}

            {/* 邮箱设置 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">邮箱地址</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* 发送时间 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">发送时间</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={testSend}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200"
              >
                试发一封
              </button>
              <button
                onClick={handleSaveEmailSettings}
                className="rounded-md bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary/90"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 