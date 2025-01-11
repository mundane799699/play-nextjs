import React from "react";
import { createRoot } from "react-dom/client";
import App from "./page.jsx";
import "./style.css";

// 挂载React组件
createRoot(document.getElementById("root")!).render(<App />);
