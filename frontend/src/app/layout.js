// 'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
// import Footer from "@/components/Footer/Footer";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Online Notarization – Affidavits, POA, Agreements | 100% Court Accepted",
  description:
    "Get your Affidavits, Power of Attorney, Agreements & all legal documents notarized online from anywhere in the world — Dubai, USA, UK, Canada, Singapore, Australia — in just 15-30 minutes via video call. 100% legally valid and court accepted across India. No physical presence required. Book Appointment Now.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
