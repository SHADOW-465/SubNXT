"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    SkipBack,
    Rewind,
    Play,
    Pause,
    FastForward,
    SkipForward,
    Video,
    Star,
    Timer,
    Sparkles,
    LayoutGrid,
    Settings,
} from "lucide-react";
import { formatTime } from "@/lib/store";

interface TransportBarProps {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    aspectRatio?: string;
    resolution?: string;
    onPlayPause: () => void;
    onSkipBack: () => void;
    onSkipForward: () => void;
    onRewind: () => void;
    onFastForward: () => void;
}

export function TransportBar({
    isPlaying,
    currentTime,
    duration,
    aspectRatio = "9:16",
    resolution = "1440p",
    onPlayPause,
    onSkipBack,
    onSkipForward,
    onRewind,
    onFastForward,
}: TransportBarProps) {
    const formattedDuration = `${Math.floor(duration)}s`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bottom-bar px-4 py-3 flex items-center justify-between"
        >
            {/* Transport Controls */}
            <div className="flex items-center gap-1.5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onSkipBack}
                            className="transport-button"
                        >
                            <SkipBack className="h-3.5 w-3.5" />
                        </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Skip to Start</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onRewind}
                            className="transport-button"
                        >
                            <Rewind className="h-3.5 w-3.5" />
                        </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Rewind 5s</TooltipContent>
                </Tooltip>

                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={onPlayPause}
                    className="transport-button w-10 h-10 bg-[#2a2a30] border-white/8"
                >
                    {isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                    )}
                </motion.button>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onFastForward}
                            className="transport-button"
                        >
                            <FastForward className="h-3.5 w-3.5" />
                        </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Forward 5s</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onSkipForward}
                            className="transport-button"
                        >
                            <SkipForward className="h-3.5 w-3.5" />
                        </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Skip to End</TooltipContent>
                </Tooltip>
            </div>

            {/* Config Pills */}
            <div className="flex items-center gap-2">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="copper-pill"
                >
                    <Video className="h-3 w-3" />
                    {aspectRatio}
                </motion.div>

                {/* Resolution pill - highlighted */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="copper-pill-active"
                >
                    <Star className="h-3 w-3" />
                    {resolution}
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="copper-pill"
                >
                    <Timer className="h-3 w-3" />
                    {formattedDuration}
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="copper-pill"
                >
                    <Sparkles className="h-3 w-3" />
                    None
                </motion.div>
            </div>

            {/* Settings Controls */}
            <div className="flex items-center gap-1.5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="transport-button"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Layout</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="transport-button"
                        >
                            <Settings className="h-3.5 w-3.5" />
                        </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Settings</TooltipContent>
                </Tooltip>
            </div>
        </motion.div>
    );
}
