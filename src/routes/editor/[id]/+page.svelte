<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { projectStore, type Project, type Subtitle } from "$lib/stores/projectStore.svelte";
  import SubtitleEditorComponent from "$lib/components/editor/subtitle-editor.svelte";
  import { transcribeOffline } from "$lib/services/transcriptionService";

  // Design System
  import LiquidBackground from "$lib/components/ui/liquid/LiquidBackground.svelte";
  import GlassPanel from "$lib/components/ui/liquid/GlassPanel.svelte";
  import LiquidButton from "$lib/components/ui/liquid/LiquidButton.svelte";

  // Icons
  import {
    ArrowLeft, Type, Languages, Music, LayoutGrid, User,
    Star, Share2, MoreHorizontal, Sparkles, X, Plus,
    ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward,
    Settings, Grid, Maximize2, Send, Activity, Loader2, Download
  } from 'lucide-svelte';

  let projectId = $page.params.id;
  let mode = $page.url.searchParams.get("mode") as "online" | "offline" || "online";

  let project = $state<Project | undefined>(undefined);
  let isLoading = $state(true);
  let isTranscribing = $state(false);
  let transcriptionProgress = $state(0);
  let transcriptionStatus = $state("");

  // UI State
  let activeTab = $state('subtitles');

  // Video Player State
  let videoEl = $state<HTMLVideoElement>();
  let currentTime = $state(0);
  let duration = $state(0);
  let isPlaying = $state(false);

  let selectedSubtitleId = $state<string | null>(null);

  onMount(async () => {
    if (!projectId) return;

    // Ensure we load projects first to handle the merge/load logic
    await projectStore.loadProjects();
    project = await projectStore.getProject(projectId);
    isLoading = false;

    if (project && project.status === 'processing') {
       startTranscription();
    }
  });

  async function startTranscription() {
     if (!project) return;
     isTranscribing = true;

     try {
         if (mode === 'offline') {
             transcriptionStatus = "Loading Local AI...";

             // Fallback/Simulated file handling
             const mediaSource = project.mediaUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

             await transcribeOffline(mediaSource, (progress) => {
                 transcriptionProgress = progress;
                 transcriptionStatus = `Processing... ${Math.round(progress)}%`;
             }, (subs) => {
                 if (project) {
                     project.subtitles = subs;
                     project.status = 'completed';
                     projectStore.updateProject(project.id, { subtitles: subs, status: 'completed' });
                 }
                 isTranscribing = false;
             });

         } else {
             transcriptionStatus = "Processing in Cloud...";
             await new Promise(r => setTimeout(r, 2000));
             const mockSubs = [
                 { id: '1', startTime: 0, endTime: 2, text: "Welcome to SubGen Pro.", speaker: "Speaker 1", confidence: 0.98 },
                 { id: '2', startTime: 2, endTime: 5, text: "This is an AI-powered subtitle editor.", speaker: "Speaker 1", confidence: 0.95 },
                 { id: '3', startTime: 5, endTime: 8, text: "It uses Gemini or Whisper to transcribe your video.", speaker: "Speaker 2", confidence: 0.88 },
             ];
             if (project) {
                project.subtitles = mockSubs;
                project.status = 'completed';
                projectStore.updateProject(project.id, { subtitles: mockSubs, status: 'completed' });
             }
             isTranscribing = false;
         }

     } catch (e: any) {
         console.error(e);
         transcriptionStatus = "Error: " + (e?.message || 'Unknown error');
         if (project) {
             project.status = 'error';
             projectStore.updateProject(project.id, { status: 'error' });
         }
         isTranscribing = false;
     }
  }

  function togglePlay() {
      if (!videoEl) return;
      if (videoEl.paused) {
          videoEl.play();
          isPlaying = true;
      } else {
          videoEl.pause();
          isPlaying = false;
      }
  }

  function onTimeUpdate() {
      if (!videoEl) return;
      currentTime = videoEl.currentTime;
  }

  function onMetadata() {
      if (!videoEl) return;
      duration = videoEl.duration;
  }

  function handleSeek(time: number) {
      if (videoEl) {
          videoEl.currentTime = time;
          currentTime = time;
      }
  }

  function handleUpdateSub(id: string, updates: Partial<Subtitle>) {
      if (!project) return;
      const subIndex = project.subtitles.findIndex(s => s.id === id);
      if (subIndex > -1) {
          project.subtitles[subIndex] = { ...project.subtitles[subIndex], ...updates };
          projectStore.updateProject(project.id, { subtitles: project.subtitles });
      }
  }

  function handleDeleteSub(id: string) {
       if (!project) return;
       project.subtitles = project.subtitles.filter(s => s.id !== id);
       projectStore.updateProject(project.id, { subtitles: project.subtitles });
  }

  // Format helpers
  function formatTime(t: number) {
      const min = Math.floor(t / 60);
      const sec = Math.floor(t % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
  }
</script>

<div class="min-h-screen w-full bg-[#141418] flex items-center justify-center p-4 lg:p-10 font-sans selection:bg-orange-500/30 overflow-hidden relative">
  <LiquidBackground />

  <!-- Main Editor Panel -->
  <GlassPanel class="w-full max-w-7xl h-[90vh]">
    {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center text-white">
            <Loader2 class="h-8 w-8 animate-spin text-[#d69e2e]" />
        </div>
    {:else if project}
        <!-- Top Navigation Layer -->
        <div class="absolute top-0 left-0 right-0 z-30 p-6 flex justify-between items-start pointer-events-none">
          <LiquidButton size="lg" class="pointer-events-auto !bg-[#4A241B]/80 !border-[#E5352B]/30" onclick={() => window.history.back()}>
            <ArrowLeft size={24} />
          </LiquidButton>

          <div class="pointer-events-auto px-6 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center transform hover:bg-white/10 transition-all cursor-default">
            <span class="text-white text-sm font-medium tracking-wide">{project.name}</span>
          </div>

          <div class="pointer-events-auto flex items-center space-x-3">
            <LiquidButton onclick={() => projectStore.saveProjects()}><Star size={18} /></LiquidButton>
            <LiquidButton><Share2 size={18} /></LiquidButton>
            <LiquidButton onclick={() => alert("Exporting...")}><Download size={18} /></LiquidButton>
          </div>
        </div>

        <!-- Left Toolbar -->
        <div class="absolute top-24 left-6 z-30 flex flex-col space-y-4">
          {#each [
            { id: 'subtitles', icon: Type, label: "Subtitles" },
            { id: 'styles', icon: Sparkles, label: "Styles" },
            { id: 'translate', icon: Languages, label: "Translate" },
            { id: 'media', icon: LayoutGrid, label: "Media" }
          ] as tool (tool.id)}
            <LiquidButton
              active={activeTab === tool.id}
              size="lg"
              onclick={() => activeTab = tool.id}
              class="pointer-events-auto"
            >
              <tool.icon size={20} strokeWidth={2.5} />
            </LiquidButton>
          {/each}
        </div>

        <!-- Canvas Area (Center + Right) -->
        <div class="relative flex-1 w-full overflow-hidden flex">
             <!-- Video Area -->
            <div class="relative flex-1 bg-black flex items-center justify-center">
                 <!-- Background Ambient Glow -->
                 <div class="absolute inset-0 opacity-40 pointer-events-none" style="background: radial-gradient(circle at 35% 45%, #e5352b 0%, #3a1c14 30%, #1a0d0a 60%);"></div>

                 {#if isTranscribing}
                     <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white">
                        <Loader2 class="h-10 w-10 animate-spin text-[#d69e2e] mb-4" />
                        <h3 class="text-xl font-semibold mb-2">{transcriptionStatus}</h3>
                        <div class="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-[#E5352B] transition-all duration-300" style="width: {transcriptionProgress}%"></div>
                        </div>
                     </div>
                 {/if}

                 <!-- svelte-ignore a11y_media_has_caption -->
                 <video
                    bind:this={videoEl}
                    src={project.mediaUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                    class="max-h-[80%] max-w-[80%] z-10 shadow-2xl rounded-lg"
                    ontimeupdate={onTimeUpdate}
                    onloadedmetadata={onMetadata}
                 ></video>
            </div>

            <!-- Right Panel (Contextual) -->
             <!-- We adapt the generic glass panel from reference to hold our Subtitle Editor -->
            {#if activeTab === 'subtitles'}
            <div class="relative w-[400px] h-full bg-[#2d150f]/40 backdrop-blur-[30px] border-l border-white/15 shadow-[-32px_0_64px_rgba(0,0,0,0.6)] flex flex-col z-20 pt-24 pb-32">
                 <div class="px-6 pb-4 border-b border-white/10 flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                            <Type size={14} class="text-white" />
                        </div>
                        <span class="text-white font-medium text-sm tracking-wide">Subtitles</span>
                    </div>
                 </div>

                 <!-- Embed Existing Subtitle Component, but we need to style it to match -->
                 <!-- We will wrap it in a div that overrides some styles or we just accept it looks slightly different inside -->
                 <div class="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar text-white">
                    <SubtitleEditorComponent
                        subtitles={project.subtitles}
                        selectedSubtitleId={selectedSubtitleId}
                        currentTime={currentTime}
                        onSelect={(id) => selectedSubtitleId = id}
                        onUpdate={handleUpdateSub}
                        onDelete={handleDeleteSub}
                        onSeek={handleSeek}
                    />
                 </div>
            </div>
            {/if}
            {#if activeTab !== 'subtitles'}
               <div class="relative w-[360px] h-full bg-[#2d150f]/40 backdrop-blur-[30px] border-l border-white/15 flex items-center justify-center z-20">
                   <p class="text-white/50">Feature coming soon</p>
               </div>
            {/if}
        </div>

        <!-- Timeline Overlay (Bottom) -->
        <div class="absolute bottom-0 left-0 right-0 z-40 h-28 bg-gradient-to-t from-[#1a0d0a] via-[#3A1C14]/90 to-transparent backdrop-blur-[8px] border-t border-white/10 px-8 flex items-center justify-between">

             <!-- Left Controls -->
             <div class="flex items-center space-x-4">
                <LiquidButton onclick={() => handleSeek(currentTime - 5)}><SkipBack size={18} fill="currentColor" /></LiquidButton>
                <LiquidButton size="lg" class="!bg-white/15 hover:!bg-white/25" onclick={togglePlay}>
                  {#if isPlaying}
                     <Pause size={26} fill="currentColor" class="ml-1" />
                  {:else}
                     <Play size={26} fill="currentColor" class="ml-1" />
                  {/if}
                </LiquidButton>
                <LiquidButton onclick={() => handleSeek(currentTime + 5)}><SkipForward size={18} fill="currentColor" /></LiquidButton>
             </div>

             <!-- Time / Scrub -->
             <div class="flex-1 px-8">
                 <div class="relative w-full h-12 flex items-center">
                     <input
                       type="range"
                       min="0"
                       max={duration || 100}
                       value={currentTime}
                       oninput={(e) => handleSeek(e.currentTarget.valueAsNumber)}
                       class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E5352B]"
                     />
                     <div class="absolute top-0 right-0 text-white/50 text-xs font-mono translate-y-[-100%]">
                        {formatTime(currentTime)} / {formatTime(duration)}
                     </div>
                 </div>
             </div>

             <!-- Right Stats -->
             <div class="flex items-center space-x-3">
                <div class="h-11 px-5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 text-xs font-medium">
                  {project.subtitles.length} Segments
                </div>
                <div class="h-11 px-6 rounded-full bg-white text-[#3A1C14] flex items-center space-x-2 shadow-[0_0_25px_rgba(255,255,255,0.4)] font-bold text-xs">
                   <Activity size={14} />
                   <span>{project.language}</span>
                </div>
             </div>
        </div>
    {:else}
        <div class="flex items-center justify-center h-full text-white">
            Project not found.
        </div>
    {/if}
  </GlassPanel>

  <!-- Global Styles for Scrollbar (Injected via style tag or could be in app.css) -->
  <style>
    :global(.custom-scrollbar::-webkit-scrollbar) {
        width: 4px;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-track) {
        background: transparent;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
    }
  </style>
</div>
