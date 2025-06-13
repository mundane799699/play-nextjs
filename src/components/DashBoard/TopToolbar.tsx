"use client";

interface TopToolbarProps {
  onAIChatToggle?: () => void;
  isAIChatOpen?: boolean;
}

const TopToolbar = ({ onAIChatToggle, isAIChatOpen }: TopToolbarProps) => {

  return (
    <div className="flex items-center justify-end mb-4">
      {/* AI问书按钮 */}
      <button
        onClick={onAIChatToggle}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          isAIChatOpen
            ? "bg-[#4a90e2] text-white shadow-sm"
            : "text-[#7a6f5d] hover:bg-[#f0ebe5] hover:text-[#5a4e3a] border border-[#d4c5b0] bg-white"
        }`}
      >
        <span className={`transition-colors duration-200 ${isAIChatOpen ? "text-white" : "text-[#a89888]"}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </span>
        <span>AI问书</span>
      </button>
    </div>
  );
};

export default TopToolbar; 