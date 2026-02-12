"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

export const ToastWrapper = () => {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme={theme}
      stacked
      style={{ zIndex: 100000, top: "20px" }}
    />
  );
};
