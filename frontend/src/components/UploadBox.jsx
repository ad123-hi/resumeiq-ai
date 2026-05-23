import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";

import { analyzeResume } from "../services/api";

const cardAnimation = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
};

function ScoreRing({ score }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;
  const strokeColor =
    score >= 80 ? "#22d3ee" : score >= 60 ? "#38bdf8" : "#f59e0b";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="-rotate-90" width="160" height="160" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-black text-white">{Math.round(score)}%</p>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          ATS Score
        </p>
      </div>
    </div>
  );
}

export default function UploadBox() {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const scoreLabel = useMemo(() => {
    if (!result) {
      return "Upload a resume and add the job description to see your score.";
    }

    if (result.score >= 80) {
      return "Excellent alignment with the target role.";
    }

    if (result.score >= 60) {
      return "Strong baseline match with room for optimization.";
    }

    return "Low match detected. Tailor skills, experience, and keywords.";
  }, [result]);

  useEffect(() => {
    if (!result) {
      setAnimatedScore(0);
      return;
    }

    let animationFrameId = 0;
    const duration = 1200;
    const start = performance.now();

    const animateValue = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedScore(result.score * progress);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animateValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(animateValue);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [result]);

  const handleFileSelection = (file) => {
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF resume.");
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFileSelection(event.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Select a PDF resume before starting analysis.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Paste the job description before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await analyzeResume({
        file: selectedFile,
        jobDescription,
      });

      setResult(response);
    } catch (requestError) {
      setResult(null);
      setError(requestError.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      {...cardAnimation}
      className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]"
    >
      <motion.form
        {...cardAnimation}
        onSubmit={handleAnalyze}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-md md:p-8"
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Resume Analyzer
            </p>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              Analyze resume fit in one polished workflow
            </h2>
          </div>
        </div>

        <motion.div
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-dashed p-8 transition ${
            dragActive
              ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
              : "border-white/10 bg-slate-950/60 hover:border-cyan-400/50 hover:bg-white/[0.06]"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-0 transition group-hover:opacity-100" />
          <div className="relative flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-cyan-300">
              <FaCloudUploadAlt className="text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Drag and drop your resume
            </h3>
            <p className="mt-3 max-w-xl text-sm text-slate-400">
              Drop a PDF file here or click to browse. The upload stream is sent
              directly to the FastAPI analyzer for secure ATS scoring.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left">
              <FaFilePdf className="text-xl text-cyan-300" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {selectedFile ? selectedFile.name : "No resume selected yet"}
                </p>
                <p className="text-xs text-slate-400">PDF only</p>
              </div>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(event) => handleFileSelection(event.target.files?.[0])}
          />
        </motion.div>

        <div className="mt-8">
          <label
            htmlFor="job-description"
            className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-300"
          >
            Job Description
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the target role description, required skills, responsibilities, and keywords."
            rows={10}
            className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key={error}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isAnalyzing}
          whileHover={!isAnalyzing ? { scale: 1.01 } : undefined}
          whileTap={!isAnalyzing ? { scale: 0.99 } : undefined}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-cyan-950/40 transition hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isAnalyzing ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
              Analyzing Resume
            </>
          ) : (
            "Analyze Resume"
          )}
        </motion.button>
      </motion.form>

      <motion.div
        {...cardAnimation}
        className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-md md:p-8"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Live Result
          </p>
          <h3 className="mt-4 text-3xl font-black text-white">
            ATS score with premium visual feedback
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">{scoreLabel}</p>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="mt-10 rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
                  <div className="absolute h-28 w-28 rounded-full border border-cyan-400/20" />
                  <div className="absolute h-20 w-20 rounded-full border border-cyan-400/20" />
                  <span className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-200/20 border-t-cyan-300" />
                </div>
                <p className="text-lg font-semibold text-white">
                  Parsing resume, cleaning text, and scoring against the job brief
                </p>
                <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.4, ease: "linear" }}
                    className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  />
                </div>
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8"
            >
              <div className="flex flex-col items-center gap-6 text-center">
                <ScoreRing score={animatedScore} />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Resume File
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {result.filename}
                  </p>
                </div>
                <div className="grid w-full gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Match Band
                    </p>
                    <p className="mt-2 text-xl font-bold text-white">
                      {result.score >= 80
                        ? "High Fit"
                        : result.score >= 60
                          ? "Moderate Fit"
                          : "Needs Work"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Next Move
                    </p>
                    <p className="mt-2 text-xl font-bold text-white">
                      Add role keywords
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8"
            >
              <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <div className="mb-5 rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-cyan-300">
                  <FaFilePdf className="text-4xl" />
                </div>
                <h4 className="text-2xl font-bold text-white">
                  Your ATS score appears here
                </h4>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                  Upload a PDF resume, paste the job description, and launch the
                  analysis to reveal a polished score card with animated feedback.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
