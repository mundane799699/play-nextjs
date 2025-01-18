'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'month' | 'year';
}

export default function PaymentModal({ isOpen, onClose, planType }: PaymentModalProps) {
  const [wechatId, setWechatId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price = planType === 'month' ? '9.9' : '68';

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!wechatId.trim()) {
      alert('请填写微信号');
      return;
    }

    setIsSubmitting(true);
    try {
      // 暂时只显示提交成功
      setTimeout(() => {
        alert('提交成功');
        onClose();
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      alert('提交失败，请重试');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-20 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-16 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">关闭</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-xl font-medium text-gray-900 text-center">
                Readecho {planType === 'month' ? '月会员' : '年会员'}
              </h3>
              
              <div className="mt-6 flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <Image
                    src={planType === 'month' ? '/images/vip/monthprice.png' : '/images/vip/yearprice.png'}
                    alt="支付二维码"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 text-gray-600">
                  微信扫码，支付 {price}¥
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-500 mb-2">
                  <span className="text-red-500">*</span>
                  扫码成功后，请填写微信号，小助理将为您开通权益
                </label>
                <input
                  type="text"
                  value={wechatId}
                  onChange={(e) => setWechatId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="请输入您的微信号"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:col-start-2 sm:text-sm"
              style={{ backgroundColor: 'rgb(238, 122, 102)' }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '我已付款'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm"
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
