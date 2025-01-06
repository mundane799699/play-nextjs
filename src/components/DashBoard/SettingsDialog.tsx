import { X } from "lucide-react";
import MembershipDialog from "./MembershipDialog";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
  const [showMembership, setShowMembership] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  if (!isOpen) return null;

  const reviewOptions = [
    { value: "5", label: "5条/天" },
    { value: "10", label: "10条/天" },
    { value: "20", label: "20条/天" },
  ];

  const handleSave = () => {
    // TODO: Save settings
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-[90%] max-w-md rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-medium">邮箱回顾（开发中）</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Review Range */}
            <div className="space-y-2">
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
            </div>

            {/* Review Count */}
            <div className="space-y-2">
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
            </div>

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

            {/* Pro Button */}
            <button
              onClick={() => setShowMembership(true)}
              className="w-full rounded-md bg-[#ff6b24] py-3 font-medium text-white transition hover:bg-[#ff6b24]/90"
            >
              8￥开通会员立享邮箱回顾
            </button>

            {/* Description */}
            <p className="text-center text-sm text-gray-500">
              因为邮箱发送需要服务器成本，故收取成本费用，后续为会员用户提供更多服务，感谢支持
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 border-t p-4">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 text-gray-600 transition hover:bg-gray-100"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-[#14161a] px-4 py-2 text-white transition hover:bg-[#14161a]/90"
            >
              保存
            </button>
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
