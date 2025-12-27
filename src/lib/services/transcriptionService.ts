// Transcription Service

import type { Subtitle } from "$lib/stores/projectStore.svelte";

export async function transcribeOffline(
    mediaUrl: string,
    onProgress: (progress: number) => void,
    onComplete: (subtitles: Subtitle[]) => void
) {
    // Dynamically import the worker or pipeline
    // Since we are in the browser, we use the standard Transformers.js pipeline

    // NOTE: In a real environment, we'd use a Web Worker to avoid blocking UI.
    // For this implementation, I'll put the logic here but wrap it in async chunks.

    // We need to dynamic import to avoid SSR issues
    const { pipeline, env } = await import('@xenova/transformers');

    // Skip local model checks if we want to fetch from CDN
    env.allowLocalModels = false;
    env.useBrowserCache = true;

    try {
        onProgress(5); // Starting

        // Load the model
        // 'Xenova/whisper-tiny' is small and fast for demo.
        // 'Xenova/whisper-base' is better but larger.
        const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
            progress_callback: (data: any) => {
                // Determine loading progress of model
                if (data.status === 'progress') {
                     // Map 0-100 of download to 5-30 of total progress
                     onProgress(5 + (data.progress || 0) * 0.25);
                }
            }
        });

        onProgress(30); // Model loaded

        const output = await transcriber(mediaUrl, {
            chunk_length_s: 30,
            stride_length_s: 5,
            return_timestamps: true,
        }) as any;

        onProgress(90);

        // Process output to our Subtitle format
        // output.text is the full text
        // output.chunks contains { text, timestamp: [start, end] }

        const subtitles: Subtitle[] = (output.chunks || []).map((chunk: any, index: number) => ({
            id: crypto.randomUUID(),
            startTime: chunk.timestamp[0],
            endTime: chunk.timestamp[1] || chunk.timestamp[0] + 2, // Fallback if end is null
            text: chunk.text.trim(),
            speaker: "Speaker 1", // Whisper doesn't do diarization by default without extra steps
            confidence: 0.9 // Mock confidence
        }));

        onProgress(100);
        onComplete(subtitles);

    } catch (e) {
        console.error("Transcription failed", e);
        throw e;
    }
}

export async function transcribeOnline(file: File) {
    // This would upload to the SvelteKit API
    // const formData = new FormData();
    // formData.append('file', file);
    // const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
    // return await res.json();
}
