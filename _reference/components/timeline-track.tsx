"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface TimelineTrackProps {
    currentTime: number;
    duration: number;
    thumbnails?: string[];
    onSeek: (time: number) => void;
    onAddClip?: () => void;
}

// Sample colored clip data - no text labels
const sampleClips = [
    { id: 1, colors: ["#8B2635", "#6B1D29", "#5B1522"] },
    { id: 2, colors: ["#D17F3A", "#B86B2A", "#995820"] },
    { id: 3, colors: ["#4B3B8F", "#3D307A", "#2F2565"] },
    { id: 4, colors: ["#8B2635", "#D17F3A", "#F9C35C"] },
];

export function TimelineTrack({
    currentTime,
    duration,
    thumbnails = [],
    onSeek,
    onAddClip,
}: TimelineTrackProps) {
    const timelineRef = useRef<HTMLDivElement>(null);
    const [activeClipIndex, setActiveClipIndex] = useState(3);

    // Generate time markers
    const markers = [];
    const step = 5;
    for (let i = 0; i <= duration; i += step) {
        markers.push(i);
    }

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * duration;
        onSeek(Math.max(0, Math.min(duration, newTime)));
    };

    const playheadPosition = (currentTime / duration) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="w-full"
        >
            {/* Range Handle */}
            <div className="flex items-center justify-center mb-2">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-white/90 text-[#1a1a1a] text-xs font-medium shadow-md cursor-pointer"
                >
                    <ChevronLeft className="h-3 w-3" />
                    <ChevronRight className="h-3 w-3" />
                </motion.div>
            </div>

            {/* Timeline Ruler */}
            <div
                ref={timelineRef}
                className="relative cursor-pointer py-1"
                onClick={handleTimelineClick}
            >
                {/* White ruler line */}
                <div className="absolute left-0 right-0 top-1/2 h-px bg-white/25" />

                {/* Time Markers */}
                <div className="relative h-5 flex items-end px-2">
                    {markers.map((time) => (
                        <div
                            key={time}
                            className="absolute flex flex-col items-center"
                            style={{ left: `${(time / duration) * 100}%` }}
                        >
                            <div className="w-px h-1.5 bg-white/35 mb-0.5" />
                            <span className="text-[9px] text-white/50 font-mono">
                                {time}s
                            </span>
                        </div>
                    ))}

                    {/* Dot markers */}
                    {Array.from({ length: Math.floor(duration) + 1 }).map((_, i) => {
                        if (i % step === 0) return null;
                        return (
                            <div
                                key={`dot-${i}`}
                                className="absolute w-0.5 h-0.5 rounded-full bg-white/20"
                                style={{ left: `${(i / duration) * 100}%`, top: "0.25rem" }}
                            />
                        );
                    })}
                </div>

                {/* Playhead */}
                <motion.div
                    className="absolute top-0 bottom-0 playhead-warm z-20"
                    style={{ left: `${playheadPosition}%` }}
                >
                    <div className="absolute -top-0.5 -left-1 w-2 h-2 bg-white rounded-full shadow-md" />
                </motion.div>
            </div>

            {/* Clip Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1">
                {sampleClips.map((clip, index) => {
                    const isActive = index === activeClipIndex;

                    if (isActive) {
                        return (
                            <motion.div
                                key={clip.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="clip-container-active flex-shrink-0"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveClipIndex(Math.max(0, activeClipIndex - 1))}
                                    className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white"
                                >
                                    <ChevronLeft className="h-3 w-3" />
                                </motion.button>

                                <div
                                    className="w-14 h-10 rounded-md timeline-thumb-warm active"
                                    style={{
                                        background: `linear-gradient(135deg, ${clip.colors[0]} 0%, ${clip.colors[1]} 50%, ${clip.colors[2]} 100%)`
                                    }}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveClipIndex(Math.min(sampleClips.length - 1, activeClipIndex + 1))}
                                    className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white"
                                >
                                    <ChevronRight className="h-3 w-3" />
                                </motion.button>
                            </motion.div>
                        );
                    }

                    return (
                        <motion.div
                            key={clip.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setActiveClipIndex(index)}
                            className="flex-shrink-0 flex gap-0.5 cursor-pointer"
                        >
                            {[0, 1, 2].map((subIndex) => (
                                <div
                                    key={subIndex}
                                    className="w-8 h-10 rounded-md timeline-thumb-warm"
                                    style={{
                                        background: `linear-gradient(135deg, ${clip.colors[subIndex % clip.colors.length]} 0%, ${clip.colors[(subIndex + 1) % clip.colors.length]} 100%)`
                                    }}
                                />
                            ))}
                        </motion.div>
                    );
                })}

                {/* Add Clip Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddClip}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1f] border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#2a2a2f] hover:text-white transition-colors ml-1"
                >
                    <Plus className="h-4 w-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}
