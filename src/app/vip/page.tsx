'use client';

import { BsBookHalf, BsDownload, BsEnvelopeAt } from 'react-icons/bs';
import { AiOutlineRobot, AiOutlineTag } from 'react-icons/ai';
import { BiSync } from 'react-icons/bi';
import Link from 'next/link';
import { useState } from 'react';
import PaymentModal from '@/components/PaymentModal';

const features = [
  {
    title: '同步微信读书笔记',
    description: '不限制微信读书笔记的数量同步',
    icon: <BsBookHalf className="w-8 h-8" />,
  },
  {
    title: '导出笔记到本地',
    description: '不限制笔记的导出',
    icon: <BsDownload className="w-8 h-8" />,
  },
  {
    title: '每日邮件回顾',
    description: '每天收到一封过去笔记的汇总',
    icon: <BsEnvelopeAt className="w-8 h-8" />,
  },
  {
    title: 'AI总结和推荐',
    description: '智能挖掘笔记，相关书籍推荐',
    icon: <AiOutlineRobot className="w-8 h-8" />,
  },
  {
    title: '新标签页回顾',
    description: '沉浸式回顾所有笔记',
    icon: <AiOutlineTag className="w-8 h-8" />,
  },
  {
    title: '更多功能，敬请期待',
    description: '同步到第三方笔记；导入笔记；修改笔记等',
    icon: <BiSync className="w-8 h-8" />,
  },
];

export default function VIPPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'month' | 'year'>('month');

  const handleOpenModal = (planType: 'month' | 'year') => {
    setSelectedPlan(planType);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'rgb(249, 246, 242)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm">
            <span style={{ color: 'rgb(238, 122, 102)' }} className="font-medium"> 订阅 Readecho Pro</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0" style={{ color: 'rgb(238, 122, 102)' }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
          <button 
            className="px-10 py-3 rounded-lg text-base border-2 transition-colors duration-300 hover:opacity-80"
            style={{ 
              color: 'rgb(238, 122, 102)',
              borderColor: 'rgb(238, 122, 102)',
              minWidth: '160px'
            }}
            onClick={() => handleOpenModal('month')}
          >
            月会员 9.9¥/月
          </button>
          <button
            className="relative px-10 py-3 rounded-lg text-white text-base transition-colors duration-300 hover:opacity-80 flex flex-col items-center"
            style={{ 
              backgroundColor: 'rgb(238, 122, 102)',
              minWidth: '200px'
            }}
            onClick={() => handleOpenModal('year')}
          >
            <span className="mb-1">年会员 68¥/年</span>
            <span className="text-xs opacity-90">立省 43%</span>
          </button>
        </div>

        <div className="text-center text-sm mb-4">
          <Link 
            href="mailto:contact@example.com" 
            style={{ color: 'rgb(238, 122, 102)' }}
            className="hover:opacity-80 transition-opacity duration-300"
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
