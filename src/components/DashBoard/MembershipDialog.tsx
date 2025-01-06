import { X } from "lucide-react";

// Membership Dialog Component
const MembershipDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[90%] max-w-md rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-medium">开通会员</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                <div className="h-4 w-4 rounded bg-orange-500" />
              </div>
              <div>
                <h3 className="font-medium">每日回顾推送到邮箱</h3>
                <p className="text-sm text-gray-500">让回顾释放阅读的价值</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                <div className="h-4 w-4 rounded bg-orange-500" />
              </div>
              <div>
                <h3 className="font-medium">同步笔记不限数量</h3>
                <p className="text-sm text-gray-500">普通用户最大1000个</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline justify-center space-x-1 text-center">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-[#ff6b24]">¥9</span>
              <span className="text-gray-500">/月</span>
            </div>
            <span className="mx-2 text-gray-400">·</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-gray-400 line-through">¥99</span>
              <span className="text-2xl font-bold text-[#ff6b24]">¥68</span>
              <span className="text-gray-500">/年</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 text-center">
            <p>扫码付款，开通会员</p>
            <p className="text-sm text-gray-500">
              付款成功后，小助理会添加你为会员用户
            </p>
            <p className="text-sm text-gray-500">微信联系：77213305</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-gray-100">
              {/* Replace with actual QR code */}
              <div className="text-gray-400">QR Code</div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="space-y-1 text-center text-sm text-gray-500">
            <p>谢谢你的支持</p>
            <p>激励我们不断完善这一产品</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDialog;
