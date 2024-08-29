import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="wow fadeInUp relative z-10 pt-20 lg:pt-[100px]">
      {/* 链接信息 */}
      <div className="container flex justify-center">
        <Link
          href="https://beian.miit.gov.cn"
          className="mb-6 inline-block text-body-color hover:text-primary"
        >
          浙ICP备2023005735号-2
        </Link>
        <span className="mx-2 text-body-color"> | </span>
        <Link
          href="https://gsc.readecho.cn/"
          className="text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
        >
          今日古诗词
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
