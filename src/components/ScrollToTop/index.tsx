import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 检测AI面板是否存在
    const checkAIPanel = () => {
      const aiPanel = document.querySelector('[data-ai-panel]');
      setIsAIPanelOpen(!!aiPanel);
    };

    // 创建MutationObserver来监听DOM变化
    const observer = new MutationObserver(checkAIPanel);
    
    window.addEventListener("scroll", toggleVisibility);
    
    // 初始检查
    checkAIPanel();
    
    // 监听整个document的子元素变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`fixed bottom-8 z-[999] transition-all duration-300 ${isAIPanelOpen ? 'right-[420px]' : 'right-8'}`}>
      {isVisible && (
        <div
          onClick={scrollToTop}
          aria-label="scroll to top"
          className="back-to-top flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-dark"
        >
          <span className="mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white"></span>
        </div>
      )}
    </div>
  );
}
