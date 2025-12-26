"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sparkles,
    Plus,
    Mic,
    AudioWaveform,
    Send,
    X,
} from "lucide-react";

interface PromptPanelProps {
    promptText?: string;
    onPromptChange?: (text: string) => void;
    onSend?: () => void;
    onRecord?: () => void;
    onClose?: () => void;
    isRecording?: boolean;
    thumbnails?: string[];
}

export function PromptPanel({
    promptText = "",
    onPromptChange,
    onSend,
    onRecord,
    onClose,
    isRecording = false,
    thumbnails = [],
}: PromptPanelProps) {
    const [localPrompt, setLocalPrompt] = useState(promptText);

    const sampleDescription = `A hyper-realistic, cinematic close-up of a human eye surrounded by vibrant red feathers. The iris glows in shades of blue and green, while the eyelid shimmers with golden metallic makeup. Every eyelash is sharply detailed, catching the soft light that reflects across the surface, creating a sense of depth and intensity. The feathers gently frame the eye, adding contrast between the fiery red tones and the luminous golden highlights.`;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="floating-panel-warm w-64 flex flex-col max-h-[55vh]"
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-[#F9C35C]" />
                    </div>
                    <span className="font-medium text-white text-sm">Prompt</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-6 w-6 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 px-4 py-3">
                <p className="text-xs text-[#E6D8C9] leading-relaxed">
                    {localPrompt || sampleDescription}
                </p>

                {/* Thumbnails Row */}
                <div className="flex items-center gap-2 mt-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="prompt-thumbnail w-20 h-14 bg-gradient-to-br from-red-800/60 to-amber-800/40"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="prompt-thumbnail w-20 h-14 bg-gradient-to-br from-amber-700/60 to-yellow-600/40"
                    />
                </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="px-4 py-3 border-t border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="icon-button-warm h-8 w-8"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRecord}
                        className={`icon-button-warm h-8 w-8 ${isRecording ? "active animate-pulse" : ""}`}
                    >
                        <Mic className="h-3.5 w-3.5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="icon-button-warm h-8 w-8"
                    >
                        <AudioWaveform className="h-3.5 w-3.5" />
                    </motion.button>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSend}
                    className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#1a1a1a] shadow-lg"
                >
                    <Send className="h-3.5 w-3.5" />
                </motion.button>
            </div>
        </motion.div>
    );
}
