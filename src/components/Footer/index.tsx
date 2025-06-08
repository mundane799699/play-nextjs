import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="wow fadeInUp relative z-10 pt-20 text-gray-600 lg:pt-[100px]" style={{ backgroundColor: '#f9fafb' }}>
      {/* 链接信息 */}
      <div className="container flex justify-center gap-4">
        <Link href="https://xhs.mundane.ink" className="hover:text-primary transition-colors">
          redArchive小红书收藏导出
        </Link>
        <Link href="https://danci.mundane.ink" className="hover:text-primary transition-colors">
          邮件单词
        </Link>
        <Link href="https://gsc.readecho.cn/" className="hover:text-primary transition-colors">
          今日古诗词
        </Link>
        <Link href="https://toolsapp.cc/" className="hover:text-primary transition-colors">
          toolsapp
        </Link>
        <Link href="https://javaqahub.cc/" className="hover:text-primary transition-colors">
          javaqahub
        </Link>
      </div>
      <div className="container mt-4 flex justify-center">
        <Link
          href="https://beian.miit.gov.cn"
          className="mb-6 inline-block hover:text-primary transition-colors"
        >
          浙ICP备2023005735号-2
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
