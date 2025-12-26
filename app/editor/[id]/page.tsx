"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Camera,
  Mic,
  Music,
  LayoutGrid,
  User,
  Type,
  Sparkles,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Settings,
  Grid,
  Send,
  Activity,
  FileText,
  Loader2,
  Pencil,
  Video,
  Star,
  Timer,
  Wand2,
  Share2,
} from "lucide-react";
import {
  Subtitle,
  StyleSettings,
  defaultStyleSettings,
  formatTime,
  simulateAIFetch,
  generateSRT,
  generateVTT,
  generateASS,
  mockAIResponses,
} from "@/lib/store";
import Link from "next/link";

// Liquid Glass Button Component
const LiquidButton = ({
  children,
  className = "",
  active = false,
  size = "md",
  variant = "default",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "back";
  onClick?: () => void;
}) => {
  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <motion.button
      whileHover={{ scale: active ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center justify-center rounded-full transition-all duration-500 relative
        ${sizeClasses[size]}
        ${active
          ? "bg-white/90 text-[#3A1C14] shadow-[0_0_25px_rgba(255,255,255,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)] scale-110"
          : variant === "back"
            ? "bg-[#4A241B]/80 text-white/80 border border-[#E5352B]/30 backdrop-blur-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
            : "bg-white/10 text-white/80 backdrop-blur-xl border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]"
        }
        hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

// Mock subtitles
const initialSubtitles: Subtitle[] = [
  { id: "1", startTime: 0, endTime: 3.5, text: "Welcome to SubGEN PRO, the ultimate subtitle editor.", speaker: "Host", confidence: 0.98, track: "master" },
  { id: "2", startTime: 3.8, endTime: 7.2, text: "Today we'll explore all the powerful AI features.", speaker: "Host", confidence: 0.96, track: "master" },
  { id: "3", startTime: 7.5, endTime: 11.8, text: "Our neural transcription engine is incredibly accurate.", speaker: "Host", confidence: 0.94, track: "master" },
  { id: "4", startTime: 12.0, endTime: 15.3, text: "Let's start by looking at the timeline editor.", speaker: "Host", confidence: 0.97, track: "master" },
  { id: "5", startTime: 15.8, endTime: 19.5, text: "You can drag and resize any subtitle segment easily.", speaker: "Host", confidence: 0.92, track: "master" },
];

// Sample clips for timeline
const sampleClips = [
  { id: 1, gradient: "from-red-700 to-orange-900" },
  { id: 2, gradient: "from-orange-700 to-amber-800" },
  { id: 3, gradient: "from-purple-800 to-blue-900" },
  { id: 4, gradient: "from-red-800 to-orange-700" },
  { id: 5, gradient: "from-blue-800 to-purple-900" },
  { id: 6, gradient: "from-amber-700 to-red-800" },
  { id: 7, gradient: "from-purple-700 to-pink-800" },
];

export default function SubGENProEditor() {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(60);
  const [subtitles, setSubtitles] = useState<Subtitle[]>(initialSubtitles);
  const [styleSettings] = useState<StyleSettings>(defaultStyleSettings);
  const [activeTool, setActiveTool] = useState<string>("camera");
  const [showPromptPanel, setShowPromptPanel] = useState(true);
  const [activeClipIndex, setActiveClipIndex] = useState(3);
  const [projectName] = useState("Silent Passage");
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiTask, setAiTask] = useState<string | null>(null);
  const [aiProgress, setAiProgress] = useState(0);

  const currentSubtitle = subtitles.find(
    (s) => currentTime >= s.startTime && currentTime <= s.endTime
  );

  // Playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)));
  }, [duration]);

  const handleExport = (format: "srt" | "vtt" | "ass") => {
    let content: string;
    let filename: string;
    switch (format) {
      case "srt":
        content = generateSRT(subtitles);
        filename = "subtitles.srt";
        break;
      case "vtt":
        content = generateVTT(subtitles);
        filename = "subtitles.vtt";
        break;
      case "ass":
        content = generateASS(subtitles, styleSettings);
        filename = "subtitles.ass";
        break;
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const playheadPosition = (currentTime / duration) * 100;
  const tools = [
    { id: "camera", icon: Camera },
    { id: "mic", icon: Mic },
    { id: "music", icon: Music },
    { id: "grid", icon: LayoutGrid },
    { id: "user", icon: User },
    { id: "text", icon: Type },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full grid-background flex items-center justify-center p-6 lg:p-10 font-sans overflow-hidden">

        {/* Main Editor Panel */}
        <motion.main
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-7xl h-[90vh] main-panel overflow-hidden flex flex-col"
        >
          {/* ===== TOP SECTION ===== */}

          {/* Back Button - Top Left Corner */}
          <div className="absolute top-5 left-5 z-40">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard">
                  <LiquidButton size="md" variant="back">
                    <ArrowLeft size={20} />
                  </LiquidButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Back to Dashboard</TooltipContent>
            </Tooltip>
          </div>

          {/* Left Toolbar - Below Back Button */}
          <div className="absolute top-20 left-5 z-40 flex flex-col gap-2">
            {tools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <div>
                    <LiquidButton
                      size="md"
                      active={activeTool === tool.id}
                      onClick={() => setActiveTool(tool.id)}
                    >
                      <tool.icon size={18} strokeWidth={2} />
                    </LiquidButton>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {tool.id.charAt(0).toUpperCase() + tool.id.slice(1)}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Title Capsule - Top Center with Edit & Plus */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="title-capsule flex items-center gap-2"
            >
              <span className="text-white text-sm font-medium tracking-wide">{projectName}</span>
              <button className="text-white/50 hover:text-white transition-colors">
                <Pencil size={14} />
              </button>
            </motion.div>
            <LiquidButton size="sm">
              <Plus size={16} />
            </LiquidButton>
          </div>

          {/* ===== CANVAS AREA ===== */}
          <div className="relative flex-1 w-full overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 bg-black">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background: `radial-gradient(circle at 35% 45%, #e5352b 0%, #3a1c14 30%, #1a0d0a 60%)`,
                }}
              >
                {/* Decorative Glows */}
                <div className="absolute top-[20%] left-[10%] w-[250px] h-[250px] bg-[#f9c35c]/10 blur-[80px] rounded-full animate-pulse" />
                <div className="absolute bottom-[15%] right-[25%] w-[350px] h-[180px] bg-[#d17f3a]/15 blur-[100px] rounded-full" />

                {/* Eye Effect */}
                <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-[10px] border-[#d17f3a]/25 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-black/80 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/10 blur-[2px] animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Subtitle Overlay */}
              <AnimatePresence>
                {currentSubtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 bottom-[35%] flex justify-center px-8"
                  >
                    <span
                      className="px-6 py-3 rounded-xl text-center backdrop-blur-xl"
                      style={{
                        fontSize: `${styleSettings.fontSize}px`,
                        backgroundColor: `rgba(26,13,10,0.8)`,
                        color: "#fff",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                      }}
                    >
                      {currentSubtitle.text}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ===== RIGHT PROMPT PANEL ===== */}
            <AnimatePresence>
              {showPromptPanel && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-5 top-5 z-40 w-[300px] prompt-panel p-5 flex flex-col max-h-[55%]"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-white/70" />
                      <span className="text-white font-medium text-sm">Prompt</span>
                    </div>
                    <button
                      onClick={() => setShowPromptPanel(false)}
                      className="text-white/30 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                    <p className="text-white/70 text-xs leading-relaxed mb-4">
                      A hyper-realistic, cinematic close-up of a human eye surrounded by vibrant red feathers.
                      The iris glows in shades of blue and green, while the eyelid shimmers with golden metallic makeup.
                      Every eyelash is sharply detailed, catching the soft light that reflects across the surface.
                    </p>

                    {/* Thumbnails */}
                    <div className="flex gap-2 mb-4">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="prompt-thumb w-[80px] h-[60px]"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? "from-red-800 to-orange-900" : "from-amber-700 to-yellow-800"} opacity-80`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <LiquidButton size="sm"><Plus size={14} /></LiquidButton>
                      <LiquidButton size="sm"><Mic size={14} /></LiquidButton>
                      <LiquidButton size="sm"><Activity size={14} /></LiquidButton>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="send-button w-10 h-10"
                    >
                      <Send size={18} fill="currentColor" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Prompt Button */}
            {!showPromptPanel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-5 top-5 z-40"
              >
                <LiquidButton size="lg" onClick={() => setShowPromptPanel(true)}>
                  <Sparkles size={20} />
                </LiquidButton>
              </motion.div>
            )}

            {/* ===== TIMELINE SECTION ===== */}
            <div className="absolute bottom-0 left-0 right-0 z-30 timeline-overlay px-6 pt-8 pb-0">

              {/* Range Handle - Centered */}
              <div className="flex justify-center mb-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="range-handle px-3 py-1.5 flex items-center gap-1 cursor-ew-resize"
                >
                  <ChevronLeft size={12} className="text-white" />
                  <ChevronRight size={12} className="text-white" />
                </motion.div>
              </div>

              {/* Timeline Ruler */}
              <div className="relative w-full h-8 mb-4">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/15" />
                <div className="absolute inset-0 flex justify-between items-end pb-1">
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((t) => (
                    <div key={t} className="flex flex-col items-center">
                      <span className="text-[9px] text-white/40 mb-1 font-mono">{t}s</span>
                      <div className="w-px h-1.5 bg-white/25" />
                    </div>
                  ))}
                </div>

                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 playhead z-10"
                  style={{ left: `${playheadPosition}%` }}
                >
                  <div className="playhead-knob absolute -top-1 -left-[5px]" />
                </div>
              </div>

              {/* Clip Strip */}
              <div className="flex items-center gap-3 mb-0">
                <div className="flex-1 clip-strip flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {sampleClips.map((clip, index) => {
                    const isActive = index === activeClipIndex;
                    return (
                      <motion.div
                        key={clip.id}
                        onClick={() => setActiveClipIndex(index)}
                        className={`relative flex-shrink-0 h-11 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${isActive
                            ? "w-24 ring-2 ring-white/40 shadow-xl scale-105"
                            : "w-16 opacity-60 hover:opacity-90"
                          }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${clip.gradient}`} />
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-between px-2">
                            <ChevronLeft size={14} className="text-white drop-shadow" />
                            <ChevronRight size={14} className="text-white drop-shadow" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <LiquidButton size="md">
                  <Plus size={20} />
                </LiquidButton>
              </div>
            </div>
          </div>

          {/* ===== BOTTOM CONTROL BAR ===== */}
          <div className="h-20 bottom-bar px-8 flex items-center justify-between">

            {/* Transport Controls - Left */}
            <div className="flex items-center gap-3">
              <LiquidButton size="sm" onClick={() => handleSeek(0)}>
                <SkipBack size={16} fill="currentColor" />
              </LiquidButton>
              <LiquidButton size="sm">
                <ChevronLeft size={16} />
              </LiquidButton>
              <LiquidButton
                size="md"
                className="!bg-white/15"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </LiquidButton>
              <LiquidButton size="sm" onClick={() => handleSeek(duration)}>
                <SkipForward size={16} fill="currentColor" />
              </LiquidButton>
            </div>

            {/* Config Pills - Center */}
            <div className="flex items-center gap-2">
              <div className="config-pill gap-2">
                <Video size={12} />
                <span>9:16</span>
              </div>
              <div className="config-pill-active">
                <Star size={12} fill="currentColor" />
                <span>1440p</span>
              </div>
              <div className="config-pill gap-2">
                <Timer size={12} />
                <span>18s</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="config-pill gap-2 cursor-pointer">
                    <Wand2 size={12} />
                    <span>None</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="prompt-panel border-white/10">
                  <DropdownMenuItem onClick={() => handleExport("srt")} className="text-white hover:bg-white/10 cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />Export SRT
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("vtt")} className="text-white hover:bg-white/10 cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />Export VTT
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("ass")} className="text-white hover:bg-white/10 cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />Export ASS
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                    <Share2 className="mr-2 h-4 w-4" />Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Settings - Right */}
            <div className="flex items-center gap-2">
              <LiquidButton size="sm"><Grid size={16} /></LiquidButton>
              <LiquidButton size="sm"><Settings size={16} /></LiquidButton>
            </div>
          </div>

          {/* AI Processing Overlay */}
          <AnimatePresence>
            {isAIProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#1a0d0a]/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-[32px]"
              >
                <Loader2 className="h-10 w-10 text-[#D17F3A] animate-spin mb-4" />
                <p className="text-white font-medium text-lg mb-3">{aiTask}</p>
                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#D17F3A] to-[#F9C35C]"
                    initial={{ width: 0 }}
                    animate={{ width: `${aiProgress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </TooltipProvider>
  );
}
