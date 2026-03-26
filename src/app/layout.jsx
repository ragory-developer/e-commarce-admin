"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "@/Components/Layout/AdminLayout";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {

  useEffect(() => {
    const handleError = (e) => {
      console.error("🔥 Global Error:");
      console.error("Message:", e.message);
      console.error("Stack:", e.error?.stack);
      console.error("File:", e.filename, "Line:", e.lineno);
    };

    const handleRejection = (e) => {
      console.error("🔥 Unhandled Promise Rejection:");
      console.error("Reason:", e.reason);
      console.error("Stack:", e.reason?.stack);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AdminLayout>{children}</AdminLayout>

        {/* React Toastify Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </body>
    </html>
  );
}
