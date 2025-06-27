"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { initSchema } from "@/lib/db";
import { AppUpdateHandler } from "@/components/update/AppUpdateHandler";
import { getVersion } from "@tauri-apps/api/app";
import UpdateModal from "@/components/update/UpdateModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    initSchema()
      .then(() => {
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

    const checkVersion = async () => {
      const current = await getVersion();
      const stored = localStorage.getItem("app_version");

      if (stored !== current) {
        setShowUpdateModal(true);
        localStorage.setItem("app_version", current);
      }
    };

    checkVersion();
  }, []);

  if (isLoading) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center justify-center min-h-screen bg-gray-50`}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento...</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <>
      {showUpdateModal && (
        <UpdateModal onClose={() => setShowUpdateModal(false)} />
      )}

      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="min-h-screen bg-gray-50 pl-20 pr-8 py-8">
            <div className="max-w-6xl mx-auto">
              <Toaster position="bottom-right" offset={20} />
              <Sidebar />
              <AppUpdateHandler />
              {children}
            </div>
          </div>
        </body>
      </html>
    </>
  );
}
