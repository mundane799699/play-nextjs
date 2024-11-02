import SectionTitle from "../Common/SectionTitle";

const Contact = () => {
  return (
    <section id="contact" className="relative py-20 dark:bg-dark md:py-[120px]">
      <div className="container px-4">
        <SectionTitle
          subtitle="Contact Us"
          title="联系我们"
          paragraph=""
          width="640px"
          center
        />
        <p className="mb-8 text-center text-dark dark:text-white">
          扫码进入用户交流群
        </p>
        <div className="flex justify-center">
          <img
            src="/images/faq/用户交流二维码.jpg"
            alt="用户交流群二维码"
            className="h-1/4 w-1/4"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
