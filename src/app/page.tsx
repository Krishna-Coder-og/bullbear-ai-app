'use client';

import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Zap, BarChart3, BrainCircuit, ShieldCheck, Bot, CheckCircle, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

const tickerData = [
  { symbol: "BTC-USD", price: "30,543.87", change: "-210.45", isUp: false },
  { symbol: "AAPL", price: "190.45", change: "+1.23", isUp: true },
  { symbol: "MSFT", price: "340.89", change: "-0.56", isUp: false },
  { symbol: "GOOG", price: "135.12", change: "+0.88", isUp: true },
  { symbol: "NVDA", price: "450.76", change: "+5.67", isUp: true },
  { symbol: "SPY", price: "440.32", change: "+0.15", isUp: true },
];

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
    controls.start({ opacity: 1, y: 0 });
  }, []);

  return (
    <div className="bg-deep-navy text-light-gray min-h-screen overflow-x-hidden relative">

      {/* LOADER */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-neon-green text-4xl font-extrabold"
          >
            BullBear AI⚡
          </motion.div>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-40 bg-deep-navy/60 backdrop-blur-lg border-b border-neon-green/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="text-neon-green" />
            <h1 className="text-xl font-bold">BullBear AI</h1>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-medium-gray">
            <Link href="#features" className="hover:text-neon-green transition">Features</Link>
            <Link href="#about" className="hover:text-neon-green transition">About</Link>
            <Link href="#contact" className="hover:text-neon-green transition">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="text-sm hover:text-neon-green">Sign In</Link>
              <Link href="/sign-up" className="text-sm px-3 py-1 rounded-md bg-white/5 hover:bg-white/10">Sign Up</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm font-medium px-4 py-2 rounded-md bg-neon-green text-deep-navy shadow-neon-glow hover:brightness-125 transition-all">
                Go to Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div className="fixed top-[73px] left-0 w-full z-30 bg-black/30 border-y border-neon-green/10 backdrop-blur-sm">
        <div className="ticker-wrap py-1 text-sm">
          <div className="ticker-move">
            {tickerData.map((ticker, i) => (
              <span key={i} className={`ticker-item ${ticker.isUp ? "ticker-up" : "ticker-down"}`}>
                {ticker.symbol} {ticker.price} ({ticker.change})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="pt-[105px]">

        {/* HERO */}
        <section className="relative h-screen flex items-center justify-center text-center">
          <video className="absolute inset-0 w-full h-full object-cover opacity-10" autoPlay loop muted playsInline src="/media/hero-video.mp4" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/80 to-transparent" />
          <motion.div
            className="z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={controls}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-b from-white to-gray-400 text-transparent bg-clip-text">
              Empower Your Investments with <span className="text-neon-green">AI</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
              Analyze stocks, manage portfolios, and get real-time insights with BullBear AI.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/dashboard" className="px-8 py-3 bg-white/5 border border-white/20 rounded-md font-semibold hover:bg-white/10 transition">
                Start Investing
              </Link>
              <button onClick={() => setShowVideo(true)} className="px-8 py-3 bg-white/5 border border-white/20 rounded-md font-semibold hover:bg-white/10 transition">
                Watch Demo
              </button>
            </div>
          </motion.div>

          {showVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
              <div className="relative w-full max-w-4xl">
                <button onClick={() => setShowVideo(false)} className="absolute top-3 right-4 text-white text-2xl">×</button>
                <video className="w-full rounded-lg" controls>
                  <source src="/media/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 bg-black/30 text-center">
          <motion.h2 className="text-4xl font-bold mb-12" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            What Makes BullBear AI Powerful?
          </motion.h2>
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "The Personalized Dashboard",
                items: [
                  "Total Portfolio Value",
                  "Portfolio Allocation Donut Chart",
                  "Watchlist with Live Prices",
                  "Real-Time Financial News",
                  "Simple Transaction Management"
                ]
              },
              {
                title: "Advanced Portfolio Analytics",
                items: [
                  "Performance vs. S&P 500",
                  "Best & Worst Performers",
                  "Sector Allocation Chart"
                ]
              },
              {
                title: "Intelligent Tools & AI",
                items: [
                  "AI Co-Pilot with Gemini",
                  "Stock Comparison Tool",
                  "Professional Charting Tools"
                ]
              },
              {
                title: "Secure & Personalized",
                items: [
                  "Secure Authentication",
                  "Encrypted Data Storage",
                  "Sleek, Modern UI"
                ]
              }
            ].map((block, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-black/40 rounded-lg border border-white/10 p-6 space-y-3 shadow-sm hover:shadow-neon-glow">
                <h3 className="text-xl font-bold">{block.title}</h3>
                <ul className="space-y-2 text-left text-sm">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <CheckCircle className="text-purple-400 mt-1" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-24 bg-black/20">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl font-bold mb-4">Built for the Modern Investor</h2>
              <p className="text-medium-gray mb-4">BullBear AI blends powerful data tools with intuitive design and AI assistance.</p>
              <p className="text-medium-gray">From real-time charts to smart insights — BullBear is your intelligent co-pilot.</p>
            </motion.div>
            <motion.div className="relative h-80 rounded-lg overflow-hidden" initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} transition={{ duration: 0.6 }}>
              <Image
                src="/media/dashboard-mockup.jpeg"
                alt="Preview"
                layout="fill"
                objectFit="cover"
                className="rounded-lg grayscale hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-24 bg-deep-navy text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Waitlist or Get in Touch</h2>
          <p className="text-lg text-medium-gray mb-6">Have questions or want early access? Let’s connect.</p>
          <form className="max-w-lg mx-auto mb-6">
            <input type="email" placeholder="Enter your email" className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-green" />
            <button type="submit" className="mt-4 px-8 py-3 rounded-lg bg-neon-green text-deep-navy font-semibold hover:brightness-110 transition">
              Join Newsletter
            </button>
          </form>
          <div className="flex justify-center gap-6 text-white text-xl">
            <a href="https://www.linkedin.com/in/krishna-shankar-maurya-24631a323" target="_blank" rel="noopener noreferrer">
              <Linkedin className="hover:text-neon-green transition" />
            </a>
            <a href="https://github.com/Krishna-Coder-og" target="_blank" rel="noopener noreferrer">
              <Github className="hover:text-neon-green transition" />
            </a>
          </div>
        </section>
      </main>

      {/* BOT FLOAT */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-14 h-14 bg-neon-green rounded-full flex items-center justify-center shadow-neon-glow cursor-pointer hover:scale-110 transition">
          <Bot size={28} className="text-deep-navy" />
        </div>
      </div>
    </div>
  );
}
