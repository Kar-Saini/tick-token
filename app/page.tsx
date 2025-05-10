"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Sparkles } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex flex-col flex-grow items-center justify-center text-center bg-gradient-to-b from-white to-purple-50 px-6">
        <section className="w-full max-w-4xl py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 relative"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
              Create Memorable{" "}
              <span className="text-purple-600">Experiences</span> with Digital
              Tokens
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Mint, distribute, and manage experience tokens on Solana. Engage
              your audience with collectible digital memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="group"
                onClick={() => {
                  router.push("/main");
                }}
              >
                Start Creating Tokens
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          <div className="absolute top-10 left-10 opacity-20 pointer-events-none z-0">
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Coins className="h-16 w-16 text-purple-300" />
            </motion.div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-20 bg-gradient-to-b from-purple-50 to-white"
        >
          <div className="container mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-2 text-gray-900">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Creating and distributing experience tokens is simple
              </p>
            </motion.div>

            <div className="flex flex-col items-center space-y-10 mx-auto max-w-2xl">
              {[
                {
                  step: "1",
                  title: "Mint Tokens",
                  description:
                    "Generate unique digital tokens on the Solana blockchain for your experience.",
                },
                {
                  step: "2",
                  title: "Share QR Codes",
                  description:
                    "Distribute QR codes to attendees through email, print, or display at your venue.",
                },
                {
                  step: "3",
                  title: "Attendees Claim Tokens",
                  description:
                    "Participants scan the QR code and receive their unique digital collectible.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-lg shadow-lg mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-1 text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 max-w-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
