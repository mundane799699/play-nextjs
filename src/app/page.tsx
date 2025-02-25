import About from "@/components/About";
import HomeBlogSection from "@/components/Blog/HomeBlogSection";
import CallToAction from "@/components/CallToAction";
import Clients from "@/components/Clients";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Readecho - 同步你的微信读书笔记，让回顾释放知识的力量",
  description:
    "Readecho 是一个专注于微信读书笔记同步和知识管理的工具。自动同步你的微信读书笔记，通过AI智能分析和定期回顾，帮助你更好地吸收和运用知识。",
};

export default function Home() {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <main>
      <ScrollUp />
      <Hero />
      <Features />
      <Faq />
      {/* <About />
      <CallToAction />
      <Pricing />
      <Testimonials />
      <Team />
      <HomeBlogSection posts={posts} /> */}
      <Contact />
      {/* <Clients /> */}
      <Footer />
    </main>
  );
}
