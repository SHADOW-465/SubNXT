"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ArrowLeft,
    Camera,
    Mic,
    Music,
    LayoutGrid,
    User,
    Type,
} from "lucide-react";
import Link from "next/link";

interface FloatingToolbarProps {
    activeTool?: string;
    onToolChange?: (tool: string) => void;
}

const tools = [
    { id: "camera", icon: Camera, label: "Video", shortcut: "V" },
    { id: "mic", icon: Mic, label: "Microphone", shortcut: "M" },
    { id: "music", icon: Music, label: "Audio Library", shortcut: "A" },
    { id: "grid", icon: LayoutGrid, label: "Storyboard", shortcut: "S" },
    { id: "user", icon: User, label: "Avatar", shortcut: "U" },
    { id: "text", icon: Type, label: "Captions", shortcut: "T" },
];

export function FloatingToolbar({ activeTool, onToolChange }: FloatingToolbarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col items-center gap-3"
        >
            {/* Back Button - Separate, above the pill */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="icon-button-back"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </motion.button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Back to Dashboard</TooltipContent>
            </Tooltip>

            {/* Glassmorphic Pill Container for Tools */}
            <div className="glass-warm p-2 flex flex-col gap-1.5">
                {tools.map((tool, index) => (
                    <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: 0.15 + index * 0.04 }}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => onToolChange?.(tool.id)}
                                className={`icon-button-warm ${activeTool === tool.id ? "active" : ""}`}
                            >
                                <tool.icon className="h-4.5 w-4.5" />
                            </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {tool.label} ({tool.shortcut})
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </motion.div>
    );
}
