import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"
import "./styles/global.css"
import "./styles/header.css"
import "./styles/home.css"
import "./styles/projects.css"
import "./styles/blog.css"
import "./styles/content.css"
import "./styles/spacecannon.css"

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)