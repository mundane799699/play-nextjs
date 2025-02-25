"use client";

import { use, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/services/order";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: "MONTHLY" | "YEARLY";
}

export default function PaymentModal({
  isOpen,
  onClose,
  planType,
}: PaymentModalProps) {
  const { user, logout } = useAuth();
  const [wechatId, setWechatId] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price = planType === "MONTHLY" ? 9.9 : 68;

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!user) {
      toast.error("请先登录", {
        duration: 1000,
      });
      return;
    }
    if (!wechatId.trim()) {
      toast.error("请填写微信号", {
        duration: 1000,
      });
      return;
    }
    if (!email.trim()) {
      toast.error("请填写账号邮箱", {
        duration: 1000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrder({
        wechatId,
        email,
        planType,
        amount: price,
      });
      const { code, msg } = res;
      if (code === 200) {
        toast.success("提交成功，请等待小助理核对");
        onClose();
      } else {
        toast.error(msg, {
          duration: 1000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-16 sm:w-full sm:max-w-md sm:p-6 sm:align-middle">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">关闭</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-center text-xl font-medium text-gray-900">
                Readecho {planType === "MONTHLY" ? "月会员" : "年会员"}
              </h3>

              <div className="mt-6 flex flex-col items-center">
                <div className="relative h-48 w-48">
                  <Image
                    src={
                      planType === "MONTHLY"
                        ? "/images/vip/monthprice.png"
                        : "/images/vip/yearprice.png"
                    }
                    alt="支付二维码"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 text-gray-600">微信扫码，支付 {price}¥</p>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm text-gray-500">
                  <span className="text-red-500">*</span>
                  扫码成功后，请填写微信号，小助理核对后将为您开通权益
                </label>
                <div className="mb-2">
                  <label className="mb-1 block text-sm text-gray-700">
                    微信号：
                  </label>
                  <input
                    type="text"
                    value={wechatId}
                    onChange={(e) => setWechatId(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2"
                    placeholder="请输入您的微信号"
                  />
                </div>
                <div className="mb-2">
                  <label className="mb-1 block text-sm text-gray-700">
                    邮箱：
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2"
                    placeholder="请输入您的账号邮箱"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:col-start-2 sm:text-sm"
              style={{ backgroundColor: "rgb(238, 122, 102)" }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              提交
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:col-start-1 sm:mt-0 sm:text-sm"
              onClick={onClose}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
