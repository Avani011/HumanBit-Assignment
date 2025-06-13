"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/component/ui/button";
import SplitPanel from "./SplitPanel";
import type { JobDescription } from "@/types/job";

export default function Landing() {
  const [started, setStarted] = useState(false);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(
    null
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      {!started ? (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              AI-Powered Talent Search
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Generate professional job descriptions and find the perfect
              candidates on LinkedIn with our AI-powered search tool.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setStarted(true)}
                size="lg"
                className="gradient-border glassmorphism text-white px-8 py-6 text-xl group"
              >
                Find Talent
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }}
                >
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-24 glassmorphism p-8 rounded-lg max-w-4xl w-full"
          >
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Describe the Role</h3>
                <p className="text-gray-400">
                  Enter a brief description of the job role you're looking to
                  fill.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  AI-Generated Description
                </h3>
                <p className="text-gray-400">
                  Our AI creates a structured job description you can edit and
                  refine.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Find Candidates</h3>
                <p className="text-gray-400">
                  Our AI agent searches LinkedIn to find the best matching
                  candidates.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <SplitPanel
          onJobDescriptionGenerated={setJobDescription}
          jobDescription={jobDescription}
        />
      )}
    </main>
  );
}
