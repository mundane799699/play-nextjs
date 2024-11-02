import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="wow fadeInUp relative z-10 bg-primary pt-20 text-white dark:bg-dark-2 lg:pt-[100px]">
      {/* 链接信息 */}
      <div className="container flex justify-center gap-4">
        <Link href="https://gsc.readecho.cn/" className="hover:underline">
          今日古诗词
        </Link>
        <Link href="https://toolsapp.cc/" className="hover:underline">
          toolsapp
        </Link>
        <Link href="https://javaqahub.cc/" className="hover:underline">
          javaqahub
        </Link>
      </div>
      <div className="container mt-4 flex justify-center">
        <Link
          href="https://beian.miit.gov.cn"
          className="mb-6 inline-block hover:underline"
        >
          浙ICP备2023005735号-2
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
