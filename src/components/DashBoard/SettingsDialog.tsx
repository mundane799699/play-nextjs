import { X } from "lucide-react";
import MembershipDialog from "./MembershipDialog";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSubscriptionByUserId, testSendEmail } from "@/services/email";
import { EmailSubscription } from "@/types/emailSubscription";
import { saveSubscription } from "@/services/email";
import toast from "react-hot-toast";
import Link from "next/link";

// Settings Dialog Component
const SettingsDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState("全部笔记");
  const [reviewCount, setReviewCount] = useState("5");
  const [email, setEmail] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showMembership, setShowMembership] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // memberType 可能是字符串 "Pro"，也可能是大小写不同或其他格式 
  const isPro = user?.memberType?.toUpperCase() === "PRO";
  const toggleDisabled = !isPro || isLoading;

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      console.log("Current user:", user);
      console.log("Is Pro:", isPro);
      console.log("Member type:", user?.memberType);
      
    getSubscriptionByUserId().then((res: any) => {
      const { code, data } = res;
      if (code === 200) {
        const { email, sendTime, subscriptionStatus } = data;
        setEmail(email);
        setSelectedTime(sendTime);
          // 只有Pro用户才能开启订阅
          setSubscriptionStatus(isPro ? subscriptionStatus : 0);
      }
      }).finally(() => {
        setIsLoading(false);
    });
    }
  }, [isOpen, isPro, user]);

  if (!isOpen) return null;

  const reviewOptions = [
    { value: "5", label: "5条/天" },
    { value: "10", label: "10条/天" },
    { value: "20", label: "20条/天" },
  ];

  const validateEmailFormat = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSave = () => {
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
      })
      .finally(() => {
        onClose();
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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-[90%] max-w-md rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
            <h2 className="text-lg font-medium">邮箱回顾</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Subscription Status */}
            <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">开关状态</span>
                {isLoading ? (
                  <div className="text-sm text-gray-500">正在加载...</div>
                ) : (
              <button
                onClick={() => {
                      if (!toggleDisabled) {
                  setSubscriptionStatus(subscriptionStatus === 1 ? 0 : 1);
                        console.log("切换订阅状态为:", subscriptionStatus === 1 ? 0 : 1);
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
                <span className="sr-only">
                  {subscriptionStatus === 1 ? "取消订阅" : "开启订阅"}
                </span>
              </button>
                )}
              </div>
              
              {toggleDisabled && !isLoading && !isPro && (
                <a 
                  href="https://readecho.cn/vip" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-[#d97b53] hover:underline"
                >
                  开通Pro版，每日收到一封读过的书籍笔记
                </a>
              )}
              {isPro && !isLoading && (
                <p className="text-xs text-gray-500">
                  Pro用户专享功能，可自由开启或关闭邮箱回顾
                </p>
              )}
            </div>

            {/* Review Range */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium">回顾范围</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2"
              >
                <option value="全部笔记">全部笔记</option>
                <option value="少有人走的路">少有人走的路</option>
                <option value="认知觉醒">认知觉醒</option>
              </select>
            </div> */}

            {/* Review Count */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium">回顾数量</label>
              <select
                value={reviewCount}
                onChange={(e) => setReviewCount(e.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2"
              >
                {reviewOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Email Settings */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">发送时间</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* Pro Button */}
            {/* <button
              onClick={() => setShowMembership(true)}
              className="w-full rounded-md bg-[#ff6b24] py-3 font-medium text-white transition hover:bg-[#ff6b24]/90"
            >
              8￥开通会员立享邮箱回顾
            </button> */}

            {/* Description */}
            {/* <p className="text-center text-sm text-gray-500">
              因为邮箱发送需要服务器成本，故收取成本费用，后续为会员用户提供更多服务，感谢支持
            </p> */}
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t p-4">
            <button
              onClick={testSend}
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
            >
              试发一封
            </button>
            
            <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 text-gray-600 transition hover:bg-gray-100"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-primary/90"
            >
              保存
            </button>
            </div>
          </div>
        </div>
      </div>

      <MembershipDialog
        isOpen={showMembership}
        onClose={() => setShowMembership(false)}
      />
    </>
  );
};

export default SettingsDialog;
