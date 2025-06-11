'use client';

import React from 'react';
import Link from 'next/link';

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberType: string;
  usedCount: number;
  dailyLimit: number;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  isOpen,
  onClose,
  memberType,
  usedCount,
  dailyLimit
}) => {
  if (!isOpen) return null;

  const memberTypeText = memberType === 'PLUS' ? 'Plus用户' : '免费用户';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-in fade-in duration-200">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            AI问书次数已用完
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="mb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-orange-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-orange-800">
                  今日AI问书次数已达上限
                </h4>
                <p className="text-sm text-orange-700 mt-1">
                  您今天已使用 {usedCount}/{dailyLimit} 次AI问书功能
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p>作为 <span className="font-medium text-gray-800">{memberTypeText}</span>，您每天可以使用 {dailyLimit} 次AI问书功能。</p>
            <p className="mt-2">明天您的使用次数将重置为 {dailyLimit} 次。</p>
          </div>

          {/* Pro版本特权介绍 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  ⭐ 升级至Pro版，享受无限制AI问书
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✨ 无限次数AI问书对话</li>
                  <li>📚 深度挖掘个人阅读智慧</li>
                  <li>🧠 专属的阅读思辨助手</li>
                  <li>🚀 更强大的笔记洞察功能</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            明天再来
          </button>
          <Link
            href="/vip"
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 text-center"
          >
            立即升级Pro版
          </Link>
        </div>

        {/* 底部说明 */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Pro版本支持无限次AI问书，让您的阅读智慧无限延伸
        </div>
      </div>
    </div>
  );
};

export default UpgradeDialog; 