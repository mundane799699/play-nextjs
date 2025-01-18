'use client';

import Link from 'next/link';

export default function UnauthorizedTip() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-gray-400">
          你还没有
          <Link href="/api/auth/signin" className="text-gray-500 hover:text-gray-600 hover:underline mx-1">
            登录 Readecho
          </Link>
        </p>
        <p className="text-gray-400">
          登录后下载
          <Link 
            href="https://chromewebstore.google.com/detail/readecho-%E5%90%8C%E6%AD%A5%E4%BD%A0%E7%9A%84%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0/ibinnfpnfbcfdblmjpmjmffcjcadig" 
            className="text-gray-500 hover:text-gray-600 hover:underline mx-1"
            target="_blank"
          >
            浏览器插件
          </Link>
          ，即可同步你的
          <Link 
            href="https://weread.qq.com/" 
            className="text-gray-500 hover:text-gray-600 hover:underline mx-1"
            target="_blank"
          >
            微信书架和笔记
          </Link>
        </p>
      </div>
    </div>
  );
}
