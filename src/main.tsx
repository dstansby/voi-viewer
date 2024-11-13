import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import VoiViewer from "./voiViewer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VoiViewer />
  </StrictMode>
);
